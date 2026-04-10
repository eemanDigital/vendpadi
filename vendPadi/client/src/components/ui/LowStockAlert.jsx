import { FiAlertTriangle } from 'react-icons/fi';

const LowStockAlert = ({ products, onManageInventory, className = '' }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FiAlertTriangle className="text-amber-600" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-amber-800 mb-1">
            Low Stock Alert
          </h4>
          <p className="text-sm text-amber-700 mb-3">
            {products.length} product{products.length > 1 ? 's' : ''} running low on stock
          </p>
          <div className="space-y-2">
            {products.slice(0, 3).map((product) => (
              <div key={product._id} className="flex items-center justify-between text-sm">
                <span className="text-amber-800 truncate">{product.name}</span>
                <span className="text-amber-600 font-medium ml-2 flex-shrink-0">
                  {product.stock} left
                </span>
              </div>
            ))}
            {products.length > 3 && (
              <p className="text-xs text-amber-600">
                +{products.length - 3} more products
              </p>
            )}
          </div>
          {onManageInventory && (
            <button
              onClick={onManageInventory}
              className="mt-3 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
            >
              Manage Inventory
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
