import { useEffect, useRef } from "react";
import { FiClock, FiMapPin, FiStar, FiShield, FiChevronDown, FiExternalLink } from "react-icons/fi";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import OptimizedImage from "../OptimizedImage";
import CategoryBadge, { CATEGORY_META } from "../ProductCard";

const storeVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const imageVariants = {
  initial: { scale: 1.2, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
};

const badgeVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

const StoreHero = ({ vendor }) => {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  
  const meta = CATEGORY_META[vendor.category] || null;
  const isVerified = vendor?.verification?.isVerified === true;
  
  const coverY = useTransform(scrollY, [0, 400], [0, 50]);
  const coverOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const coverScale = useTransform(scrollY, [0, 400], [1, 1.2]);

  return (
    <motion.div 
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-gray-50/50"
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      variants={storeVariants}
    >
      <motion.div 
        style={{ y: coverY, opacity: coverOpacity, scale: coverScale }}
        className="absolute inset-0 z-0"
      >
        {vendor.coverImage ? (
          <div className="w-full h-full relative">
            <OptimizedImage
              src={vendor.coverImage}
              alt="Store cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50" />
        )}
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div 
          className="flex items-start gap-3 sm:gap-5"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.div
            variants={imageVariants}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-xl flex-shrink-0 bg-white ${vendor.coverImage ? '-mt-8 sm:-mt-12' : ''} group-logo`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <OptimizedImage
                src={vendor.logo}
                alt={vendor.businessName}
                className="w-full h-full"
                fallback={
                  <div
                    className={`w-full h-full flex items-center justify-center text-2xl sm:text-4xl ${meta.bg}`}>
                    {meta.icon}
                  </div>
                }
              />
            </motion.div>
            {isVerified && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
                className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              >
                <FiShield className="text-white" size={12} />
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="flex-1 min-w-0"
            variants={storeVariants}
          >
            <motion.div 
              className="flex items-center gap-2 flex-wrap"
              variants={badgeVariants}
            >
              <h1 className="font-sora font-bold text-lg sm:text-2xl sm:text-3xl text-navy leading-tight truncate sm:truncate-none">
                {vendor.businessName}
              </h1>
              {isVerified && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm"
                >
                  <FiShield size={12} /> Verified
                </motion.span>
              )}
            </motion.div>

            <motion.div 
              className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2"
              variants={badgeVariants}
            >
              <CategoryBadge category={vendor.category} />
              <span className="text-gray-300 hidden xs:inline">•</span>
              <motion.div 
                className="flex items-center gap-1 text-amber-500"
                whileHover={{ scale: 1.1 }}
              >
                <FiStar size={12} className="fill-current" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600">4.8</span>
              </motion.div>
            </motion.div>

            {vendor.description && (
              <motion.p 
                className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 leading-relaxed line-clamp-1 sm:line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {vendor.description}
              </motion.p>
            )}

            <motion.div 
              className="flex flex-wrap items-center gap-x-2 sm:gap-3 gap-y-1 mt-2 sm:mt-4"
              variants={badgeVariants}
            >
              <motion.div 
                className="flex items-center gap-1.5"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-padi-green"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                  Open Now
                </span>
              </motion.div>
              <motion.div 
                className="hidden xs:flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500"
                whileHover={{ scale: 1.02 }}
              >
                <FiClock size={10} />
                <span>15-30 min</span>
              </motion.div>
              <motion.div 
                className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500"
                whileHover={{ scale: 1.02 }}
              >
                <FiMapPin size={12} />
                <span>Delivery</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none"
      />
    </motion.div>
  );
};

export default StoreHero;