import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { selectWishlistItems, removeFromWishlist, setWishlistOpen } from '../../store/wishlistSlice';
import { addItem } from '../../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
    dispatch(removeFromWishlist(product._id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-sora font-bold text-lg">Wishlist ({wishlistItems.length})</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-700 mb-2">Your wishlist is empty</h3>
                  <p className="text-sm text-gray-500 mb-4">Save items you love for later</p>
                  <button
                    onClick={onClose}
                    className="text-padi-green font-medium hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y">
                  {wishlistItems.map((item) => (
                    <li key={item._id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.images && item.images[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-navy truncate">{item.name}</h4>
                          <p className="text-padi-green font-bold mt-1">
                            ₦{item.price.toLocaleString()}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="text-xs bg-padi-green text-white px-3 py-1.5 rounded-lg hover:bg-padi-green-dark transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleRemove(item._id)}
                              className="text-xs text-red-500 hover:text-red-600 px-2 py-1.5"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {wishlistItems.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="w-full btn-primary"
                >
                  View All in Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
