import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };
  
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
            Contact <span className="text-purple-400">Us</span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mb-10 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-purple-400 mb-6">Send Us a Message</h2>
              
              {formStatus.submitted && (
                <motion.div 
                  className={`p-4 rounded-lg mb-6 ${formStatus.success ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className={`${formStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {formStatus.message}
                  </p>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-purple-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-purple-300 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-purple-300 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-purple-300 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-purple-400 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-600/80 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-300">Manipal Academy of Higher Education – Dubai Campus</p>
                    <p className="text-gray-300">Dubai International Academic City</p>
                    <p className="text-gray-300">Dubai, UAE</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-600/80 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">orion2024@gmail.com</p>
                    <p className="text-gray-300">support@aiphotobooth.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600/80 rounded-md flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-300">+971 4 429 XXXX</p>
                  </div>
                </div>
                
                <div className="p-6 bg-black/30 rounded-xl mt-8 border border-purple-500/10">
                  <h3 className="text-white font-semibold mb-3">Office Hours</h3>
                  <p className="text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-300">Saturday: 10:00 AM - 2:00 PM</p>
                  <p className="text-gray-300">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactPage; 