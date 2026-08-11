import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share, ArrowRight, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import StyleCard from '../ui/StyleCard';
import { styleOptions } from '../../data/stylesData';

const ResultsPage = ({ 
  capturedImage, 
  processedImage, 
  selectedGender, 
  selectedStyle, 
  onTryAnother,
  onNewStyle,
  likedStyles,
  onToggleLikeStyle
}) => {
  const [activeTab, setActiveTab] = useState('result'); // result, compare, share
  const [fullscreen, setFullscreen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [viewUrl, setViewUrl] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    // Try to get image from state first, then sessionStorage, then props
    const searchParams = new URLSearchParams(location.search);
    const imageFromUrl = searchParams.get('image');
    const imagePath = location.state?.imagePath || processedImage;
    const driveUrl = location.state?.driveUrl;
    const storedFileName = sessionStorage.getItem('generatedImageFileName');
    const storedStyle = sessionStorage.getItem('selectedStyle');
  
    // If we don't have the style in the component props, but it's in sessionStorage, set it
    if (!selectedStyle && storedStyle) {
      // This would require modifying the parent component to handle this update
      console.log('Using style from sessionStorage:', storedStyle);
    }
  
    console.log('Processing image with:', { imagePath, driveUrl, storedFileName, imageFromUrl });
    
    if (driveUrl) {
      // For Google Drive, try multiple different URL formats that might work
      console.log('Using Drive URL:', driveUrl);
      
      // Set the download URL (for download button)
      setImageUrl(driveUrl);
      
      // Extract file ID from Google Drive URL
      let fileId = null;
      
      // Format: https://drive.google.com/file/d/FILE_ID/view
      if (driveUrl.includes('/d/')) {
        const matches = driveUrl.match(/\/d\/([^\/]+)/);
        if (matches && matches[1]) {
          fileId = matches[1];
        }
      } 
      // Format: https://drive.google.com/file/d/FILE_ID?usp=sharing  
      else if (driveUrl.includes('id=')) {
        fileId = new URLSearchParams(new URL(driveUrl).search).get('id');
      }
      
      if (fileId) {
        // Direct access approach - most reliable for public files
        const directViewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        // Google Photos approach
        const photosUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
        // Thumbnail approach (lower quality but more reliable)
        const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        
        console.log('Trying multiple Drive URLs:', { directViewUrl, photosUrl, thumbnailUrl });
        
        // Set the view URL to the most reliable format
        setViewUrl(thumbnailUrl);
        
        // Try to preload the image to see which URL works best
        const testImage = (url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ url, success: true });
            img.onerror = () => resolve({ url, success: false });
            img.src = url;
          });
        };
        
        // Test all URL formats and use the first one that works
        Promise.all([
          testImage(directViewUrl),
          testImage(photosUrl),
          testImage(thumbnailUrl)
        ]).then(results => {
          const workingUrl = results.find(r => r.success);
          if (workingUrl) {
            console.log('Found working URL:', workingUrl.url);
            setViewUrl(workingUrl.url);
          }
        });
      } else {
        // If we couldn't parse the URL, use it directly
        setViewUrl(driveUrl);
      }
    } else if (imagePath || imageFromUrl || storedFileName) {
      // If we have a full path, extract filename, otherwise use the URL param or stored filename
      const fileName = imagePath ? 
        imagePath.split('\\').pop().split('/').pop() : 
        imageFromUrl || storedFileName;
      
      // Local file
      const localPath = `/outputs/${fileName}`;
      console.log('Using local path:', localPath);
      setImageUrl(localPath);
      setViewUrl(localPath);
      
      // CORS issue debugging - try different local paths
      const alternateLocalPaths = [
        `/outputs/${fileName}`,
        `outputs/${fileName}`,
        `../outputs/${fileName}`
      ];
      
      console.log('Trying alternate local paths:', alternateLocalPaths);
      
      // Simple test to check which path works
      const testImg = (url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ url, success: true });
          img.onerror = () => resolve({ url, success: false });
          img.src = url;
        });
      };
      
      // Test all paths
      Promise.all(alternateLocalPaths.map(testImg))
        .then(results => {
          const working = results.find(r => r.success);
          if (working) {
            console.log('Found working local path:', working.url);
            setViewUrl(working.url);
          }
        });
    } else {
      console.warn('No image path found in location state, URL params, sessionStorage, or props');
    }
  }, [location.state, location.search, processedImage, selectedStyle]);
  

  const selectedStyleInfo = selectedGender && selectedStyle
    ? styleOptions[selectedGender].find(s => s.id === selectedStyle)
    : null;
  
  // Get recommended styles (other styles from the same gender)
  const recommendedStyles = selectedGender && selectedStyle
    ? styleOptions[selectedGender]
        .filter(style => style.id !== selectedStyle)
        .slice(0, 6)
    : [];
  
  const downloadImage = () => {
    // Create a temporary link
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-transformation-${selectedStyleInfo?.name || 'style'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const shareByEmail = () => {
    // Create mailto link with the image information
    const subject = "Orion: Your own AI Transformation";
    const body = `I created this amazing AI transformation with AI Photobooth. Check it out at: ${imageUrl}`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
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
  
  const ImageWithFallback = ({ src, alt, ...props }) => {
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);
    const [fallbackIndex, setFallbackIndex] = useState(0);
    const [useIframe, setUseIframe] = useState(false);
    const [driveId, setDriveId] = useState(null);
    
    // Extract Drive ID if present
    const extractDriveId = (url) => {
      if (!url) return null;
      
      if (url.includes('/d/')) {
        const matches = url.match(/\/d\/([^\/]+)/);
        if (matches && matches[1]) {
          return matches[1];
        }
      }
      
      if (url.includes('id=')) {
        try {
          return new URLSearchParams(new URL(url).search).get('id');
        } catch (e) {
          console.error('Failed to parse URL:', e);
        }
      }
      
      return null;
    };
    
    useEffect(() => {
      // Reset when source changes
      setError(false);
      setFallbackIndex(0);
      setCurrentSrc(src);
      
      // Extract Drive ID on mount
      const id = extractDriveId(src);
      if (id) {
        console.log('Found Drive ID:', id);
        setDriveId(id);
        
        // For Google Drive URLs, use iframe immediately if it contains image extensions
        if (src.match(/\.(jpg|jpeg|png|gif|bmp)$/i) || 
            src.includes('drive.google.com')) {
          setUseIframe(true);
        }
      }
    }, [src]);
    
    // Define fallbacks
    const getFallbacks = () => {
      if (!src) return [];
      
      const fallbacks = [];
      
      // If it's a local path, try variations
      if (src.includes('outputs/')) {
        const fileName = src.split('/').pop();
        fallbacks.push(`/outputs/${fileName}`);
        fallbacks.push(`outputs/${fileName}`);
        fallbacks.push(`../outputs/${fileName}`);
      }
      
      // If we have a Drive ID, try Drive URLs
      if (driveId) {
        fallbacks.push(`https://drive.google.com/uc?export=view&id=${driveId}`);
        fallbacks.push(`https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`);
      }
      
      return fallbacks;
    };
    
    const handleError = () => {
      const fallbacks = getFallbacks();
      
      // Try next fallback
      if (fallbackIndex < fallbacks.length) {
        const nextSrc = fallbacks[fallbackIndex];
        console.log(`Trying fallback ${fallbackIndex + 1}/${fallbacks.length}:`, nextSrc);
        setCurrentSrc(nextSrc);
        setFallbackIndex(fallbackIndex + 1);
      }
      // Try iframe for Drive images
      else if (driveId && !useIframe) {
        console.log('Switching to iframe for Drive image:', driveId);
        setUseIframe(true);
      }
      // Give up
      else {
        setError(true);
      }
    };
    
    // For Drive files, render iframe
    if (useIframe && driveId) {
      return (
        <div className={props.className || ""} style={{ position: 'relative', width: '100%', height: '100%' }}>
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            width="100%"
            height="100%"
            style={{ border: 'none', objectFit: 'cover' }}
            frameBorder="0"
            allowFullScreen
            title={alt || "Preview"}
            onClick={props.onClick}
          />
        </div>
      );
    }
    
    // Error state
    if (error) {
      return (
        <div className={`flex flex-col items-center justify-center bg-gray-800 text-white p-4 ${props.className || ""}`}>
          <p className="text-red-400 mb-2">Failed to load image</p>
          {driveId && (
            <a 
              href={`https://drive.google.com/file/d/${driveId}/view`}
              target="_blank" 
              rel="noreferrer"
              className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
            >
              Open in Google Drive
            </a>
          )}
        </div>
      );
    }
    
    // Regular image
    return <img src={currentSrc} alt={alt} onError={handleError} {...props} />;
  };
  
  return (
    <>
      {fullscreen && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button 
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white z-10"
            onClick={() => setFullscreen(false)}
          >
            <X size={24} />
          </button>
          
          {viewUrl ? (
            <ImageWithFallback 
              src={viewUrl} 
              alt="Transformed" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-white">Image not available</div>
          )}
        </motion.div>
      )}
      
      <motion.div 
        className="min-h-[calc(100vh-180px)] flex flex-col items-center p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h2 className="text-4xl font-bold text-white mb-3">Your Transformation is Complete!</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Here's your AI-powered transformation. Share it or download the image.
          </p>
        </motion.div>
        
        {/* Tab navigation */}
        <motion.div className="mb-8 flex bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-1" variants={itemVariants}>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'result' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('result')}
          >
            Result
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'compare' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('compare')}
          >
            Before & After
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'share' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('share')}
          >
            Share
          </button>
        </motion.div>
        
        <motion.div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center mb-10" variants={itemVariants}>
          {/* Result view */}
          {activeTab === 'result' && (
            <div className="w-full md:w-2/3 mx-auto relative group">
              <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-2xl">
                {viewUrl ? (
                  <ImageWithFallback 
                    src={viewUrl} 
                    alt="Transformed" 
                    className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105 duration-500"
                    onClick={() => setFullscreen(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <p className="text-white">Image not available</p>
                  </div>
                )}
              </div>
              
              {/* Style tag */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-bold">{selectedStyleInfo?.name}</h4>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-white text-sm">{selectedStyleInfo?.popularity}%</span>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  className="p-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full text-white hover:bg-opacity-70 transition-all"
                  onClick={downloadImage}
                >
                  <Download size={20} />
                </button>
                <button 
                  className="p-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full text-white hover:bg-opacity-70 transition-all"
                  onClick={() => setActiveTab('share')}
                >
                  <Share size={20} />
                </button>
                <button 
                  className="p-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full hover:bg-opacity-70 transition-all"
                  onClick={() => onToggleLikeStyle(selectedStyle)}
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors ${likedStyles.includes(selectedStyle) ? "fill-red-500 text-red-500" : "text-white"}`} 
                  />
                </button>
              </div>
            </div>
          )}
          
          {/* Compare view */}
          {activeTab === 'compare' && (
            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 relative">
                <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Original" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <p className="text-white">Original image not available</p>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 left-2 px-3 py-1 bg-black bg-opacity-70 backdrop-blur-sm rounded-md text-white text-sm">
                  Before
                </div>
              </div>
              
              <div className="w-full md:w-1/2 relative group">
                <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg transition-all duration-300">
                  {viewUrl ? (
                    <ImageWithFallback 
                      src={viewUrl} 
                      alt="Transformed" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <p className="text-white">Transformed image not available</p>
                    </div>
                  )}
                </div>
                <div className="absolute top-2 left-2 px-3 py-1 bg-purple-600 rounded-md text-white text-sm">
                  After
                </div>
                
                {/* Style name tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold">{selectedStyleInfo?.name}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-white text-sm">{selectedStyleInfo?.popularity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Share view */}
          {activeTab === 'share' && imageUrl && (
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-6">Share Your Transformation</h3>
                
                {/* QR Code */}
                <div className="mb-8">
                  <div className="bg-white p-4 rounded-xl inline-block mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        viewUrl.startsWith('http') ? viewUrl : `${window.location.origin}${viewUrl.startsWith('/') ? viewUrl : '/' + viewUrl}`
                      )}`} 
                      alt="QR Code" 
                      width={200}
                      height={200}
                    />
                  </div>
                  <p className="text-gray-300 text-sm">Scan to view or download the image</p>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={downloadImage}
                    className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Download size={20} />
                    Download Image
                  </Button>
                  
                  <Button 
                    onClick={shareByEmail}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Share size={20} />
                    Share by Email
                  </Button>
                </div>
                
                <div className="mt-6 text-gray-400 text-sm">
                  <p>You can also copy and share this link:</p>
                  <div className="mt-2 flex gap-2">
                    <input 
                      type="text" 
                      value={imageUrl} 
                      readOnly 
                      className="flex-grow px-3 py-2 bg-gray-700 rounded-lg text-white"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(imageUrl);
                        // You could add a toast notification here
                      }}
                      className="bg-gray-700 hover:bg-gray-600"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Information and Actions - only show on result tab */}
          {activeTab === 'result' && (
            <div className="w-full md:w-1/3 bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Transformation Details</h3>
              
              {selectedStyleInfo && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-purple-400 mb-2">{selectedStyleInfo.name}</h4>
                  <p className="text-gray-300 mb-4">{selectedStyleInfo.description}</p>
                  <div className="flex items-center mb-4">
                    <span className="text-gray-400 mr-2">Style Popularity:</span>
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full" 
                        style={{ width: `${selectedStyleInfo.popularity}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-white">{selectedStyleInfo.popularity}%</span>
                  </div>
                </div>
              )}
              
              {/* Features */}
              {selectedStyleInfo?.features && (
                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">Style Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStyleInfo.features.map((feature, index) => (
                      <span 
                        key={index} 
                        className="inline-block px-3 py-1 bg-purple-500 bg-opacity-30 rounded-full text-white text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={downloadImage}
                  className="flex-1"
                  icon={<Download size={20} />}
                >
                  Download
                </Button>
                <Button 
                  onClick={onTryAnother}
                  variant="secondary"
                  className="flex-1"
                >
                  Try Another
                </Button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Recommended styles */}
        <motion.div className="w-full max-w-6xl" variants={containerVariants}>
          <motion.h3 
            className="text-2xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Try Another Style
          </motion.h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendedStyles.map((style, index) => (
              <motion.div 
                key={style.id}
                variants={itemVariants}
                custom={index}
              >
                <div 
                  className="cursor-pointer group"
                  onClick={() => onNewStyle(style.id)}
                >
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <img 
                      src={style.image} 
                      alt={style.name} 
                      className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="p-2 bg-gray-900 text-center">
                      <h4 className="text-sm font-medium text-white truncate">{style.name}</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ResultsPage; 
