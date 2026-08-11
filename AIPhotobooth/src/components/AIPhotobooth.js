import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Layouts
import Header from './layout/Header';
import Footer from './layout/Footer';
import BackgroundVideo from './layout/BackgroundVideo';
import ProgressIndicator from './layout/ProgressIndicator';

// Pages
import StartPage from './pages/StartPage';
import GenderSelection from './pages/GenderSelection';
import StyleSelection from './pages/StyleSelection';
import CameraPage from './pages/CameraPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';

// Import the X icon for fullscreen mode
import { X } from 'lucide-react';

const AIPhotobooth = () => {
  const navigate = useNavigate();
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [likedStyles, setLikedStyles] = useState([]);
  const [customStylePrompt, setCustomStylePrompt] = useState(null);
  
  // Steps of the process
  const steps = [
    "Start",
    "Gender Selection",
    "Style Selection",
    "Photo Capture",
    "Processing",
    "Results"
  ];
  
  // Handler functions
  const handleStartClick = () => {
    setCurrentStep(1);
    navigate('/gender-selection');
  };
  
  const handleGalleryClick = () => {
    navigate('/gallery');
  };
  
  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
    setCurrentStep(2);
    navigate('/style-selection');
  };
  
  const handleSelectStyle = (styleId, customPrompt = null) => {
    if (currentStep !== 2) return;
    
    setSelectedStyle(styleId);
    setCustomStylePrompt(customPrompt);
    setCurrentStep(3);
    navigate('/camera');
  };
  
  const handleCapturePhoto = (image) => {
    setCapturedImage(image);
    setCurrentStep(4);
    navigate('/processing');
  };
  
  const handleProcessingComplete = (processedImg) => {
    setProcessedImage(processedImg);
    setCurrentStep(5);
    navigate('/results');
  };
  
  const handleTryAnother = () => {
    // Reset states
    setSelectedGender(null);
    setSelectedStyle(null);
    setCapturedImage(null);
    setProcessedImage(null);
    setCurrentStep(0);
    navigate('/');
  };
  
  const handleNewStyle = (styleId) => {
    setSelectedStyle(styleId);
    setCurrentStep(4);
    navigate('/processing');
  };
  
  const toggleLikeStyle = (styleId) => {
    setLikedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId);
      } else {
        return [...prev, styleId];
      }
    });
  };

  // Navigation handlers
  const handleNavigate = (page) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    if (page === 'home') {
      setCurrentStep(0);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col text-white">
      <BackgroundVideo />
      <Header onNavigate={handleNavigate} currentPage={window.location.pathname.substring(1) || 'home'} />
      
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <StartPage onStart={handleStartClick} onGallery={handleGalleryClick} />
            } />
            <Route path="/gender-selection" element={
              <GenderSelection 
                onSelectGender={handleSelectGender} 
                onBack={() => { setCurrentStep(0); navigate('/'); }}
                selectedGender={selectedGender}
              />
            } />
            <Route path="/style-selection" element={
              <StyleSelection 
                selectedGender={selectedGender}
                onSelectStyle={handleSelectStyle}
                onBack={() => { setCurrentStep(1); navigate('/gender-selection'); }}
                selectedStyle={selectedStyle}
                likedStyles={likedStyles}
                onToggleLikeStyle={toggleLikeStyle}
              />
            } />
            <Route path="/camera" element={
              <CameraPage 
                selectedGender={selectedGender}
                selectedStyle={selectedStyle}
                onCapture={handleCapturePhoto}
                onBack={() => { setCurrentStep(2); navigate('/style-selection'); }}
              />
            } />
            <Route path="/processing" element={
              <ProcessingPage 
                capturedImage={capturedImage}
                selectedGender={selectedGender}
                selectedStyle={selectedStyle}
                customPrompt={customStylePrompt}
                onComplete={handleProcessingComplete}
              />
            } />
            <Route path="/results" element={
              <ResultsPage 
                capturedImage={capturedImage}
                processedImage={processedImage}
                selectedGender={selectedGender}
                selectedStyle={selectedStyle}
                onTryAnother={handleTryAnother}
                onNewStyle={handleNewStyle}
                likedStyles={likedStyles}
                onToggleLikeStyle={toggleLikeStyle}
              />
            } />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      {currentStep > 0 && currentStep < steps.length && (
        <ProgressIndicator steps={steps} currentStep={currentStep} />
      )}
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default AIPhotobooth; 