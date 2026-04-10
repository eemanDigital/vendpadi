import { FiArrowLeft, FiShare2, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import OptimizedImage from "../OptimizedImage";

const StoreHeader = ({ vendor, onBack, onShare, copied }) => {
  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 h-12 sm:h-14 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all active:scale-95 flex-shrink-0">
          <FiArrowLeft size={18} className="text-gray-600" />
        </button>

        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex-shrink-0">
          <OptimizedImage
            src={vendor.logo}
            alt={vendor.businessName}
            className="w-full h-full"
            fallback={<span className="text-lg sm:text-xl">{vendor.category === 'food' ? '🍔' : vendor.category === 'fashion' ? '👗' : '🏪'}</span>}
          />
        </div>

        <div className="flex-1 min-w-0 hidden sm:block">
          <p className="font-sora font-bold text-navy text-sm truncate">
            {vendor.businessName}
          </p>
        </div>

        <button
          onClick={onShare}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all active:scale-95 flex-shrink-0">
          {copied ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-padi-green">
              <FiCheck size={16} />
            </motion.span>
          ) : (
            <FiShare2 size={16} className="text-gray-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default StoreHeader;
