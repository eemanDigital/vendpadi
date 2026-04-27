import { useState } from "react";
import { useDispatch } from "react-redux";
import { decrementQty, incrementQty, removeItem } from "../../store/cartSlice";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2, FiGift, FiZap, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import OptimizedImage from "../OptimizedImage";
import { CATEGORY_META } from "../ProductCard";

const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  
  const meta = CATEGORY_META[item.category] || CATEGORY_META.other || { icon: "🏪", text: "text-gray-500" };
  const isBundle = item.isBundle || item._id?.startsWith('bundle-');
  const isFlashSale = item.isFlashSale || (item.flashSale?.isActive && item.flashSale?.discountPrice);
  
  const handleRemove = () => {
    dispatch(removeItem(item._id));
    toast.success(`Removed ${item.name}`);
  };

  const handleDecrement = () => {
    if (item.qty <= 1) {
      handleRemove();
    } else {
      dispatch(decrementQty(item._id));
    }
  };

  const handleIncrement = () => {
    dispatch(incrementQty(item._id));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex gap-3 p-3">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
          <OptimizedImage
            src={item.images?.[0]}
            alt={item.name}
            className="w-full h-full object-cover"
            fallback={
              isBundle 
                ? <div className="w-full h-full flex items-center justify-center bg-purple-50"><FiGift className="text-purple-400 text-xl" /></div>
                : <div className={`w-full h-full flex items-center justify-center ${meta.bg}`}><span className="text-xl">{meta.icon}</span></div>
            }
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <p className="font-bold text-navy text-sm truncate">{item.name}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {isBundle && (
                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                    BUNDLE
                  </span>
                )}
                {isFlashSale && (
                  <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                    <FiZap size={8} /> SALE
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
            >
              <FiX size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-navy text-sm bg-white border-x border-gray-100">
                  {item.qty}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 flex items-center justify-center hover:bg-padi-green/20 hover:text-padi-green transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>
              
              {isBundle && item.bundleProducts && item.bundleProducts.length > 0 && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-padi-green font-medium hover:underline"
                >
                  {showDetails ? 'Hide' : 'View'} items ({item.bundleProducts.length})
                </button>
              )}
            </div>

            <div className="text-right">
              {(isBundle || isFlashSale) && item.originalPrice ? (
                <div className="flex flex-col items-end">
                  <p className="font-bold text-padi-green text-base">
                    ₦{(item.price * item.qty).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-gray-400 text-xs line-through">
                      ₦{(item.originalPrice * item.qty).toLocaleString()}
                    </p>
                    <span className="text-green-600 text-xs font-bold">
                      -{item.discountPercentage}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-bold text-padi-green text-base">
                  ₦{(item.price * item.qty).toLocaleString()}
                </p>
              )}
              {item.qty > 1 && (
                <p className="text-xs text-gray-400">
                  ₦{item.price.toLocaleString()} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isBundle && showDetails && item.bundleProducts && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-3 pb-3 border-t border-purple-100 mt-0 pt-2 bg-purple-50/50 rounded-b-xl"
        >
          <p className="text-xs font-medium text-purple-700 mb-2">Bundle includes:</p>
          <div className="space-y-1.5">
            {item.bundleProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-gray-600 truncate">{product.name}</span>
                {product.qty && product.qty > 1 && (
                  <span className="text-gray-400">x{product.qty}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartItemRow;