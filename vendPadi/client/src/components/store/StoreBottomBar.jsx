import { FiShoppingCart, FiMessageCircle, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const StoreBottomBar = ({ cartCount, cartTotal, onCartClick, onOrderClick, onQRClick }) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onCartClick}
              className="flex items-center gap-2 sm:gap-3 flex-1 bg-gray-50 hover:bg-gray-100 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all text-left min-w-0">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                    cartCount > 0
                      ? "bg-gradient-to-br from-navy to-navy/90 shadow-lg shadow-navy/30"
                      : "bg-gray-200"
                  }`}>
                  <FiShoppingCart
                    size={16}
                    className={cartCount > 0 ? "text-white" : "text-gray-400"}
                  />
                </div>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 min-w-[18px] h-[18px] sm:min-w-[22px] sm:h-[22px] bg-padi-green text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-0.5 sm:px-1 shadow-lg">
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <div className="flex-1 min-w-0 hidden sm:block">
                {cartCount > 0 ? (
                  <>
                    <p className="font-semibold text-navy text-xs sm:text-sm">
                      View Order - NGN{cartTotal.toLocaleString()}
                    </p>
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
                  <span className="text-xs font-semibold text-navy">NGN{cartTotal.toLocaleString()}</span>
                ) : (
                  <FiChevronRight className="text-gray-400" size={16} />
                )}
              </div>
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onQRClick}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current">
                <path d="M3 11h8a4 4 0 0 1 4 4v8M17 5h4M7 3 3 7l4 4m4 10 4-4-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </motion.button>

            <motion.button
              whileTap={{ scale: cartCount > 0 ? 0.95 : 1 }}
              onClick={cartCount > 0 ? onOrderClick : undefined}
              disabled={cartCount === 0}
              className={`px-3 sm:px-5 py-2 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all flex-shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                cartCount > 0
                  ? "bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-lg sm:shadow-xl shadow-[#25D366]/30"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}>
              <FiMessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Order via</span>
              <span className="font-semibold">WhatsApp</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreBottomBar;
