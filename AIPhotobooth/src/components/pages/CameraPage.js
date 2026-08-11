import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, RefreshCw, Check, RotateCcw, Upload, Image } from 'lucide-react';
import Button from '../ui/Button';
import { styleOptions } from '../../data/stylesData';
import { showSaveDialog, generateFilename } from '../../utils/fileUtils';

const CameraPage = ({ selectedGender, selectedStyle, onCapture, onBack }) => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [isAdjustingFrame, setIsAdjustingFrame] = useState(false);
  const [frameAdjustment, setFrameAdjustment] = useState({ x: 0, y: 0, scale: 1 });
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [adjustmentStep, setAdjustmentStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const [cameraLogs, setCameraLogs] = useState([]);
  const [showVideoDebug, setShowVideoDebug] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const adjustmentTimeoutRef = useRef(null);
  const streamRef = useRef(null);
  const logEndRef = useRef(null);
  
  // Get the selected style details
  const selectedStyleInfo = selectedGender && selectedStyle
    ? styleOptions[selectedGender].find(s => s.id === selectedStyle)
    : null;
  
  // Scroll to bottom of logs when they update
  useEffect(() => {
    if (logEndRef.current && showDebug) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cameraLogs, showDebug]);
  
  // Add a log entry with timestamp
  const addLog = useCallback((message) => {
    const timestamp = new Date().toISOString().substring(11, 23);
    setCameraLogs(logs => [...logs.slice(-15), `[${timestamp}] ${message}`]);
    console.log(`[Camera] ${message}`);
  }, []);
  
  // Enumerate available cameras
  const enumerateDevices = useCallback(async () => {
    try {
      // Try to get permission first if needed
      try {
        addLog('Requesting temporary camera access to get complete device info');
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        
        // Stop the temporary stream immediately
        tempStream.getTracks().forEach(track => {
          track.stop();
        });
        addLog('Temporary camera access granted');
      } catch (permErr) {
        addLog(`Could not get initial camera permission: ${permErr.message}`);
      }
      
      // Now enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      addLog(`Found ${videoDevices.length} video devices`);
      
      if (videoDevices.length === 0) {
        addLog('No video devices found - check camera connection');
        setCameraError('No cameras detected. Please connect a camera and reload the page.');
        return;
      }
      
      setAvailableCameras(videoDevices);
      
      // Log all available cameras for debugging
      videoDevices.forEach((device, idx) => {
        addLog(`Camera ${idx+1}: ${device.label || 'Unnamed camera'} (${device.deviceId.substring(0,8)}...)`);
      });
      
      // Use any available camera - don't try to be selective
      // This makes it work with any camera connected to the system
      setSelectedCamera(videoDevices[0].deviceId);
      addLog(`Selected camera: ${videoDevices[0].label || 'Default camera'}`);
      
    } catch (err) {
      addLog(`Error enumerating devices: ${err.message}`);
      setCameraError(`Failed to detect cameras: ${err.message}`);
    }
  }, [addLog]);
  
  // Initialize camera
  useEffect(() => {
    if (isUploadMode) return; // Skip camera initialization if in upload mode
    
    const initializeCamera = async () => {
      // First enumerate devices to get available cameras
      await enumerateDevices();
      
      // This will trigger the next useEffect that actually starts the camera
      setRetryCount(0);
    };
    
    initializeCamera();
    
    return () => {
      // Clean up any existing stream
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          console.log('Stopping track on unmount:', track.kind);
          track.stop();
        });
        streamRef.current = null;
      }
      
      // Clear any pending adjustment timeouts on unmount
      if (adjustmentTimeoutRef.current) {
        clearTimeout(adjustmentTimeoutRef.current);
      }
    };
  }, [isUploadMode, enumerateDevices]);
  
  // Start camera with the selected device or retry
  useEffect(() => {
    if (isUploadMode || retryCount > 3) return;
    
    let timeoutId;
    
    const startCamera = async () => {
      try {
        // Clean up any existing stream
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach(track => {
            addLog(`Stopping previous track: ${track.kind}`);
            track.stop();
          });
          streamRef.current = null;
        }
        
        addLog(`Starting camera attempt ${retryCount + 1}${selectedCamera ? ` with device: ${selectedCamera}` : ''}`);
        
        // Set loading state
        setCameraReady(false);
        setCameraActive(false);
        setCameraError(null);
        
        // Update the camera constraints for better real-time performance
        const constraints = { 
          video: selectedCamera 
            ? { deviceId: { exact: selectedCamera } }
            : true, 
          audio: false 
        };
        
        addLog(`Using constraints: ${JSON.stringify(constraints)}`);
        
        try {
          // Create video element if it doesn't exist yet
          if (!videoRef.current) {
            addLog('Video reference not available - creating dynamic element');
            const tempVideo = document.createElement('video');
            tempVideo.autoplay = true;
            tempVideo.playsInline = true;
            tempVideo.muted = true;
            tempVideo.style.width = '100%';
            tempVideo.style.height = '100%';
            tempVideo.style.objectFit = 'cover';
            videoRef.current = tempVideo;
          }
          
          // Get media stream - try with simpler constraints if needed
          let stream;
          try {
            addLog('Attempting to get camera stream with selected constraints');
            stream = await navigator.mediaDevices.getUserMedia(constraints);
          } catch (initialError) {
            addLog(`Initial stream attempt failed: ${initialError.message}`);
            
            // Try with simplified constraints as fallback
            const fallbackConstraints = { 
              video: true, 
              audio: false 
            };
            
            addLog(`Trying fallback constraints: ${JSON.stringify(fallbackConstraints)}`);
            stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
            addLog('Fallback stream attempt succeeded');
          }
          
          streamRef.current = stream;
          addLog('Camera stream obtained successfully');
          
          // Apply stream to video element
          videoRef.current.srcObject = stream;
          addLog('Stream set to video element');
          
          // Additional fix: detach and reattach stream to trigger proper video display
          setTimeout(() => {
            if (videoRef.current) {
              // Detach stream temporarily
              videoRef.current.srcObject = null;
              // Short delay
              setTimeout(() => {
                if (videoRef.current && streamRef.current) {
                  // Reattach stream
                  videoRef.current.srcObject = streamRef.current;
                  videoRef.current.play().catch(e => addLog(`Play error: ${e}`));
                  addLog('Stream reattached to force refresh');
                }
              }, 100);
            }
          }, 500);
          
          // Set low-latency mode where supported
          try {
            if ('setLatencyHint' in HTMLVideoElement.prototype) {
              // @ts-ignore - TypeScript might not know about this experimental property
              videoRef.current.setLatencyHint('realtime');
              addLog('Low latency hint applied');
            } else if (videoRef.current.style && typeof videoRef.current.style.setProperty === 'function') {
              // Alternative for browsers that support it
              videoRef.current.style.setProperty('latency', '0');
            }
          } catch (latencyErr) {
            addLog(`Note: Could not set low latency mode: ${latencyErr.message}`);
          }
          
          // Improve playback speed - some browsers may support this
          if (stream.getVideoTracks().length > 0) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack.getConstraints && videoTrack.applyConstraints) {
              try {
                // Try to apply real-time constraints to the track if possible
                videoTrack.applyConstraints({ advanced: [{ latency: 0 }] });
                addLog('Applied low-latency constraint to video track');
              } catch (trackErr) {
                addLog(`Note: Could not optimize video track: ${trackErr.message}`);
              }
            }
          }
          
          // Add event listeners to better track camera state
          videoRef.current.onloadedmetadata = () => {
            addLog('Camera metadata loaded');
            setCameraReady(true);
          };
          
          videoRef.current.onloadeddata = () => {
            addLog('Camera data loaded, stream active');
            setCameraReady(true);
            setCameraActive(true);
            setCameraError(null);
            
            // Force redraw of video element
            const videoElement = videoRef.current;
            if (videoElement) {
              addLog(`Video element dimensions: ${videoElement.offsetWidth}x${videoElement.offsetHeight}`);
              addLog(`Video stream dimensions: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
              
              // Force a quick display refresh
              videoElement.style.display = 'none';
              setTimeout(() => {
                if (videoElement) {
                  videoElement.style.display = 'block';
                  addLog('Forced video redraw');
                }
              }, 50);
            }
          };
          
          // Add play event listener to confirm video is actually playing
          videoRef.current.onplaying = () => {
            addLog('Camera video is now playing');
            setCameraReady(true);
            setCameraActive(true);
          };
          
          videoRef.current.onerror = (err) => {
            addLog(`Video element error: ${err}`);
            setCameraError(`Video error: ${err}`);
            setCameraReady(false);
            retryCamera();
          };
          
          // Force play if needed
          try {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(playErr => {
                addLog(`Auto-play failed: ${playErr}`);
                // Add a play button if autoplay is blocked
                setCameraError('Autoplay blocked. Please click the camera icon to start.');
              });
            }
          } catch (playErr) {
            addLog(`Auto-play error: ${playErr}`);
          }
        } catch (streamErr) {
          addLog(`Stream error (attempt ${retryCount + 1}): ${streamErr.message}`);
          setCameraError(`Camera error: ${streamErr.message || 'Access denied'}`);
          retryCamera();
        }
      } catch (err) {
        addLog(`Camera access error (attempt ${retryCount + 1}): ${err.message}`);
        setCameraError(`Camera error: ${err.message || 'Unknown error'}`);
        retryCamera();
      }
    };
    
    const retryCamera = () => {
      if (retryCount < 3) {
        // Try next camera if available
        if (availableCameras.length > 1) {
          const nextCameraIndex = (availableCameras.findIndex(c => c.deviceId === selectedCamera) + 1) % availableCameras.length;
          setSelectedCamera(availableCameras[nextCameraIndex].deviceId);
        }
        // Increment retry counter
        setRetryCount(prevCount => prevCount + 1);
      } else {
        setCameraError('Failed to start camera after multiple attempts. Try refreshing the page or using upload mode.');
      }
    };
    
    // Add a small delay before starting camera
    timeoutId = setTimeout(() => {
      startCamera();
    }, 800);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isUploadMode, selectedCamera, retryCount, availableCameras, addLog]);
  
  // Reset camera
  const resetCamera = useCallback(async () => {
    addLog('Manual camera reset triggered');
    
    // Stop current stream
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        addLog(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Reset states
    setCameraReady(false);
    setCameraActive(false);
    setCameraError(null);
    setRetryCount(0);
    
    // Small delay before re-enumerating devices
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Try to wake up the camera with a direct access attempt
      addLog('Attempting to wake up camera with direct access');
      const tempStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // Get video track info which may be helpful for debugging
      const videoTrack = tempStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? 
          videoTrack.getCapabilities() : 'Not available';
        addLog(`Camera capabilities: ${JSON.stringify(capabilities)}`);
      }
      
      // Stop the temp stream
      tempStream.getTracks().forEach(track => track.stop());
      addLog('Direct camera access successful');
    } catch (err) {
      addLog(`Direct camera access failed: ${err.message}`);
    }
    
    // Re-enumerate devices to get fresh list
    await enumerateDevices();
  }, [enumerateDevices, addLog]);
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a JPG or PNG image');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please select a smaller image.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setUploadedImage(readerEvent.target.result);
      setCapturedPhoto(readerEvent.target.result);
      setShowConfirmation(true);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };
  
  const toggleCameraUploadMode = () => {
    setIsUploadMode(prevMode => !prevMode);
    // Reset states when toggling
    setShowConfirmation(false);
    setCapturedPhoto(null);
    setUploadedImage(null);
  };
  
  // Auto-adjust frame before capture
  const autoAdjustFrame = () => {
    // Reset in case of previous adjustment
    if (adjustmentTimeoutRef.current) {
      clearTimeout(adjustmentTimeoutRef.current);
    }
    
    setIsAdjustingFrame(true);
    setAdjustmentStep(1);
    
    // Predefined sequence of adjustments for more consistent behavior
    const adjustmentSequence = [
      { x: -8, y: -3, scale: 1.03 },
      { x: 5, y: -5, scale: 1.07 },
      { x: -3, y: 2, scale: 1.1 },
      { x: 0, y: 0, scale: 1.05 }
    ];
    
    // First adjustment
    setFrameAdjustment(adjustmentSequence[0]);
    
    // Second adjustment
    adjustmentTimeoutRef.current = setTimeout(() => {
      setAdjustmentStep(2);
      setFrameAdjustment(adjustmentSequence[1]);
      
      // Third adjustment
      adjustmentTimeoutRef.current = setTimeout(() => {
        setAdjustmentStep(3);
        setFrameAdjustment(adjustmentSequence[2]);
        
        // Final fine-tuning adjustment
        adjustmentTimeoutRef.current = setTimeout(() => {
          setAdjustmentStep(4);
          setFrameAdjustment(adjustmentSequence[3]);
          
          // After adjustment is complete, start the countdown
          adjustmentTimeoutRef.current = setTimeout(() => {
            setIsAdjustingFrame(false);
            setAdjustmentStep(0);
            startCountdown();
          }, 600);
        }, 450);
      }, 400);
    }, 350);
  };
  
  // Handle countdown and capture
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdownValue(3);
    
    const countdownInterval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            capturePhoto();
            setIsCountingDown(false);
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Handle direct photo capture without auto-adjust
  const takePhotoDirectly = () => {
    if (!cameraReady) {
      console.warn('Camera not ready yet');
      return;
    }
    
    startCountdown();
  };
  
  const capturePhoto = () => {
    addLog('Capturing photo from camera...');
    let capturedImageUrl;
    
    try {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Print detailed info about the video stream
        addLog(`Video element status - Ready: ${cameraReady}, Active: ${cameraActive}`);
        addLog(`Video dimensions: ${video.videoWidth}x${video.videoHeight}, Display: ${video.offsetWidth}x${video.offsetHeight}`);
        
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          addLog('WARNING: Video dimensions are zero, using fallback dimensions');
        }
        
        // Set canvas dimensions to match video - with fallback for zero dimensions
        const canvasWidth = video.videoWidth || video.offsetWidth || 640;
        const canvasHeight = video.videoHeight || video.offsetHeight || 480;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        addLog(`Canvas set to: ${canvas.width}x${canvas.height}`);
        
        // Clear the canvas first
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
        
        // Add visible border to help debug image capture
        context.strokeStyle = '#8B5CF6'; // Purple border
        context.lineWidth = 3;
        context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
        
        // Get image data
        capturedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        addLog('Photo captured successfully');
      } else {
        addLog('Camera or canvas reference not available for capture');
        // Fallback to placeholder
        capturedImageUrl = selectedGender === 'male' 
          ? require('../../assets/images/Iron_Man_Style.jpg') 
          : require('../../assets/images/Iron_Woman_Style.jpg');
      }
    } catch (error) {
      addLog(`Error capturing photo: ${error.message}`);
      // Provide a fallback image on error
      capturedImageUrl = selectedGender === 'male' 
        ? require('../../assets/images/Iron_Man_Style.jpg') 
        : require('../../assets/images/Iron_Woman_Style.jpg');
    }
    
    // Store the captured image and show confirmation
    setCapturedPhoto(capturedImageUrl);
    setShowConfirmation(true);
  };
  
  const confirmPhoto = async () => {
    try {
      // Show save dialog and get the file path
      const filePath = await showSaveDialog(
        capturedPhoto,
        generateFilename(selectedStyle)
      );
      
      // Only proceed if user didn't cancel
      if (filePath) {
        console.log('File saved as:', filePath);
        onCapture(capturedPhoto);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setCameraError('Failed to save the photo. Please try again.');
    }
  };
  
  const retakePhoto = () => {
    // Reset states
    setIsCountingDown(false);
    setCountdownValue(3);
    setFrameAdjustment({ x: 0, y: 0, scale: 1 });
    setCapturedPhoto(null);
    setUploadedImage(null);
    setShowConfirmation(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: { ease: 'easeInOut' }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const popupVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };
  
  return (
    <motion.div 
      className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <h2 className="text-4xl font-bold text-white mb-3">
          {isUploadMode ? "Upload Your Photo" : "Capture Your Photo"}
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {isUploadMode 
            ? "Select an image from your device to transform" 
            : "Position yourself in the frame and click capture when ready"
          }
        </p>
      </motion.div>
      
      {/* Toggle between camera and upload */}
      <motion.div 
        className="flex justify-center mb-6" 
        variants={itemVariants}
      >
        <div className="bg-gray-800 p-1 rounded-lg flex">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${!isUploadMode ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => isUploadMode && toggleCameraUploadMode()}
          >
            <Camera size={18} className="mr-2" /> Camera
          </button>
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${isUploadMode ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => !isUploadMode && toggleCameraUploadMode()}
          >
            <Upload size={18} className="mr-2" /> Upload
          </button>
        </div>
      </motion.div>
      
      <motion.div 
        className="relative w-full max-w-xl mx-auto mb-8"
        variants={itemVariants}
      >
        {/* File input hidden element */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
        />
        
        {/* Camera viewfinder or Upload area */}
        <div className="aspect-[3/4] rounded-xl overflow-hidden border-4 border-gray-800 bg-black shadow-2xl relative">
          {isUploadMode ? (
            // Upload interface
            <div className="absolute inset-0 bg-gray-900 flex flex-col justify-center items-center p-6">
              {uploadedImage ? (
                <img 
                  src={uploadedImage}
                  alt="Uploaded"
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : (
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6 cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: "#4c1d95" }}
                    onClick={triggerFileUpload}
                  >
                    <Image size={48} className="text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl text-white mb-3">Click to upload</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    JPG or PNG • Max 10MB
                  </p>
                  <button
                    onClick={triggerFileUpload}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Choose Photo
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            // Camera interface
            <div className="absolute inset-0 flex justify-center items-center">
              {/* Show the live video feed */}
              {cameraReady ? (
                <video 
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  autoPlay
                  playsInline
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                  style={{ 
                    backgroundColor: '#000',
                    display: 'block', 
                    visibility: 'visible',
                    objectFit: 'cover',
                    minHeight: '100%',
                    minWidth: '100%'
                  }}
                />
              ) : (
                <div className="text-gray-300 flex flex-col items-center">
                  {cameraError ? (
                    <div className="text-center p-8">
                      <div className="bg-red-900/30 p-6 rounded-lg border border-red-800 mb-6">
                        <X size={50} className="text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Camera Error</h3>
                        <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
                        
                        <div className="flex flex-col gap-3 mt-4">
                          <button
                            onClick={resetCamera}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center text-white"
                          >
                            <RefreshCw size={16} className="mr-2" /> Try Again
                          </button>
                          
                          <button
                            onClick={() => setIsUploadMode(true)}
                            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded flex items-center justify-center text-white"
                          >
                            <Upload size={16} className="mr-2" /> Switch to Upload Mode
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-black/30 p-4 rounded-lg text-left">
                        <h4 className="text-white font-semibold mb-2 text-sm">Troubleshooting Tips:</h4>
                        <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                          <li>Make sure your camera is properly connected (USB / built-in)</li>
                          <li>Check if your browser has camera permissions</li>
                          <li>Ensure no other applications are using the camera</li>
                          <li>Try restarting your computer if issues persist</li>
                          <li>If using Windows, check Device Manager to confirm camera is recognized</li>
                          <li>Try using a different USB port</li>
                        </ul>
                      </div>
                      
                      <p className="text-sm text-gray-400 mt-4">
                        If your camera isn't working, you can switch to upload mode to use an existing photo.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera size={80} className="mb-4 animate-pulse text-purple-400" />
                      <p className="text-xl mb-3">Initializing camera...</p>
                      <div className="flex justify-center">
                        <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 animate-[pulse_1.5s_ease-in-out_infinite] w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Canvas for capturing the image */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Countdown overlay */}
              {isCountingDown && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <motion.div 
                    key="countdown"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="text-8xl font-bold text-white"
                  >
                    {countdownValue}
                  </motion.div>
                </div>
              )}
            </div>
          )}
          
          {/* Camera interface elements - only show for camera mode */}
          {!isUploadMode && !showConfirmation && (
            <>
              <div className="absolute top-4 left-4 flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="px-2 py-1 bg-black bg-opacity-50 backdrop-blur-sm rounded-md text-white text-xs">
                  LIVE
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex items-center px-2 py-1 bg-black bg-opacity-50 backdrop-blur-sm rounded-md">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-white text-xs">{cameraReady ? "Ready" : "Connecting..."}</span>
              </div>
              
              {/* Add debug toggle button at the top right corner */}
              <div className="absolute top-16 right-4">
                <button
                  onClick={() => setShowVideoDebug(!showVideoDebug)}
                  className="px-2 py-1 bg-black bg-opacity-50 backdrop-blur-sm rounded-md text-xs text-white hover:bg-opacity-70"
                >
                  {showVideoDebug ? 'Hide Debug' : 'Show Debug'}
                </button>
              </div>
            </>
          )}
          
          {/* Auto-adjusting indicator */}
          <AnimatePresence>
            {isAdjustingFrame && (
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white text-sm rounded-full flex items-center z-20"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <RefreshCw size={16} className="mr-2 animate-spin" />
                {adjustmentStep === 4 ? 'Finalizing...' : 'Auto-adjusting frame...'}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Frame guidelines - only show for camera mode */}
          {!isUploadMode && showGuidelines && cameraReady && !isCountingDown && !isAdjustingFrame && !showConfirmation && (
            <>
              <div className="absolute inset-0 border-2 border-dashed border-white border-opacity-30 m-8 pointer-events-none z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-blue-400 border-opacity-50 rounded-full pointer-events-none z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-blue-400 border-opacity-70 rounded-full pointer-events-none z-10"></div>
              
              <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-md flex items-center z-10">
                <button 
                  className="text-blue-400 flex items-center"
                  onClick={() => setShowGuidelines(false)}
                >
                  <X size={16} className="mr-1" /> Hide Guidelines
                </button>
              </div>
            </>
          )}
          
          {!isUploadMode && !showGuidelines && cameraReady && !isCountingDown && !isAdjustingFrame && !showConfirmation && (
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-md flex items-center z-10">
              <button 
                className="text-blue-400 flex items-center"
                onClick={() => setShowGuidelines(true)}
              >
                <RefreshCw size={16} className="mr-1" /> Show Guidelines
              </button>
            </div>
          )}
          
          {/* Flash effect when taking photo */}
          <AnimatePresence>
            {countdownValue === 0 && (
              <motion.div 
                className="absolute inset-0 bg-white z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
          
          {/* Focus points during auto-adjustment */}
          <AnimatePresence>
            {isAdjustingFrame && (
              <>
                <motion.div 
                  className="absolute w-24 h-24 border-2 border-yellow-400 rounded-full z-20"
                  style={{ 
                    top: 'calc(50% - 48px)',
                    left: 'calc(50% - 48px)'
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 1, 0.5, 0],
                    scale: [0.8, 1, 1.1, 1.2],
                    x: [0, 10, -5, 0],
                    y: [0, -5, 10, 0]
                  }}
                  transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1], repeat: Infinity, repeatType: "loop" }}
                />
                
                {/* Additional focus points that follow adjustment steps */}
                {[1, 2, 3, 4].map((step) => (
                  adjustmentStep >= step && (
                    <motion.div 
                      key={`focus-point-${step}`}
                      className={`absolute w-4 h-4 border border-${step === 4 ? 'green' : 'blue'}-400 rounded-full z-20`}
                      style={{ 
                        top: `calc(50% + ${(step % 2) * 20 - 10}px)`,
                        left: `calc(50% + ${(step === 1 || step === 3) ? -20 : 20}px)`
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* Photo confirmation overlay */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div 
                className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center p-6 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  variants={popupVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-md bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-purple-500"
                >
                  <div className="p-3 bg-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {isUploadMode ? "Uploaded Photo" : "Captured Photo"}
                    </h3>
                    <div className="flex space-x-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  
                  <div className="p-5 pb-6">
                    <div className="rounded-lg overflow-hidden mb-6 border-2 border-purple-400 shadow-lg">
                      <img 
                        src={capturedPhoto} 
                        alt="Captured photo" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    
                    <div className="text-center text-white mb-6">
                      <p className="text-lg font-medium">Is this photo ok?</p>
                    </div>
                    
                    <div className="flex justify-center gap-6 px-4">
                      <button
                        onClick={retakePhoto}
                        className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-medium transition-colors text-lg flex items-center justify-center"
                      >
                        <RotateCcw size={18} className="mr-2" /> {isUploadMode ? "Select Another" : "Retake"}
                      </button>
                      
                      <button
                        onClick={confirmPhoto}
                        className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors text-lg flex items-center justify-center"
                      >
                        <Check size={18} className="mr-2" /> Confirm
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Style preview */}
        {selectedStyleInfo && !showConfirmation && (
          <motion.div 
            className="absolute -right-16 -top-10 w-32 h-40 rounded-lg overflow-hidden border-2 border-purple-500 shadow-xl rotate-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <img 
              src={selectedStyleInfo.image} 
              alt="Selected style" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-1 text-center">
              <p className="text-xs text-white">{selectedStyleInfo.name}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Action buttons - only show if not in confirmation mode */}
      {!showConfirmation && (
        <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
          {isUploadMode ? (
            <Button
              onClick={triggerFileUpload}
              size="large"
              icon={<Upload size={24} />}
              className="mb-4"
            >
              Upload Photo
            </Button>
          ) : (
            <Button
              onClick={autoAdjustFrame}
              disabled={!cameraReady || isCountingDown || cameraError || isAdjustingFrame}
              size="large"
              icon={<Camera size={24} />}
              className={`mb-4 ${(isAdjustingFrame || !cameraReady) ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {!cameraReady ? 'Waiting for camera...' : (isAdjustingFrame ? 'Adjusting...' : (isCountingDown ? 'Capturing...' : 'Take Photo'))}
            </Button>
          )}
          
          <p className="text-gray-400 text-sm max-w-md text-center">
            {isUploadMode 
              ? "Accepted formats: JPG, PNG. For best results, use a clear face photo."
              : "Stand straight, ensure good lighting, and look directly at the camera for best results"
            }
          </p>
          
          {/* Photo tips for better shots */}
          {!isUploadMode && cameraActive && (
            <div className="mt-4 w-full max-w-lg">
              <details className="bg-gray-800/50 rounded-lg text-sm">
                <summary className="p-3 cursor-pointer text-gray-300 hover:text-white">
                  📷 Photo capture tips
                </summary>
                <ul className="p-4 pt-2 space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span> Ensure your face is well-lit and centered in the frame
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span> Look directly at the camera for the best results
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span> Keep your head and shoulders visible in the shot
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span> If using glasses, adjust to avoid glare
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">✓</span> If camera doesn't work, try the "Reset Camera" option or switch to Upload mode
                  </li>
                </ul>
              </details>
            </div>
          )}
          
          {/* Debug toggle */}
          <div className="w-full max-w-lg flex justify-end mt-2">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded"
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
          </div>
          
          {/* Debug panel */}
          {showDebug && (
            <motion.div 
              className="mt-2 w-full max-w-lg bg-black/60 backdrop-blur-sm p-3 rounded text-xs font-mono"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="text-gray-400 mb-1 font-sans">Camera Debug Info:</h3>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-gray-900 p-1.5 rounded">Ready: <span className={cameraReady ? 'text-green-400' : 'text-red-400'}>{cameraReady ? 'Yes' : 'No'}</span></div>
                <div className="bg-gray-900 p-1.5 rounded">Active: <span className={cameraActive ? 'text-green-400' : 'text-red-400'}>{cameraActive ? 'Yes' : 'No'}</span></div>
                <div className="bg-gray-900 p-1.5 rounded">Retries: <span className={retryCount > 0 ? 'text-yellow-400' : 'text-green-400'}>{retryCount}/3</span></div>
              </div>
              <h4 className="text-gray-400 mb-1 font-sans text-2xs">Log:</h4>
              <div className="bg-gray-900 p-1.5 rounded h-24 overflow-y-auto text-2xs text-gray-400">
                {cameraLogs.length === 0 ? (
                  <div className="italic">No logs yet</div>
                ) : (
                  <div>
                    {cameraLogs.map((log, i) => (
                      <div key={i} className="leading-tight">{log}</div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Back button - only show if not in confirmation mode */}
      {!showConfirmation && (
        <motion.div className="flex justify-between w-full max-w-xl" variants={itemVariants}>
          <Button
            onClick={onBack}
            variant="secondary"
            disabled={isCountingDown || isAdjustingFrame}
          >
            Back
          </Button>
        </motion.div>
      )}

      {/* Camera control panel - only show when camera error or active */}
      {!isUploadMode && !showConfirmation && (cameraError || cameraActive) && (
        <div className="absolute bottom-4 right-4 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={resetCamera}
              className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              <RefreshCw size={14} /> Reset Camera
            </button>
            
            {availableCameras.length > 1 && (
              <select
                className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-700"
                value={selectedCamera || ''}
                onChange={(e) => {
                  setSelectedCamera(e.target.value);
                  setRetryCount(0); // Reset retry count when manually selecting
                }}
              >
                <option value="">Auto-select</option>
                {availableCameras.map((camera, index) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {cameraError && (
            <div className="mt-2 text-xs text-red-300">
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* Debug overlay for video visibility */}
      {!isUploadMode && showVideoDebug && cameraReady && (
        <div className="absolute inset-0 bg-black/80 text-white p-4 z-50 font-mono text-xs overflow-auto">
          <h3 className="font-bold mb-2">Video Debug Info:</h3>
          <div className="grid grid-cols-2 gap-1 mb-4">
            <div className="bg-gray-800 p-1">Video Ref Present: {videoRef.current ? 'Yes' : 'No'}</div>
            <div className="bg-gray-800 p-1">Stream Present: {streamRef.current ? 'Yes' : 'No'}</div>
            <div className="bg-gray-800 p-1">Camera Ready: {cameraReady ? 'Yes' : 'No'}</div>
            <div className="bg-gray-800 p-1">Camera Active: {cameraActive ? 'Yes' : 'No'}</div>
            {videoRef.current && (
              <>
                <div className="bg-gray-800 p-1">Video Width: {videoRef.current.videoWidth || 'N/A'}</div>
                <div className="bg-gray-800 p-1">Video Height: {videoRef.current.videoHeight || 'N/A'}</div>
                <div className="bg-gray-800 p-1">DOM Width: {videoRef.current.offsetWidth || 'N/A'}</div>
                <div className="bg-gray-800 p-1">DOM Height: {videoRef.current.offsetHeight || 'N/A'}</div>
                <div className="bg-gray-800 p-1">Paused: {videoRef.current.paused ? 'Yes' : 'No'}</div>
                <div className="bg-gray-800 p-1">Duration: {videoRef.current.duration || 'N/A'}</div>
                <div className="bg-gray-800 p-1">Muted: {videoRef.current.muted ? 'Yes' : 'No'}</div>
                <div className="bg-gray-800 p-1">Readystate: {videoRef.current.readyState || 'N/A'}</div>
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.style.display = videoRef.current.style.display === 'none' ? 'block' : 'none';
                  addLog(`Toggled video display: ${videoRef.current.style.display}`);
                }
              }}
              className="px-2 py-1 bg-blue-600 rounded text-white"
            >
              Toggle Video Element Visibility
            </button>
            
            <button
              onClick={() => {
                if (videoRef.current && videoRef.current.play) {
                  videoRef.current.play().catch(err => addLog(`Play error: ${err.message}`));
                  addLog('Manually triggered video play');
                }
              }}
              className="px-2 py-1 bg-green-600 rounded text-white"
            >
              Force Play Video
            </button>
            
            <button
              onClick={() => resetCamera()}
              className="px-2 py-1 bg-purple-600 rounded text-white"
            >
              Reset Camera
            </button>
          </div>
          
          <button
            onClick={() => setShowVideoDebug(false)}
            className="absolute top-2 right-2 text-white"
          >
            ✕
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CameraPage; 