import React, { useRef, useEffect } from 'react';
import backgroundVideo from '../../assets/videos/background.mp4';

const BackgroundVideo = () => {
  const videoRef = useRef(null);
  
  // Ensure the video is muted to allow autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.error('Video autoplay failed:', error);
      });
    }
  }, []);
  
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {/* Main video background */}
      <video 
        ref={videoRef}
        className="absolute min-w-full min-h-full object-cover w-auto h-auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-black/90 z-10"></div>
      
      {/* Additional effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-indigo-900/30 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,50,255,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
      
      {/* Animated particles (light dots) */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute w-2 h-2 rounded-full bg-purple-300 top-1/4 left-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-3 h-3 rounded-full bg-blue-300 top-3/4 left-2/3 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute w-1 h-1 rounded-full bg-indigo-300 top-1/2 left-1/3 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute w-2 h-2 rounded-full bg-purple-300 top-1/3 right-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute w-2 h-2 rounded-full bg-blue-300 bottom-1/4 right-1/3 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default BackgroundVideo; 