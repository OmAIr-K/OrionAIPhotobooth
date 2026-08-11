import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/A.png';

const Header = ({ onNavigate, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  
  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Handle navigation with scroll to top
  const handleNavigate = (page) => {
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate to the page
    onNavigate(page);
  };
  
  return (
    <header className={`w-full p-4 fixed top-0 left-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black bg-opacity-80 backdrop-blur-md shadow-lg' 
        : 'bg-black bg-opacity-40 backdrop-blur-md'
    }`}>
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="AI Photobooth Logo" className="h-10 mr-3" />
          <h1 className="text-3xl font-bold text-white cursor-pointer" onClick={() => handleNavigate('home')}>
            AI <span className="text-purple-500">Photobooth</span>
          </h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li 
              className={`cursor-pointer transition-colors ${
                currentPage === 'home' 
                  ? 'text-purple-400 font-medium' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => handleNavigate('home')}
            >
              Home
            </li>
            <li 
              className={`cursor-pointer transition-colors ${
                currentPage === 'gallery' 
                  ? 'text-purple-400 font-medium' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => handleNavigate('gallery')}
            >
              Gallery
            </li>
            <li 
              className={`cursor-pointer transition-colors ${
                currentPage === 'about' 
                  ? 'text-purple-400 font-medium' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => handleNavigate('about')}
            >
              About
            </li>
            <li 
              className={`cursor-pointer transition-colors ${
                currentPage === 'contact' 
                  ? 'text-purple-400 font-medium' 
                  : 'text-white hover:text-purple-400'
              }`}
              onClick={() => handleNavigate('contact')}
            >
              Contact
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 