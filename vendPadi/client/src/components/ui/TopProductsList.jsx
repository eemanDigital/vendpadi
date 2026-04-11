import { FiEye, FiTrendingUp } from 'react-icons/fi';
import OptimizedImage from '../OptimizedImage';

const TopProductsList = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h3 className="font-sora font-semibold text-navy">Top Products</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        {products.slice(0, 3).map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold">
              {index + 1}
            </div>
            
            {product.image ? (
              <OptimizedImage
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">📦</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy truncate">{product.name}</p>
              <p className="text-xs text-gray-500">₦{product.price?.toLocaleString()}</p>
            </div>
            
            <div className="flex items-center gap-1 text-orange-500">
              <FiEye size={14} />
              <span className="text-xs font-medium">{product.clickCount || 0}</span>
            </div>
          </div>
        ))}
      </div>
      
      {products.length > 0 && products[0]?.clickCount > 0 && (
        <div className="mt-4 p-3 bg-gold/10 rounded-lg">
          <p className="text-xs text-gold font-medium flex items-center gap-1">
            <FiTrendingUp size={12} />
            {products[0].name} is your best seller!
          </p>
        </div>
      )}
    </div>
  );
};

export default TopProductsList;
