import { useState, useEffect } from "react";
import { FiShoppingCart, FiMessageCircle, FiChevronRight, FiPlus, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1];

const StoreBottomBar = ({ cartCount, cartTotal, onCartClick, onOrderClick, onQRClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
          className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
        >
          <motion.div
            className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl"
            whileHover={{ boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <motion.button
                  onClick={onCartClick}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-2 sm:gap-3 flex-1 bg-gray-50 hover:bg-gray-100 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all text-left min-w-0 group"
                >
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                        cartCount > 0
                          ? "bg-gradient-to-br from-navy to-navy/90 shadow-lg shadow-navy/30"
                          : "bg-gray-200"
                      }`}
                      animate={cartCount > 0 ? {
                        boxShadow: ["0 4px 12px rgba(26, 26, 46, 0.2)", "0 4px 20px rgba(26, 26, 46, 0.4)", "0 4px 12px rgba(26, 26, 46, 0.2)"]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiShoppingCart
                        size={16}
                        className={cartCount > 0 ? "text-white" : "text-gray-400"}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px] bg-padi-green text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-0.5 sm:px-1 shadow-lg"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <div className="flex-1 min-w-0 hidden sm:block">
                    {cartCount > 0 ? (
                      <>
                        <motion.p 
                          className="font-semibold text-navy text-xs sm:text-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          View Order - ₦{cartTotal.toLocaleString()}
                        </motion.p>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          {cartCount} item{cartCount !== 1 ? "s" : ""}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-400 text-xs sm:text-sm">
                          Your order is empty
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-300">
                          Tap to start adding items
                        </p>
                      </>
                    )}
                  </div>
                  <div className="sm:hidden flex items-center gap-1">
                    {cartCount > 0 ? (
                      <motion.span
                        className="text-xs font-semibold text-navy"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        ₦{cartTotal.toLocaleString()}
                      </motion.span>
                    ) : (
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                      >
                        <FiChevronRight className="text-gray-400" size={16} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(37, 211, 102, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onQRClick}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all flex items-center justify-center flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current">
                    <path d="M3 11h8a4 4 0 0 1 4 4v8M17 5h4M7 3 3 7l4 4m4 10 4-4-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={cartCount > 0 ? { scale: 1.02, boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)" } : {}}
                  whileTap={cartCount > 0 ? { scale: 0.98 } : {}}
                  onClick={cartCount > 0 ? onOrderClick : undefined}
                  disabled={cartCount === 0}
                  className={`px-3 sm:px-5 py-2 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all flex-shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                    cartCount > 0
                      ? "bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-lg sm:shadow-xl shadow-[#25D366]/30"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {cartCount > 0 ? (
                    <>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                      >
                        <FiMessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </motion.span>
                      <span className="hidden xs:inline">Order via</span>
                      <span className="font-semibold">WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden xs:inline">Add</span>
                      <span className="font-semibold">Items</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreBottomBar;