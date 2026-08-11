import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, color = '#8B5CF6' }) => {
    return (
        <motion.div
            style={{
                width: size,
                height: size,
                position: 'relative'
            }}
        >
            {/* Outer spinning ring */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: `4px solid ${color}`,
                    borderRadius: '50%',
                    borderTopColor: 'transparent',
                    borderLeftColor: 'transparent'
                }}
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />
            
            {/* Inner spinning ring */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '60%',
                    height: '60%',
                    top: '20%',
                    left: '20%',
                    border: `4px solid ${color}`,
                    borderRadius: '50%',
                    borderBottomColor: 'transparent',
                    borderRightColor: 'transparent'
                }}
                animate={{
                    rotate: -360
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />

            {/* Center dot */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '20%',
                    height: '20%',
                    top: '40%',
                    left: '40%',
                    backgroundColor: color,
                    borderRadius: '50%'
                }}
                animate={{
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </motion.div>
    );
};

export default LoadingSpinner; 