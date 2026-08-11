import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

const ResultPage = ({ 
  originalImage,
  generatedImagePath,
  selectedStyle,
  onRetake
}) => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the generated image from local file system
    const loadGeneratedImage = async () => {
      try {
        // Create a URL for the local file
        const response = await fetch(`file://${generatedImagePath}`);
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setGeneratedImage(imageUrl);
      } catch (err) {
        console.error('Error loading generated image:', err);
        setError('Failed to load the generated image');
      }
    };

    if (generatedImagePath) {
      loadGeneratedImage();
    }

    // Cleanup
    return () => {
      if (generatedImage) {
        URL.revokeObjectURL(generatedImage);
      }
    };
  }, [generatedImagePath]);

  const handleDownload = async () => {
    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated_${selectedStyle}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download the image');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const blob = await fetch(generatedImage).then(r => r.blob());
        const file = new File([blob], 'generated_image.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'My AI Generated Photo',
          text: 'Check out my AI-transformed photo!',
          files: [file]
        });
      } else {
        setError('Sharing is not supported on this device');
      }
    } catch (err) {
      console.error('Error sharing image:', err);
      setError('Failed to share the image');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
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

  return (
    <motion.div 
      className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-10" variants={itemVariants}>
        <h2 className="text-4xl font-bold text-white mb-3">Your Transformed Photo</h2>
        <p className="text-xl text-gray-300">Here's your AI-generated masterpiece!</p>
      </motion.div>

      <motion.div 
        className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center mb-10"
        variants={itemVariants}
      >
        {/* Original Image */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border-4 border-gray-800 bg-black shadow-2xl">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-gray-400 mt-2">Original Photo</p>
        </div>

        {/* Generated Image */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="aspect-[3/4] rounded-xl overflow-hidden border-4 border-purple-500 bg-black shadow-2xl">
            {error ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <p className="text-red-400 text-center p-4">{error}</p>
              </div>
            ) : !generatedImage ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : (
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-center text-gray-400 mt-2">Generated Photo</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4"
        variants={itemVariants}
      >
        <Button
          onClick={handleDownload}
          disabled={!generatedImage || !!error}
          icon={<Download size={20} />}
        >
          Download
        </Button>

        <Button
          onClick={handleShare}
          disabled={!generatedImage || !!error || !navigator.share}
          icon={<Share size={20} />}
        >
          Share
        </Button>

        <Button
          onClick={onRetake}
          variant="secondary"
          icon={<RotateCcw size={20} />}
        >
          Take Another Photo
        </Button>
      </motion.div>

      {error && (
        <motion.div 
          className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg"
          variants={itemVariants}
        >
          <p className="text-red-400 text-center">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultPage; 