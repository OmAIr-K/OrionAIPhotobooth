import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
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
            Privacy <span className="text-purple-400">Policy</span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-10 rounded-full"></div>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">1. Introduction</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            AI Photobooth ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">2. Information We Collect</h2>
          <p className="text-gray-300 mb-3 leading-relaxed">
            We may collect the following types of information:
          </p>
          <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
            <li>Images and photos that you upload to the Service</li>
            <li>Usage data such as features used and time spent on the Service</li>
            <li>Device information such as IP address, browser type, and operating system</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-300 mb-3 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process and transform your images using AI technology</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Detect and prevent security incidents</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">4. Data Security</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">5. Data Retention</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We retain your images and associated data for as long as necessary to provide you with the Service. You can request deletion of your data at any time through our Contact page.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">6. Your Rights</h2>
          <p className="text-gray-300 mb-3 leading-relaxed">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="text-gray-300 mb-6 list-disc pl-6 space-y-2">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal data</li>
            <li>Restriction or objection to certain processing activities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">7. Changes to This Policy</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">8. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through the Contact page.
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

export default PrivacyPage; 