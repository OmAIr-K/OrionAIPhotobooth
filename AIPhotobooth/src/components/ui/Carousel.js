import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Carousel = ({ 
  items, 
  renderItem,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = ''
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  }, [items.length]);
  
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  
  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay || isPaused) return;
    
    const slideInterval = setInterval(goToNextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [autoPlay, isPaused, goToNextSlide, interval]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);
  
  return (
    <div 
      className={`relative w-full overflow-hidden rounded-xl shadow-2xl ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button 
            onClick={goToPrevSlide} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-sm 
                     hover:bg-opacity-70 rounded-full p-2 text-white transition-all hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={goToNextSlide} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-sm 
                     hover:bg-opacity-70 rounded-full p-2 text-white transition-all hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Dots indicators */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-gray-500 hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel; 