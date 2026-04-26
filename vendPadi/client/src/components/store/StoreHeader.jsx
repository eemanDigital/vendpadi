import { useState, useEffect } from "react";
import { FiArrowLeft, FiShare2, FiCheck, FiHeart, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import OptimizedImage from "../OptimizedImage";

const headerVariants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const iconVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  tap: { scale: 0.9 },
};

const StoreHeader = ({ vendor, onBack, onShare, onWishlist, wishlistCount = 0, copied }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className="sticky top-0 z-30"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "0 0px 0px rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="border-b border-gray-100/50"
      >
        <div className="max-w-5xl mx-auto px-2 sm:px-4 h-12 sm:h-14 flex items-center gap-2 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all flex-shrink-0 group"
          >
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <FiArrowLeft size={18} className="text-gray-600 group-hover:text-navy transition-colors" />
            </motion.div>
          </motion.button>

          <motion.div
            variants={iconVariants}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 flex-shrink-0 shadow-sm"
          >
            <OptimizedImage
              src={vendor.logo}
              alt={vendor.businessName}
              className="w-full h-full"
              fallback={<span className="text-lg sm:text-xl flex items-center justify-center h-full">{vendor.category === 'food' ? '🍔' : vendor.category === 'fashion' ? '👗' : '🏪'}</span>}
            />
          </motion.div>

          <div className="flex-1 min-w-0 hidden sm:block">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sora font-semibold text-navy text-sm truncate"
            >
              {vendor.businessName}
            </motion.p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onWishlist}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all flex-shrink-0 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <FiHeart size={16} className="text-gray-500 group-hover:text-red-500 transition-colors" />
              </motion.div>
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all flex-shrink-0 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-padi-green"
                  >
                    <FiCheck size={16} />
                  </motion.span>
                ) : (
                  <FiShare2 size={16} className="text-gray-500 group-hover:text-navy transition-colors" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default StoreHeader;