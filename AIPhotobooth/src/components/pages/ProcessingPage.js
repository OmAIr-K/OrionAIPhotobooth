import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import backendService from '../../services/websocketService';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProcessingPage = ({ selectedStyle, customPrompt, onComplete }) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const generationStartedRef = useRef(false);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (!selectedStyle) {
            navigate('/style-selection');
            return;
        }

        // Create new AbortController for this effect instance
        abortControllerRef.current = new AbortController();

        // Only start generation if not already started
        if (!generationStartedRef.current) {
            generationStartedRef.current = true;
            startGeneration(abortControllerRef.current.signal);
        }

        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(); // Cancel any in-flight requests
            }
            generationStartedRef.current = false;
        };
    }, [selectedStyle, navigate]); // Add navigate to dependencies

    const startGeneration = async (signal) => {
        if (status === 'processing') {
            return; // Prevent concurrent generations
        }

        try {
            setStatus('processing');
            setError(null);
            
            const response = await backendService.startGeneration(selectedStyle, customPrompt, signal);
            
            // Check if the component is still mounted and the request wasn't aborted
            if (!signal.aborted && response.status === 'success' && response.image_path) {
                setStatus('completed');
                onComplete && onComplete(response.image_path);
                
                // Store the image path in sessionStorage for persistence across refreshes
                const fileName = response.image_path.split('\\').pop().split('/').pop();
                sessionStorage.setItem('generatedImageFileName', fileName);
                sessionStorage.setItem('selectedStyle', selectedStyle);
                
                navigate('/results', { 
                    state: { imagePath: response.image_path, driveUrl: response.drive_url },
                    replace: true // Replace current history entry to prevent back navigation issues
                });
            } else if (!signal.aborted) {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            // Only set error if the request wasn't aborted
            if (!signal.aborted) {
                console.error('Generation error:', error);
                setError(error.message || 'Failed to generate image');
                setStatus('error');
            }
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'idle':
                return 'Preparing for image generation...';
            case 'processing':
                return 'Generating your image (this may take several minutes)...';
            case 'completed':
                return 'Generation completed!';
            case 'error':
                return `Error: ${error}`;
            default:
                return 'Processing...';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="text-center max-w-xl mx-auto">
                <LoadingSpinner size={64} />
                <h2 className="text-2xl font-bold text-white mt-6 mb-3">
                    {getStatusMessage()}
                </h2>
                {status === 'processing' && (
                    <p className="text-gray-400">
                        Please wait while we process your image. This may take several minutes...
                    </p>
                )}
                {status === 'error' && (
                    <div className="mt-4">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => {
                                generationStartedRef.current = false;
                                startGeneration();
                            }}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            disabled={status === 'processing'}
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProcessingPage; 