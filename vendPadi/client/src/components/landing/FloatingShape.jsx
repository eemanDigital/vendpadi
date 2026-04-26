import { motion } from "framer-motion";

const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl ${className}`}
    style={{ animationDelay: `${delay}s` }}
    animate={{
      scale: [1, 1.1, 1],
      opacity: [0.15, 0.25, 0.15],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default FloatingShape;