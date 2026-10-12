import React from 'react';
import { motion } from 'framer-motion';

export const Reveal = ({
  children,
  direction = 'up', // 'left' | 'right' | 'up' | 'down' | 'none'
  delay = 0,
  duration = 0.5,
  className = '',
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: -30 };
      case 'right':
        return { opacity: 0, x: 30 };
      case 'up':
        return { opacity: 0, y: 25 };
      case 'down':
        return { opacity: 0, y: -25 };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};
