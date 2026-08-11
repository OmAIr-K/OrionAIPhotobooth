import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-4 py-4 bg-black bg-opacity-40 backdrop-blur-md sticky top-16 z-40 shadow-md">
      <div className="flex justify-center items-center max-w-4xl mx-auto">
        <div className="w-full flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className={`relative rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                    currentStep === index 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" 
                      : currentStep > index 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-700 text-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {currentStep > index ? (
                    <motion.svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </motion.svg>
                  ) : (
                    index + 1
                  )}
                  
                  {/* Pulse effect for current step */}
                  {currentStep === index && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-purple-500"
                      initial={{ opacity: 0.8, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.4 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    ></motion.div>
                  )}
                </motion.div>
                
                <span className={`mt-2 text-xs font-medium transition-colors ${
                  currentStep === index 
                    ? "text-purple-400" 
                    : currentStep > index 
                      ? "text-green-400" 
                      : "text-gray-400"
                }`}>
                  {step}
                </span>
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-1">
                  <div className="relative h-1">
                    <div className="absolute inset-0 bg-gray-700"></div>
                    {currentStep > index && (
                      <motion.div 
                        className="absolute inset-0 bg-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator; 