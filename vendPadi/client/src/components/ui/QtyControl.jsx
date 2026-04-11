import { useDispatch } from "react-redux";
import { incrementQty, decrementQty } from "../../store/cartSlice";
import { FiPlus, FiMinus } from "react-icons/fi";

const QtyControl = ({ qty, productId, compact = false, size = "default" }) => {
  const dispatch = useDispatch();

  const sizeClasses = {
    default: compact ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  const qtyWidth = {
    default: compact ? "w-7" : "w-8",
    lg: "w-12"
  };

  return (
    <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(decrementQty(productId));
        }}
        className={`${sizeClasses[size]} flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors`}>
        <FiMinus size={12} />
      </button>
      <span
        className={`${qtyWidth[size]} text-center font-bold text-navy text-sm`}>
        {qty}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(incrementQty(productId));
        }}
        className={`${sizeClasses[size]} flex items-center justify-center text-gray-500 hover:text-padi-green hover:bg-padi-green/10 transition-colors`}>
        <FiPlus size={12} />
      </button>
    </div>
  );
};

export default QtyControl;
