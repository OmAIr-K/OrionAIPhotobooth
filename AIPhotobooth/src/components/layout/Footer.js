import React from 'react';
import { motion } from 'framer-motion';

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  
  // Function to handle navigation with scroll to top
  const handleNavigation = (page) => {
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate to the page
    if (typeof onNavigate === 'function') {
      // Add a small delay to allow smooth scroll to start
      setTimeout(() => {
        onNavigate(page);
        console.log(`Navigating to: ${page}`);
      }, 100);
    } else {
      console.warn('Navigation function not provided to Footer component');
      
      // Fallback navigation using window.location for critical pages
      if (page === 'home') {
        window.location.href = '/';
      } else if (page === 'gallery') {
        window.location.href = '/gallery';
      } else if (page === 'about') {
        window.location.href = '/about';
      } else if (page === 'contact') {
        window.location.href = '/contact';
      }
    }
  };
  
  return (
    <footer className="w-full py-12 px-4 bg-gradient-to-b from-black/80 to-purple-900/20 backdrop-blur-md text-white shadow-[0_-5px_25px_rgba(91,33,182,0.1)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo and description */}
          <div className="md:col-span-5 mb-6 md:mb-0">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mr-3 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">AI</span>
                </div>
                AI <span className="text-purple-400 ml-1">Photobooth</span>
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Transform your photos with AI magic. Create stunning AI-generated portraits in various artistic styles with our cutting-edge technology.
              </p>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
            </motion.div>
          </div>
          
          {/* Navigation links */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-purple-400 pb-2 border-b border-purple-500/20">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleNavigation('home')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('gallery')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Gallery
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('about')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('contact')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Contact
                  </button>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-purple-400 pb-2 border-b border-purple-500/20">Legal</h3>
              <ul className="space-y-3 mb-6">
                <li>
                  <button 
                    onClick={() => handleNavigation('terms')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('privacy')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Privacy Policy
                  </button>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-4 text-purple-400 pb-2 border-b border-purple-500/20">Contact Us</h3>
              <p className="text-gray-300 mb-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                orion2024@gmail.com
              </p>
              <p className="text-gray-300 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                Dubai, UAE
              </p>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-purple-500/10 mt-10 pt-6 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AI Photobooth | Transform your photos with AI magic
            </p>
            <div className="flex space-x-4 text-gray-400 text-sm">
              <button onClick={() => handleNavigation('terms')} className="hover:text-purple-400 transition-colors">Terms</button>
              <span>•</span>
              <button onClick={() => handleNavigation('privacy')} className="hover:text-purple-400 transition-colors">Privacy</button>
              <span>•</span>
              <button onClick={() => handleNavigation('contact')} className="hover:text-purple-400 transition-colors">Contact</button>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            AI Photobooth uses cutting-edge artificial intelligence to transform your photos into stunning works of art.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 