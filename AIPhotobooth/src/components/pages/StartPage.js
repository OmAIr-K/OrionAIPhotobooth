import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { sampleStyles } from '../../data/stylesData';
import { ArrowRight, Sparkles, Camera, Download, Layers, PersonStanding } from 'lucide-react';

const StartPage = ({ onStart, onGallery }) => {
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animateBackground, setAnimateBackground] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStyleIndex(prev => (prev + 1) % sampleStyles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const featureIcons = [
    { icon: <Camera className="text-purple-400" />, text: "Take or upload your photo" },
    { icon: <PersonStanding className="text-purple-400" />, text: "Choose your gender & style" },
    { icon: <Layers className="text-purple-400" />, text: "Transform with AI magic" },
    { icon: <Download className="text-purple-400" />, text: "Download & share your creations" }
  ];
  
  return (
    <div className="relative min-h-[calc(100vh-180px)] flex flex-col md:flex-row items-center justify-between p-6 max-w-7xl mx-auto overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-700 opacity-10 blur-[120px]"
          animate={animateBackground ? {
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-blue-500 opacity-10 blur-[100px]"
          animate={animateBackground ? {
            x: [0, -40, 30, 0],
            y: [0, 40, -40, 0],
          } : {}}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0, Math.random() * 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Left Content - Text and CTA */}
      <motion.div 
        className="w-full md:w-1/2 md:pr-8 mb-10 md:mb-0 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="relative mb-4" variants={titleVariants}>
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white leading-tight"
          >
            <span className="inline-block text-white mb-1">Transform Your</span>
            <div className="block">
              <span className="text-purple-400">Reality</span>
            </div>
          </motion.h1>
        </motion.div>
        
        <motion.div className="h-1 w-20 bg-purple-500 mb-6" variants={itemVariants} />
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed font-light"
          variants={itemVariants}
        >
          Step into our AI-powered photobooth and see yourself reimagined in stunning visual styles
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="mb-10"
        >
          <p className="text-gray-400 mb-8 leading-relaxed">
            Our state-of-the-art AI transforms your ordinary photos into extraordinary artistic masterpieces, giving you a glimpse of yourself in different universes and personas.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {featureIcons.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-start bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm border border-gray-700"
                whileHover={{ 
                  y: -5, 
                  backgroundColor: "rgba(109, 40, 217, 0.2)",
                  borderColor: "#8b5cf6",
                  boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.15)" 
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2 bg-gray-700/70 rounded-lg mr-3">
                  {feature.icon}
                </div>
                <span className="text-gray-300">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            onClick={onStart}
            size="xl"
            className="w-full sm:w-auto shadow-lg hover:shadow-purple-500/30 text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Transformation 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </Button>
          
          <motion.button 
            onClick={onGallery}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-800/50 border border-transparent hover:border-purple-500/30"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} className="text-purple-400" />
            <span>View Gallery</span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Right Content - 3D Staggered Card Carousel */}
      <motion.div 
        className="w-full md:w-1/2 relative h-[600px] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          {/* 3D Style Cards */}
          <div className="relative w-full h-full perspective-1000">
            <AnimatePresence>
              {sampleStyles.map((style, index) => {
                const isActive = index === currentStyleIndex;
                const offset = ((index - currentStyleIndex + sampleStyles.length) % sampleStyles.length);
                const zIndex = sampleStyles.length - offset;
                
                // Calculate card positions
                let position = {};
                if (offset === 0) {
                  position = { right: '0%', top: '50%', transform: 'translateY(-50%) scale(1) rotateY(0deg)', zIndex };
                } else if (offset === 1) {
                  position = { right: '5%', top: '42%', transform: 'translateY(-50%) scale(0.92) translateX(-20px) rotateY(5deg)', zIndex };
                } else if (offset === 2) {
                  position = { right: '10%', top: '32%', transform: 'translateY(-50%) scale(0.84) translateX(-40px) rotateY(10deg)', zIndex };
                } else {
                  position = { right: '15%', top: '22%', transform: 'translateY(-50%) scale(0.76) translateX(-60px) rotateY(15deg)', opacity: 0.7, zIndex };
                }
                
                return (
                  <motion.div 
                    key={style.id}
                    className="absolute rounded-xl overflow-hidden shadow-2xl select-none cursor-pointer"
                    style={{ width: '340px', transformStyle: 'preserve-3d' }}
                    initial={false}
                    animate={{
                      right: position.right,
                      top: position.top,
                      transform: position.transform,
                      opacity: position.opacity ?? 1,
                      zIndex,
                      boxShadow: isActive 
                        ? '0 25px 50px -12px rgba(124, 58, 237, 0.35), 0 0 20px rgba(139, 92, 246, 0.2)' 
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                    }}
                    transition={{
                      type: "spring",
                      damping: 20,
                      stiffness: 100
                    }}
                    onHoverStart={() => setHoveredCard(style.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={() => isActive && onStart()}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.45)'
                    }}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <motion.img 
                        src={style.image} 
                        alt={style.name} 
                        className="w-full h-full object-cover"
                        animate={{
                          scale: hoveredCard === style.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-60"></div>
                      
                      {/* Active card indicator */}
                      {isActive && (
                        <motion.div 
                          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {(isActive || hoveredCard === style.id) && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0.1 }}
                        >
                          <motion.div
                            initial={{ x: -5, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h3 className="text-2xl font-bold text-white mb-1">{style.name}</h3>
                            <p className="text-gray-200 text-sm">{style.description}</p>
                            
                            {hoveredCard === style.id && isActive && (
                              <motion.div 
                                className="mt-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm py-1.5 px-3 rounded-md inline-flex items-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <Sparkles size={12} className="mr-1" /> Try this style
                              </motion.div>
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Style indicator tag */}
                    <motion.div 
                      className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-xs py-1 px-2 rounded text-white border border-purple-500/30 flex items-center"
                      animate={{ 
                        backgroundColor: isActive ? "rgba(109, 40, 217, 0.4)" : "rgba(0, 0, 0, 0.6)"
                      }}
                    >
                      {isActive && (
                        <motion.div 
                          className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}
                      {style.features?.[0] || "Style"}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Enhanced decorative elements */}
            <motion.div 
              className="absolute right-[40%] top-[20%] w-6 h-6 rounded-full bg-purple-500 opacity-40 blur-[1px]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute right-[10%] top-[70%] w-8 h-8 rounded-full bg-purple-400 opacity-30 blur-[2px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute right-[70%] top-[80%] w-5 h-5 rounded-full bg-pink-400 opacity-30 blur-[1px]"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StartPage; 