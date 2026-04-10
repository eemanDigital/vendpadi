import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

const StockBadge = ({ stock, threshold = 5, showCount = true, size = 'md' }) => {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= threshold;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };
  
  if (isOutOfStock) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 font-medium ${sizeClasses[size]}`}>
        <FiX size={12} />
        Out of Stock
      </span>
    );
  }
  
  if (isLowStock) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 font-medium ${sizeClasses[size]}`}>
        <FiAlertTriangle size={12} />
        Low Stock {showCount && `(${stock})`}
      </span>
    );
  }
  
  if (showCount) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 font-medium ${sizeClasses[size]}`}>
        <FiCheck size={12} />
        In Stock ({stock})
      </span>
    );
  }
  
  return null;
};

export default StockBadge;
