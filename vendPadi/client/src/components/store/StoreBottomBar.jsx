import { FiShoppingCart, FiMessageCircle, FiChevronRight, FiShare2 } from "react-icons/fi";
import { motion } from "framer-motion";

const StoreBottomBar = ({ cartCount, cartTotal, onCartClick, onOrderClick, onQRClick }) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onCartClick}
              className="flex items-center gap-3 flex-1 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-2xl transition-all text-left">
              <div className="relative">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    cartCount > 0
                      ? "bg-gradient-to-br from-navy to-navy/90 shadow-lg shadow-navy/30"
                      : "bg-gray-200"
                  }`}>
                  <FiShoppingCart
                    size={18}
                    className={cartCount > 0 ? "text-white" : "text-gray-400"}
                  />
                </div>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-padi-green text-white text-xs font-bold rounded-full flex items-center justify-center px-1 shadow-lg">
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {cartCount > 0 ? (
                  <>
                    <p className="font-semibold text-navy text-sm">
                      View Order - NGN{cartTotal.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {cartCount} item{cartCount !== 1 ? "s" : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-400 text-sm">
                      Your order is empty
                    </p>
                    <p className="text-xs text-gray-300">
                      Tap to start adding items
                    </p>
                  </>
                )}
              </div>
              <FiChevronRight className="text-gray-400" size={20} />
            </button>

            <motion.button
              whileTap={{ scale: cartCount > 0 ? 0.95 : 1 }}
              onClick={onQRClick}
              className="w-14 h-14 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-all flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M3 11h8a4 4 0 0 1 4 4v8M17 5h4M7 3 3 7l4 4m4 10 4-4-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </motion.button>

            <motion.button
              whileTap={{ scale: cartCount > 0 ? 0.95 : 1 }}
              onClick={cartCount > 0 ? onOrderClick : undefined}
              disabled={cartCount === 0}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm transition-all flex-shrink-0 ${
                cartCount > 0
                  ? "bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-xl shadow-[#25D366]/30"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}>
              <span className="flex items-center gap-2">
                <FiMessageCircle size={18} />
                <span className="hidden sm:inline">Order via</span>
                WhatsApp
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreBottomBar;
