import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiShoppingBag, FiRefreshCw, FiSave, FiDownload } from 'react-icons/fi';
import {
  selectWishlistItems,
  removeFromWishlist,
  setWishlistOpen,
  setPhone,
  syncWishlistWithServer,
  fetchWishlistFromServer,
  selectPhone,
  selectSyncLoading,
  selectIsSynced
} from '../../store/wishlistSlice';
import { addItem } from '../../store/cartSlice';
import toast from 'react-hot-toast';

const WishlistDrawer = ({ isOpen, onClose, storeSlug }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const phone = useSelector(selectPhone);
  const syncLoading = useSelector(selectSyncLoading);
  const isSynced = useSelector(selectIsSynced);

  const [phoneInput, setPhoneInput] = useState(phone || '');
  const [showSyncSection, setShowSyncSection] = useState(false);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product) => {
    const isFlashSale = product.flashSale?.isActive && product.flashSale?.discountPrice;

    const itemToAdd = isFlashSale
      ? {
          ...product,
          price: product.flashSale.discountPrice,
          originalPrice: product.price,
          discountPercentage: product.flashSale.discountPercentage,
          isFlashSale: true
        }
      : product;

    dispatch(addItem(itemToAdd));
    dispatch(removeFromWishlist(product._id));
  };

  const handleSyncToServer = async () => {
    const cleaned = phoneInput.trim();
    if (!cleaned || cleaned.length < 8) {
      toast.error('Enter a valid phone number');
      return;
    }
    dispatch(setPhone(cleaned));
    const response = await dispatch(syncWishlistWithServer({
      phone: cleaned,
      storeSlug,
      items: wishlistItems
    }));
    if (syncWishlistWithServer.fulfilled.match(response)) {
      toast.success('Wishlist saved! Use this phone to access it anywhere.');
      setShowSyncSection(false);
    } else {
      toast.error(response.payload || 'Failed to sync wishlist');
    }
  };

  const handleRestoreFromServer = async () => {
    const cleaned = phoneInput.trim();
    if (!cleaned || cleaned.length < 8) {
      toast.error('Enter a valid phone number');
      return;
    }
    dispatch(setPhone(cleaned));
    const response = await dispatch(fetchWishlistFromServer({
      phone: cleaned,
      storeSlug
    }));
    if (fetchWishlistFromServer.fulfilled.match(response)) {
      toast.success('Wishlist restored!');
      setShowSyncSection(false);
    } else {
      toast.error(response.payload || 'Failed to restore wishlist');
    }
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

            <div className="px-4 py-3 bg-gradient-to-r from-padi-green/5 to-gold/5 border-b">
              {!showSyncSection ? (
                <button
                  onClick={() => setShowSyncSection(true)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-white rounded-xl border border-padi-green/20 text-sm hover:border-padi-green/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FiRefreshCw size={16} className="text-padi-green" />
                    <span className="font-medium text-navy">
                      {isSynced ? 'Wishlist synced' : 'Save & sync wishlist'}
                    </span>
                  </div>
                  {isSynced ? (
                    <span className="text-xs text-padi-green font-medium">✓</span>
                  ) : (
                    <span className="text-xs text-gray-400">→</span>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-padi-green focus:border-transparent outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSyncToServer}
                      disabled={syncLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-padi-green text-white py-2.5 rounded-xl text-sm font-medium hover:bg-padi-green-dark transition-colors disabled:opacity-50"
                    >
                      <FiSave size={14} />
                      {syncLoading ? 'Saving...' : 'Save Wishlist'}
                    </button>
                    <button
                      onClick={handleRestoreFromServer}
                      disabled={syncLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-navy text-white py-2.5 rounded-xl text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-50"
                    >
                      <FiDownload size={14} />
                      {syncLoading ? 'Loading...' : 'Restore Wishlist'}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowSyncSection(false)}
                    className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {phone && !showSyncSection && (
                <p className="text-xs text-gray-500 mt-1.5 text-center">
                  Saved as <span className="font-medium text-navy">{phone}</span>
                </p>
              )}
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
              <div className="p-4 border-t bg-gray-50 space-y-2">
                <button
                  onClick={() => {
                    wishlistItems.forEach(item => handleAddToCart(item));
                  }}
                  className="w-full btn-primary"
                >
                  Move All to Cart
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
