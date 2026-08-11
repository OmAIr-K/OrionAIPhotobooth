import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import StyleCard from '../ui/StyleCard';
import { styleOptions } from '../../data/stylesData';
import { Heart, Search, MessageSquare, Sparkles } from 'lucide-react';

const StyleSelection = ({ 
  selectedGender, 
  onSelectStyle, 
  onBack, 
  selectedStyle,
  likedStyles,
  onToggleLikeStyle 
}) => {
  const [styles, setStyles] = useState([]);
  const [trendingStyles, setTrendingStyles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, trending, liked
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  
  useEffect(() => {
    if (selectedGender) {
      // Get styles based on selected gender
      const genderStyles = styleOptions[selectedGender] || [];
      setStyles(genderStyles);
      
      // Sort by popularity to get trending styles
      const trending = [...genderStyles].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
      setTrendingStyles(trending);
      
      // Initialize filtered styles
      setFilteredStyles(genderStyles);
    }
  }, [selectedGender]);
  
  // Handle search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStyles(styles);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = styles.filter(style => 
        style.name.toLowerCase().includes(term) || 
        style.description.toLowerCase().includes(term) ||
        (style.features && style.features.some(feature => feature.toLowerCase().includes(term)))
      );
      setFilteredStyles(filtered);
    }
  }, [searchTerm, styles]);
  
  // Handle tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredStyles(styles);
    } else if (activeTab === 'trending') {
      setFilteredStyles(trendingStyles);
    } else if (activeTab === 'liked') {
      const liked = styles.filter(style => likedStyles.includes(style.id));
      setFilteredStyles(liked);
    }
  }, [activeTab, styles, trendingStyles, likedStyles]);
  
  const handleStyleSelect = (styleId) => {
    // Check if this is a custom style selection
    const isCustomStyle = styles.find(s => s.id === styleId)?.isCustom;
    
    if (isCustomStyle) {
      setShowCustomPrompt(true);
    } else {
      onSelectStyle(styleId);
    }
  };
  
  const handleCustomStyleSubmit = () => {
    if (customPrompt.trim()) {
      // Pass both the custom style ID and the prompt
      onSelectStyle(selectedGender === 'male' ? 'custom' : 'custom', customPrompt);
      setShowCustomPrompt(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { ease: 'easeInOut' }
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
      className="min-h-[calc(100vh-180px)] flex flex-col items-center p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <h2 className="text-4xl font-bold text-white mb-3">Choose Your Style</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Select a visual style for your AI transformation
        </p>
      </motion.div>
      
      {/* Search and filter */}
      <motion.div className="w-full max-w-6xl mb-6 flex flex-col md:flex-row gap-4" variants={itemVariants}>
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-gray-800 bg-opacity-50 backdrop-blur-sm text-white rounded-lg 
                    border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 
                    focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
            placeholder="Search styles by name or feature..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Styles
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              activeTab === 'trending' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <span className="text-yellow-400 mr-1">★</span> Trending
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              activeTab === 'liked' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('liked')}
          >
            <Heart size={16} className={`mr-1 ${activeTab === 'liked' ? 'fill-white text-white' : 'text-red-500 fill-red-500'}`} /> 
            Favorites
          </button>
        </div>
      </motion.div>
      
      {/* Empty state for liked styles */}
      {activeTab === 'liked' && likedStyles.length === 0 && (
        <motion.div 
          className="w-full max-w-6xl py-12 text-center bg-gray-900 bg-opacity-30 backdrop-blur-sm rounded-xl"
          variants={itemVariants}
        >
          <Heart size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Click the heart icon on any style to add it to your favorites for quick access
          </p>
        </motion.div>
      )}
      
      {/* Custom Style Prompt Modal */}
      {showCustomPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-lg w-full border border-purple-500 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Sparkles size={20} className="mr-2 text-purple-400" />
                Custom Style Prompt
              </h3>
              <button 
                onClick={() => setShowCustomPrompt(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <p className="text-gray-300 mb-4">
              Describe your dream style in detail. Be specific about the look, theme, environment, and any special effects you want.
            </p>
            
            <div className="mb-4">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Example: A sci-fi bounty hunter with glowing armor, holographic displays, in a futuristic spaceport with neon lights and alien species in the background."
                className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomPrompt(false)}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomStyleSubmit}
                disabled={!customPrompt.trim()}
                className={`flex-1 py-2 bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center ${
                  !customPrompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                }`}
              >
                <MessageSquare size={18} className="mr-2" />
                Create Custom Style
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Styles grid */}
      {filteredStyles.length > 0 && (
        <motion.div 
          className="w-full max-w-6xl mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {filteredStyles.map((style, index) => (
            <motion.div 
              key={style.id}
              variants={itemVariants}
              custom={index}
              layout
            >
              <StyleCard 
                style={style}
                onClick={handleStyleSelect}
                onLikeClick={onToggleLikeStyle}
                isSelected={selectedStyle === style.id}
                isLiked={likedStyles.includes(style.id)}
                variant={style.isCustom ? 'custom' : (trendingStyles.some(s => s.id === style.id) ? 'trending' : 'default')}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Empty search results */}
      {filteredStyles.length === 0 && activeTab !== 'liked' && (
        <motion.div 
          className="w-full max-w-6xl py-12 text-center bg-gray-900 bg-opacity-30 backdrop-blur-sm rounded-xl"
          variants={itemVariants}
        >
          <Search size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-2xl font-bold text-white mb-2">No Styles Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            No styles match your search criteria. Try different keywords or clear the search.
          </p>
          {searchTerm && (
            <button 
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </motion.div>
      )}
      
      <motion.div 
        className="flex justify-between w-full max-w-6xl mt-4"
        variants={itemVariants}
      >
        <Button
          onClick={onBack}
          variant="secondary"
        >
          Back
        </Button>
        
        {selectedStyle && !showCustomPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button onClick={() => handleStyleSelect(selectedStyle)}>
              Continue
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StyleSelection; 