import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';

const ProductCard = ({ product, showAddToCart = true }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItem(product));
  };

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-sora font-semibold text-navy truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-padi-green text-lg">
            ₦{product.price.toLocaleString()}
          </span>
          {showAddToCart && product.inStock && (
            <button
              onClick={handleAddToCart}
              className="bg-padi-green hover:bg-padi-green-dark text-white p-2 rounded-xl transition-colors"
            >
              <FiShoppingCart className="text-lg" />
            </button>
          )}
          {showAddToCart && !product.inStock && (
            <span className="text-gray-400 text-sm">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
