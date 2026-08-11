import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
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
            About AI <span className="text-purple-400">Photobooth</span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-10 rounded-full"></div>
          
          <h2 className="text-2xl font-semibold text-purple-400 mb-3">Where Smart Tech Meets Student Life</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            AI Photobooth is an intelligent, interactive photography experience designed to elevate campus events at Manipal Academy of Higher Education – Dubai Campus. Powered by AI models Pulid and Flux, this project transforms traditional snapshots into dynamic, stylized, and instantly shareable memories—perfect for students, faculty, and guests alike.
          </p>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Launched as part of Technovanza 2024, AI Photobooth is more than just a fun attraction. It's a glimpse into how emerging technologies like artificial intelligence can be integrated into everyday university experiences—from cultural fests to formal ceremonies.
          </p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-black/70 to-purple-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 mb-8 border border-purple-500/20 shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-purple-400 mb-6">Features at a Glance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 p-5 rounded-xl hover:bg-black/50 transition-all duration-300 border border-purple-500/10">
              <div className="w-8 h-8 bg-purple-600 rounded-md mb-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">AI-Powered Enhancements</h3>
              <p className="text-gray-400">Uses cutting-edge models to apply real-time filters, custom styles, and intelligent adjustments.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-xl hover:bg-black/50 transition-all duration-300 border border-purple-500/10">
              <div className="w-8 h-8 bg-blue-600 rounded-md mb-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Perfect for Every Event</h3>
              <p className="text-gray-400">Designed for fests, seminars, exhibitions, graduations, and campus showcases.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-xl hover:bg-black/50 transition-all duration-300 border border-purple-500/10">
              <div className="w-8 h-8 bg-yellow-500 rounded-md mb-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Instant Output</h3>
              <p className="text-gray-400">Users receive their stylized photo within seconds—via QR code or direct share.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-xl hover:bg-black/50 transition-all duration-300 border border-purple-500/10">
              <div className="w-8 h-8 bg-green-600 rounded-md mb-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Custom-Built Models</h3>
              <p className="text-gray-400">Developed using PuLID and Flux, optimized for creative imaging and speed.</p>
            </div>
            
            <div className="bg-black/40 p-5 rounded-xl hover:bg-black/50 transition-all duration-300 border border-purple-500/10 md:col-span-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-md mb-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.5"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">On-Campus Demo</h3>
              <p className="text-gray-400">Experience it live during Open House 2025 and future university events.</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-black/70 to-purple-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 mb-8 border border-purple-500/20 shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-purple-400 mb-6">Meet the Developers</h2>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="bg-black/40 p-6 rounded-xl border border-purple-500/10 flex-1 hover:transform hover:scale-[1.02] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-xl">Omair Khan</h3>
              <p className="text-gray-400">Data Science student at MAHE – Dubai Campus</p>
            </div>
            
            <div className="bg-black/40 p-6 rounded-xl border border-purple-500/10 flex-1 hover:transform hover:scale-[1.02] transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2 text-xl">Aslam Mohamed</h3>
              <p className="text-gray-400">Data Science student at MAHE – Dubai Campus</p>
            </div>
          </div>
          
          <p className="text-gray-300 leading-relaxed">
            With a shared passion for machine learning, computer vision, and user experience, Omair and Aslam brought this concept to life as part of their commitment to applying academic learning to real-world use.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-black/70 to-purple-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 mb-8 border border-purple-500/20 shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">Our Vision</h2>
          <div className="w-16 h-1 bg-purple-500/50 mb-6 rounded-full"></div>
          <p className="text-gray-300 leading-relaxed">
            We believe AI can do more than automate—it can amplify creativity and connect communities. Our goal with AI Photobooth is to turn ordinary moments into engaging experiences, and show how student innovation can make a meaningful impact on campus life.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-black/70 to-purple-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-purple-500/20 shadow-xl"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-purple-400 mb-6">Get in Touch</h2>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-black/30 rounded-lg border border-purple-500/10">
              <div className="w-10 h-10 bg-purple-600/80 rounded-md flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span className="text-gray-300">orion2024@gmail.com</span>
            </div>
            
            <div className="flex items-center p-4 bg-black/30 rounded-lg border border-purple-500/10">
              <div className="w-10 h-10 bg-blue-600/80 rounded-md flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <span className="text-gray-300">Manipal Academy of Higher Education – Dubai Campus</span>
            </div>
            
            <div className="flex items-center p-4 bg-black/30 rounded-lg border border-purple-500/10">
              <div className="w-10 h-10 bg-green-600/80 rounded-md flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span className="text-gray-300">Catch the live demo during Open House 2025!</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage; 