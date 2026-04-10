import { FiArrowLeft, FiShare2, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import OptimizedImage from "../OptimizedImage";
import CategoryBadge, { CATEGORY_META } from "../ProductCard";

const StoreHeader = ({ vendor, onBack, onShare, copied }) => {
  const meta = CATEGORY_META[vendor.category] || CATEGORY_META.other || { icon: "🏪" };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex-shrink-0">
          <FiArrowLeft size={20} className="text-gray-600" />
        </button>

        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex-shrink-0">
          <OptimizedImage
            src={vendor.logo}
            alt={vendor.businessName}
            className="w-full h-full"
            fallback={<span className="text-xl">{meta.icon}</span>}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sora font-bold text-navy text-sm truncate">
            {vendor.businessName}
          </p>
          <CategoryBadge category={vendor.category} />
        </div>

        <button
          onClick={onShare}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex-shrink-0">
          {copied ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-padi-green">
              <FiCheck size={18} />
            </motion.span>
          ) : (
            <FiShare2 size={18} className="text-gray-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default StoreHeader;
