import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import all gallery images from assets/images
import ironManStyle from '../../assets/images/Iron_Man_Style.jpg';
import mafiaStyle from '../../assets/images/Mafia_Style.jpg';
import cyberpunkStyle from '../../assets/images/Cyberpunk_Style.jpg';
import queenStyle from '../../assets/images/Queen_Style.jpg';
import jonSnowStyle from '../../assets/images/Jon_Snow_Style.jpg';
import superManStyle from '../../assets/images/SuperMan_Style.jpg';
import casualStyle from '../../assets/images/Casual_Style_F.jpg';
import fireQueenStyle from '../../assets/images/Fire_Queen_Style.jpg';
import ironWomanStyle from '../../assets/images/Iron_Woman_Style.jpg';
import flashStyle from '../../assets/images/Flash_Style.jpg';
import spiderWomanStyle from '../../assets/images/Spider_Woman_Style.jpg';
import captainMarvelStyle from '../../assets/images/Captain_Marvel_Stylt.png';

// Import gallery images from assets/gallery
import gallery1 from '../../assets/gallery/AIG (1).jpg';
import gallery2 from '../../assets/gallery/AIG (2).jpg';
import gallery3 from '../../assets/gallery/AIG (3).jpg';
import gallery4 from '../../assets/gallery/AIG (4).jpg';
import gallery5 from '../../assets/gallery/AIG (5).jpg';
import gallery6 from '../../assets/gallery/AIG (6).jpg';
import gallery7 from '../../assets/gallery/AIG (7).jpg';
import gallery8 from '../../assets/gallery/AIG (8).jpg';
import gallery9 from '../../assets/gallery/AIG (9).jpg';
import gallery10 from '../../assets/gallery/AIG (10).jpg';
import gallery11 from '../../assets/gallery/AIG (11).jpg';
import gallery12 from '../../assets/gallery/AIG (12).jpg';
import gallery13 from '../../assets/gallery/AIG (13).jpg';
import gallery14 from '../../assets/gallery/AIG (14).jpg';
import gallery15 from '../../assets/gallery/AIG (15).jpg';
import gallery16 from '../../assets/gallery/AIG (16).jpg';
import gallery17 from '../../assets/gallery/AIG (17).jpg';
import gallery18 from '../../assets/gallery/AIG (18).jpg';
import gallery19 from '../../assets/gallery/AIG (19).jpg';
import gallery20 from '../../assets/gallery/AIG (20).jpg';
import gallery21 from '../../assets/gallery/AIG (21).jpg';
import gallery22 from '../../assets/gallery/AIG (22).jpg';
import gallery23 from '../../assets/gallery/AIG (23).jpg';
import gallery24 from '../../assets/gallery/AIG (24).jpg';
import gallery25 from '../../assets/gallery/AIG (25).jpg';
import gallery26 from '../../assets/gallery/AIG (26).jpg';
import gallery27 from '../../assets/gallery/AIG (27).jpg';
import gallery28 from '../../assets/gallery/AIG (28).jpg';
import gallery29 from '../../assets/gallery/AIG (29).jpg';
import gallery30 from '../../assets/gallery/AIG (30).jpg';
import gallery31 from '../../assets/gallery/AIG (31).jpg';
import gallery32 from '../../assets/gallery/AIG (32).jpg';
import gallery33 from '../../assets/gallery/AIG (33).jpg';
import gallery34 from '../../assets/gallery/AIG (34).jpg';
import gallery35 from '../../assets/gallery/AIG (35).jpg';
import gallery36 from '../../assets/gallery/AIG (36).jpg';
import gallery37 from '../../assets/gallery/AIG (37).jpg';
import gallery38 from '../../assets/gallery/AIG (38).jpg';
import gallery39 from '../../assets/gallery/AIG (39).jpg';
import gallery40 from '../../assets/gallery/AIG (40).jpg';
import gallery41 from '../../assets/gallery/AIG (41).jpg';
import gallery42 from '../../assets/gallery/AIG (42).jpg';
import gallery43 from '../../assets/gallery/AIG (43).jpg';
import gallery44 from '../../assets/gallery/AIG (44).jpg';
import gallery45 from '../../assets/gallery/AIG (45).jpg';

const GalleryPage = () => {
  // Gallery items with details - combining images from both folders
  const galleryItems = [
    // Original styles from assets/images
    { id: 1, image: ironManStyle, category: "Superhero" },
    { id: 2, image: mafiaStyle, category: "Character" },
    { id: 3, image: cyberpunkStyle, category: "Futuristic" },
    { id: 4, image: queenStyle, category: "Royal" },
    { id: 5, image: jonSnowStyle, category: "Character" },
    { id: 6, image: superManStyle, category: "Superhero" },
    { id: 7, image: casualStyle, category: "Modern" },
    { id: 8, image: fireQueenStyle, category: "Fantasy" },
    { id: 9, image: ironWomanStyle, category: "Superhero" },
    { id: 10, image: flashStyle, category: "Superhero" },
    { id: 11, image: spiderWomanStyle, category: "Superhero" },
    { id: 12, image: captainMarvelStyle, category: "Superhero" },
    
    // Gallery images from assets/gallery
    { id: 101, image: gallery1, category: "Character" },
    { id: 102, image: gallery2, category: "Character" },
    { id: 103, image: gallery3, category: "Character" },
    { id: 104, image: gallery4, category: "Modern" },
    { id: 105, image: gallery5, category: "Modern" },
    { id: 106, image: gallery6, category: "Superhero" },
    { id: 107, image: gallery7, category: "Fantasy" },
    { id: 108, image: gallery8, category: "Character" },
    { id: 109, image: gallery9, category: "Character" },
    { id: 110, image: gallery10, category: "Royal" },
    { id: 111, image: gallery11, category: "Character" },
    { id: 112, image: gallery12, category: "Superhero" },
    { id: 113, image: gallery13, category: "Character" },
    { id: 114, image: gallery14, category: "Superhero" },
    { id: 115, image: gallery15, category: "Modern" },
    { id: 116, image: gallery16, category: "Futuristic" },
    { id: 117, image: gallery17, category: "Fantasy" },
    { id: 118, image: gallery18, category: "Character" },
    { id: 119, image: gallery19, category: "Superhero" },
    { id: 120, image: gallery20, category: "Fantasy" },
    { id: 121, image: gallery21, category: "Character" },
    { id: 122, image: gallery22, category: "Modern" },
    { id: 123, image: gallery23, category: "Character" },
    { id: 124, image: gallery24, category: "Superhero" },
    { id: 125, image: gallery25, category: "Fantasy" },
    { id: 126, image: gallery26, category: "Royal" },
    { id: 127, image: gallery27, category: "Character" },
    { id: 128, image: gallery28, category: "Superhero" },
    { id: 129, image: gallery29, category: "Fantasy" },
    { id: 130, image: gallery30, category: "Futuristic" },
    { id: 131, image: gallery31, category: "Superhero" },
    { id: 132, image: gallery32, category: "Character" },
    { id: 133, image: gallery33, category: "Modern" },
    { id: 134, image: gallery34, category: "Fantasy" },
    { id: 135, image: gallery35, category: "Superhero" },
    { id: 136, image: gallery36, category: "Character" },
    { id: 137, image: gallery37, category: "Royal" },
    { id: 138, image: gallery38, category: "Superhero" },
    { id: 139, image: gallery39, category: "Character" },
    { id: 140, image: gallery40, category: "Fantasy" },
    { id: 141, image: gallery41, category: "Superhero" },
    { id: 142, image: gallery42, category: "Character" },
    { id: 143, image: gallery43, category: "Modern" },
    { id: 144, image: gallery44, category: "Fantasy" },
    { id: 145, image: gallery45, category: "Superhero" }
  ];
  
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories for filter
  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];
  
  // Filtered gallery items
  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5
      } 
    }
  };
  
  // View larger image
  const [selectedImage, setSelectedImage] = useState(null);
  
  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center p-6 pt-24">
      <motion.div 
        className="w-full max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          Style <span className="text-purple-500">Gallery</span>
        </h1>
        
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-black bg-opacity-30 text-gray-300 hover:bg-opacity-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Gallery grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.map(item => (
            <motion.div 
              key={item.id}
              className="bg-black bg-opacity-30 rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              variants={itemVariants}
              onClick={() => setSelectedImage(item)}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={`Style ${item.id}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-purple-400">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Image modal */}
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative max-w-4xl w-full">
              <button 
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-black bg-opacity-70 rounded-lg overflow-hidden">
                <img 
                  src={selectedImage.image} 
                  alt={`Style ${selectedImage.id}`} 
                  className="w-full max-h-[80vh] object-contain"
                />
                <div className="p-4">
                  <p className="text-purple-400">{selectedImage.category} Style</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default GalleryPage; 