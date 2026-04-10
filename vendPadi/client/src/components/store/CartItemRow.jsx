import { useDispatch } from "react-redux";
import { decrementQty, incrementQty, removeItem } from "../../store/cartSlice";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import OptimizedImage from "../OptimizedImage";
import { CATEGORY_META } from "../ProductCard";

const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();
  const meta = CATEGORY_META[item.category] || CATEGORY_META.other || { icon: "🏪", text: "text-gray-500" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 py-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
        <OptimizedImage
          src={item.images?.[0]}
          alt={item.name}
          className="w-full h-full"
          fallback={
            <span className={`text-2xl ${meta.text}`}>{meta.icon}</span>
          }
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-navy text-sm truncate">{item.name}</p>
        <p className="text-padi-green font-bold text-sm mt-0.5">
          NGN{item.price.toLocaleString()}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => dispatch(decrementQty(item._id))}
              className="w-8 h-8 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors">
              <FiMinus size={14} />
            </button>
            <span className="w-8 text-center font-bold text-navy text-sm">
              {item.qty}
            </span>
            <button
              onClick={() => dispatch(incrementQty(item._id))}
              className="w-8 h-8 flex items-center justify-center hover:bg-padi-green/20 hover:text-padi-green transition-colors">
              <FiPlus size={14} />
            </button>
          </div>

          <button
            onClick={() => {
              dispatch(removeItem(item._id));
              toast.success(`Removed ${item.name}`);
            }}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-bold text-navy">
          NGN{(item.price * item.qty).toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">x{item.qty}</p>
      </div>
    </motion.div>
  );
};

export default CartItemRow;
