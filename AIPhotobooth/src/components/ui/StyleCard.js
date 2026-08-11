import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Crown, Star, Sparkles, Wand2, PlusCircle, Palette, Brush } from 'lucide-react';

const StyleCard = ({ 
  style, 
  onClick, 
  onLikeClick, 
  isSelected = false, 
  isLiked = false,
  showPopularity = true,
  showDescription = true,
  variant = 'default',
  className = ''
}) => {
  const handleClick = () => {
    onClick(style.id);
  };
  
  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLikeClick(style.id);
  };
  
  // Determine card styling based on variant
  let badgeText = '';
  let badgeIcon = null;
  let badgeClass = '';
  
  if (variant === 'trending') {
    badgeText = 'Trending';
    badgeIcon = <Crown size={14} />;
    badgeClass = 'bg-amber-500 text-amber-950';
  } else if (variant === 'popular') {
    badgeText = 'Popular';
    badgeIcon = <Star size={14} />;
    badgeClass = 'bg-green-500 text-green-950';
  } else if (variant === 'custom') {
    badgeText = 'Custom';
    badgeIcon = <Sparkles size={14} />;
    badgeClass = 'bg-purple-500 text-purple-950';
  }
  
  const renderCardContent = () => {
    if (style.isCustom) {
  return (
        <div className="aspect-[3/4] relative custom-gradient-bg">
          <div className="absolute inset-0 custom-sparkle-animation opacity-30"></div>
          <div className="absolute inset-0 pattern-overlay"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
            <div className="rounded-full bg-purple-600 bg-opacity-70 p-5 mb-4 backdrop-blur-sm floating-circle">
              <Wand2 size={42} className="text-white custom-style-icon" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Create Your Own</h3>
            <div className="flex items-center justify-center mb-2">
              <PlusCircle size={18} className="mr-2 text-purple-300" />
              <p className="text-white font-medium">Custom Style</p>
            </div>
            <p className="text-gray-200 text-sm mt-2 max-w-[80%]">
              Design your perfect transformation using AI prompts
            </p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {style.features && style.features.map((feature, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-700 bg-opacity-50 rounded-full text-xs text-white">
                          {feature}
                        </span>
                      ))}
                    </div>
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button className="custom-button bg-purple-500 text-white px-4 py-1.5 rounded-full text-sm flex items-center">
                <Brush size={14} className="mr-1" /> Create Custom
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Default image-based card for non-custom styles
    return (
      <div className="aspect-[3/4] relative">
        <img 
          src={style.image} 
          alt={style.name} 
          className="w-full h-full object-cover transition-transform duration-700"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-4 px-4">
          <h3 className="text-xl font-bold text-white mb-1">{style.name}</h3>
          
          {/* Features Pills */}
          {style.features && style.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {style.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-black bg-opacity-50 text-gray-300 rounded-full">
                  {feature}
                </span>
              ))}
              {style.features.length > 2 && (
                <span className="text-xs px-2 py-0.5 bg-black bg-opacity-50 text-gray-300 rounded-full">
                  +{style.features.length - 2} more
                </span>
            )}
          </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <motion.div 
      className={`
        relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300
        ${isSelected ? 'ring-4 ring-purple-500 scale-[1.02]' : 'hover:scale-[1.02]'}
        ${style.isCustom ? 'border-2 border-purple-500' : 'bg-gray-800'}
      `}
      whileHover={{ 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
      onClick={handleClick}
    >
      {/* Like button */}
        <button 
        className={`
          absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10
          ${isLiked ? 'bg-white bg-opacity-90' : 'bg-black bg-opacity-50 backdrop-blur-sm'}
          transition-colors
        `}
          onClick={handleLikeClick}
        >
          <Heart 
            size={20} 
          className={isLiked ? 'text-red-500 fill-red-500' : 'text-white'} 
          />
        </button>
      
      {/* Badge for special styles */}
      {badgeText && (
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badgeClass}`}>
          {badgeIcon}
          {badgeText}
        </div>
      )}
      
      {renderCardContent()}
    </motion.div>
  );
};

export default StyleCard; 