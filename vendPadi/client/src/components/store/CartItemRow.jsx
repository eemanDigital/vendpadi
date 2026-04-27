import { useState } from "react";
import { useDispatch } from "react-redux";
import { decrementQty, incrementQty, removeItem } from "../../store/cartSlice";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2, FiGift, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import OptimizedImage from "../OptimizedImage";
import { CATEGORY_META } from "../ProductCard";

const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();
  const meta = CATEGORY_META[item.category] || CATEGORY_META.other || { icon: "🏪", text: "text-gray-500" };
  const isBundle = item.isBundle || item._id?.startsWith('bundle-');
  const isFlashSale = item.isFlashSale || (item.flashSale?.isActive && item.flashSale?.discountPrice);
  const showDecrement = !isBundle && !isFlashSale;

  const handleRemove = () => {
    dispatch(removeItem(item._id));
    toast.success(`Removed ${item.name}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group bg-white rounded-xl border border-gray-100 p-3 hover:border-gray-200 hover:shadow-md transition-all"
    >
      <div className="flex gap-3">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
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
                <p className="font-semibold text-navy text-sm truncate">{item.name}</p>
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
              <FiTrash2 size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {showDecrement && (
                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => dispatch(decrementQty(item._id))}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="w-6 sm:w-8 text-center font-bold text-navy text-xs sm:text-sm">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => dispatch(incrementQty(item._id))}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-padi-green/20 hover:text-padi-green transition-colors"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
              )}
              {!showDecrement && (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {item.bundleProducts?.length || 0} items
                </span>
              )}
            </div>

            <div className="text-right">
              {(isBundle || isFlashSale) && item.originalPrice ? (
                <div className="flex flex-col items-end">
                  <p className="font-bold text-padi-green text-sm">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-gray-400 text-xs line-through">
                      ₦{item.originalPrice.toLocaleString()}
                    </p>
                    <span className="text-green-600 text-xs font-bold">
                      -{item.discountPercentage}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-bold text-padi-green text-sm">
                  ₦{item.price.toLocaleString()}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">
                Total: ₦{(item.price * item.qty).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemRow;