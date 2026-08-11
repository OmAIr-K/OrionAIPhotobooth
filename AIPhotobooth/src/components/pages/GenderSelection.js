import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { CheckCircle2 } from 'lucide-react';
import maleImage from '../../assets/images/Gender_Male.png';
import femaleImage from '../../assets/images/Gender_Female.png';

const GenderSelectionCard = ({ gender, image, title, description, isSelected, onClick }) => {
  return (
    <motion.div 
      className={`
        relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300
        ${isSelected ? 'ring-4 ring-purple-500 scale-[1.02]' : 'hover:scale-[1.02]'}
        bg-gray-800
      `}
      whileHover={{ 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
      onClick={() => onClick(gender)}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <CheckCircle2 size={28} className="text-purple-500 fill-purple-500" />
        </div>
      )}
      
      <div className="aspect-[3/4] relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-20 pb-6 px-5">
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const GenderSelection = ({ onSelectGender, onBack, selectedGender }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
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
  
  const genderOptions = [
    {
      gender: 'male',
      title: 'Male',
      image: maleImage,
      description: 'Choose male-oriented styles and transformations with masculine features and themes.'
    },
    {
      gender: 'female',
      title: 'Female',
      image: femaleImage,
      description: 'Choose female-oriented styles and transformations with feminine features and themes.'
    }
  ];
  
  return (
    <motion.div 
      className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="text-center mb-10" variants={itemVariants}>
        <h2 className="text-4xl font-bold text-white mb-3">Choose Your Base</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Select a starting point for your AI transformation
        </p>
      </motion.div>
      
      <motion.div 
        className="w-full max-w-4xl mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6 px-4"
        variants={containerVariants}
      >
        {genderOptions.map((option) => (
          <motion.div
            key={option.gender}
            variants={itemVariants}
          >
            <GenderSelectionCard
              gender={option.gender}
              image={option.image}
              title={option.title}
              description={option.description}
              isSelected={selectedGender === option.gender}
              onClick={onSelectGender}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="flex justify-between w-full max-w-4xl mt-4 px-4"
        variants={itemVariants}
      >
        <Button
          onClick={onBack}
          variant="secondary"
        >
          Back
        </Button>
        
        {selectedGender && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button onClick={() => onSelectGender(selectedGender)}>
              Continue
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GenderSelection; 