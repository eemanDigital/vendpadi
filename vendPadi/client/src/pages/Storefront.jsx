import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, incrementQty, decrementQty, clearCart } from '../store/cartSlice';
import { storeAPI } from '../api/axiosInstance';
import { buildWhatsAppOrderLink } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiShoppingCart, FiMessageCircle, FiTrash2, FiX } from 'react-icons/fi';

const CATEGORY_COLORS = {
  food: 'bg-orange-100 text-orange-700',
  fashion: 'bg-pink-100 text-pink-700',
  phones: 'bg-blue-100 text-blue-700',
  cakes: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700'
};

const Storefront = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await storeAPI.getStore(slug);
        setStore(data);
      } catch (error) {
        toast.error('Store not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [slug]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleOrder = async () => {
    if (!cartItems.length) return;

    try {
      await storeAPI.createOrder(slug, {
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        totalAmount: cartTotal
      });
    } catch (error) {
      console.log('Order logging failed:', error);
    }

    const waLink = buildWhatsAppOrderLink(
      store.vendor.phone,
      store.vendor.businessName,
      cartItems
    );
    
    if (waLink) {
      window.open(waLink, '_blank');
      dispatch(clearCart());
      toast.success('Opening WhatsApp...');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-padi-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">🏪</span>
          </div>
          <h1 className="font-sora font-bold text-2xl text-navy mb-2">Store Not Found</h1>
          <p className="text-gray-500">This store doesn't exist or has been deactivated.</p>
        </div>
      </div>
    );
  }

  const { vendor, products } = store;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
              {vendor.logo ? (
                <img src={vendor.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🏪</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-sora font-bold text-2xl">{vendor.businessName}</h1>
              {vendor.description && (
                <p className="text-gray-300 text-sm mt-1">{vendor.description}</p>
              )}
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[vendor.category] || CATEGORY_COLORS.other}`}>
                {vendor.category}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sora font-semibold text-lg text-navy">
            Available Products
          </h2>
          <span className="text-sm text-gray-500">{products.length} items</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📦</span>
            </div>
            <h3 className="font-sora font-semibold text-xl mb-2">No Products Yet</h3>
            <p className="text-gray-500">This store hasn't added any products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Cart Toggle */}
      <button
        onClick={() => setShowCart(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-padi-green text-white p-4 rounded-full shadow-lg flex items-center gap-2"
      >
        <FiShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Desktop Cart Bar */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-padi-green/10 p-3 rounded-xl">
              <FiShoppingCart className="text-padi-green text-xl" />
            </div>
            <div>
              <p className="font-medium">{cartCount} item{cartCount !== 1 ? 's' : ''} selected</p>
              <p className="text-padi-green font-bold text-lg">₦{cartTotal.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleOrder}
            disabled={!cartItems.length}
            className="bg-padi-green hover:bg-padi-green-dark disabled:bg-gray-300 text-white font-semibold py-4 px-8 rounded-xl flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
          >
            <FiMessageCircle size={20} />
            Order on WhatsApp
          </button>
        </div>
      </div>

      {/* Mobile Cart Drawer */}
      {showCart && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-sora font-bold text-lg">Your Order</h3>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FiX />
              </button>
            </div>
            
            <div className="max-h-[50vh] overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="text-gray-300 text-4xl mx-auto mb-2" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-padi-green font-bold">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dispatch(decrementQty(item._id))}
                          className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-100"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.qty}</span>
                        <button
                          onClick={() => dispatch(incrementQty(item._id))}
                          className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-100"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-xl text-padi-green">₦{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={!cartItems.length}
                className="w-full bg-padi-green hover:bg-padi-green-dark disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
              >
                <FiMessageCircle size={20} />
                Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefront;
