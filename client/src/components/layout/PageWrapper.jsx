import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98 },
};

export default function PageWrapper({ children, className = '', noY = false }) {
  const customVariants = {
    ...pageVariants,
    initial: { ...pageVariants.initial, y: noY ? 0 : 15 },
    animate: { ...pageVariants.animate, y: 0 },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-screen flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
