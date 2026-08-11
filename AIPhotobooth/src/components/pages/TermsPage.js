import React from 'react';
import { motion } from 'framer-motion';

const TermsPage = () => {
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

  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center p-6 pt-24">
      <motion.div 
        className="w-full max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-gradient-to-br from-black/70 to-purple-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 mb-8 border border-purple-500/20 shadow-xl"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Terms of <span className="text-purple-400">Service</span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-10 rounded-full"></div>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            By accessing or using AI Photobooth ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">2. Description of Service</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            AI Photobooth provides an AI-powered photo transformation service that allows users to apply various styles and effects to their images. The Service may be modified or updated from time to time without prior notice.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">3. User Content</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            By uploading images to AI Photobooth, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your content for the purpose of providing and improving the Service.
          </p>
          <p className="text-gray-300 mb-6 leading-relaxed">
            You maintain ownership of all images you upload. However, you agree not to upload content that violates third-party rights or contains inappropriate or illegal material.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">4. Limitation of Liability</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service or any inability to use the Service.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">5. Privacy</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Your use of the Service is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">6. Changes to Terms</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Continued use of the Service after any such changes constitutes your acceptance of the new terms.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">7. Termination</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may terminate or suspend your access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">8. Contact</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about these Terms, please contact us through the Contact page.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-black/70 to-purple-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-purple-500/20 shadow-xl text-center"
          variants={itemVariants}
        >
          <p className="text-gray-300">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsPage; 