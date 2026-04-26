import { useRef, useState } from "react";
import { useEffect } from "react";
import { FiClock, FiMapPin, FiStar, FiShield, FiChevronDown, FiChevronUp, FiExternalLink } from "react-icons/fi";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const [expanded, setExpanded] = useState(false);
  
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const coverOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const coverScale = useTransform(scrollY, [0, 400], [1, 1.2]);

  const meta = CATEGORY_META[vendor.category] || null;
  const isVerified = vendor?.verification?.isVerified === true;
  const hasDescription = vendor.description && vendor.description.length > 80;
  const displayDescription = expanded ? vendor.description : vendor.description?.slice(0, 80);

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
        style={{ opacity: coverOpacity, scale: coverScale }}
        className="absolute inset-0 z-0"
      >
        {vendor.coverImage ? (
          <div className="w-full h-full relative">
            <OptimizedImage
              src={vendor.coverImage}
              alt="Store cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50" />
        )}
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div 
          className="flex flex-col gap-4"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <div className="flex items-start gap-3 sm:gap-5">
            <motion.div
              variants={imageVariants}
              className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-xl flex-shrink-0 bg-white ${vendor.coverImage ? '-mt-8 sm:-mt-12' : ''}`}
            >
              <OptimizedImage
                src={vendor.logo}
                alt={vendor.businessName}
                className="w-full h-full"
                fallback={
                  <div className={`w-full h-full flex items-center justify-center text-2xl sm:text-4xl ${meta.bg}`}>
                    {meta.icon}
                  </div>
                }
              />
              {isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                  <FiShield className="text-white" size={12} />
                </motion.div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0 pt-2 sm:pt-4">
              <motion.div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-sora font-bold text-lg sm:text-2xl text-navy leading-tight">
                  {vendor.businessName}
                </h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold rounded-full">
                    <FiShield size={10} /> Verified
                  </span>
                )}
              </motion.div>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                <CategoryBadge category={vendor.category} />
                <div className="flex items-center gap-1 text-amber-500">
                  <FiStar size={12} className="fill-current" />
                  <span className="text-xs font-medium text-gray-600">4.8</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div className="flex flex-wrap items-center gap-x-2 sm:gap-3 gap-y-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-700">Open Now</span>
            </div>
            <div className="hidden xs:flex items-center gap-1.5 text-xs text-gray-500">
              <FiClock size={12} />
              <span>15-30 min</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
              <FiMapPin size={12} />
              <span>Delivery</span>
            </div>
          </motion.div>

          {vendor.description && (
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={`bg-white/90 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm ${expanded ? '' : 'max-h-20 overflow-hidden'}`}>
                <p className={`text-xs sm:text-sm text-gray-600 leading-relaxed ${!expanded && hasDescription ? 'line-clamp-2' : ''}`}>
                  {expanded ? vendor.description : displayDescription}
                  {hasDescription && !expanded && '...'}
                </p>
                
                {hasDescription && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-padi-green hover:text-padi-green-dark transition-colors"
                  >
                    {expanded ? (
                      <>Show less <FiChevronUp size={14} /></>
                    ) : (
                      <>Show more <FiChevronDown size={14} /></>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"
      />
    </motion.div>
  );
};

export default StoreHero;