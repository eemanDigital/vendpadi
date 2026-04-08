import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, vendorAPI } from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import PlanBadge from '../components/PlanBadge';
import { logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import { FiPlus, FiCopy, FiEdit2, FiTrash2, FiExternalLink, FiX, FiPackage, FiSettings, FiShoppingBag, FiTrendingUp, FiLogOut } from 'react-icons/fi';

const PLAN_LIMITS = {
  free: { products: 5, images: 1 },
  basic: { products: 20, images: 3 },
  premium: { products: Infinity, images: 3 }
};

const Dashboard = () => {
  const { vendor } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [copied, setCopied] = useState(false);

  const planLimits = PLAN_LIMITS[vendor?.plan?.type || 'free'];
  const currentLimit = planLimits.products;
  const isAtLimit = products.length >= currentLimit && currentLimit !== Infinity;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productAPI.delete(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    if (isAtLimit) {
      toast.error(`Your ${vendor?.plan?.type} plan allows only ${currentLimit} products. Upgrade to add more.`);
      return;
    }
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const copyStoreLink = () => {
    const link = `${window.location.origin}/store/${vendor.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 w-64 h-screen bg-navy text-white p-6 flex flex-col overflow-y-auto">
        <Link to="/" className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-padi-green rounded-xl flex items-center justify-center">
            <span className="font-sora font-bold text-xl">V</span>
          </div>
          <span className="font-sora font-bold text-lg">VendPadi</span>
        </Link>

        <div className="mb-4">
          <div className="w-16 h-16 bg-padi-green/20 rounded-xl mx-auto flex items-center justify-center mb-3 overflow-hidden">
            {vendor?.logo ? (
              <img src={vendor.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <h3 className="font-sora font-semibold text-center truncate px-2">{vendor?.businessName}</h3>
          <div className="flex justify-center mt-2">
            <PlanBadge plan={vendor?.plan} size="sm" />
          </div>
          
          <div className="mt-4 bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Products</span>
              <span>{products.length}/{currentLimit === Infinity ? '∞' : currentLimit}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div 
                className={`h-full rounded-full transition-all ${products.length >= currentLimit ? 'bg-gold' : 'bg-padi-green'}`}
                style={{ width: `${currentLimit === Infinity ? 0 : Math.min((products.length / currentLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="space-y-1 mb-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-padi-green/20 text-padi-green">
            <FiPackage /> Products
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiSettings /> Settings
          </Link>
        </nav>

        <div className="mt-4 p-4 bg-white/10 rounded-xl">
          <p className="text-xs text-gray-400 mb-2">Your Store Link</p>
          <p className="text-sm font-medium break-all">/store/{vendor?.slug}</p>
          <button
            onClick={copyStoreLink}
            className="mt-2 flex items-center gap-2 text-sm text-padi-green hover:text-padi-green-dark transition-colors"
          >
            <FiCopy /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {vendor?.plan?.type !== 'premium' && (
          <div className="mt-4 p-4 bg-gold/20 rounded-xl border border-gold/30">
            <p className="text-xs text-gold font-medium mb-2">👑 Upgrade to Premium</p>
            <p className="text-xs text-gray-400 mb-3">Unlimited products & PDF invoices</p>
            <Link to="/settings" className="text-xs bg-gold hover:bg-gold/90 text-white px-3 py-1.5 rounded-lg font-medium">
              Upgrade Now
            </Link>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-padi-green rounded-lg flex items-center justify-center">
              <span className="font-sora font-bold text-white">V</span>
            </div>
            <span className="font-sora font-bold text-navy">VendPadi</span>
          </Link>
          <PlanBadge plan={vendor?.plan} size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <div className="lg:ml-64 pb-20 lg:pb-6">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-sora font-bold text-2xl text-navy">Your Products</h1>
              <p className="text-gray-500">
                {products.length} of {currentLimit === Infinity ? '∞' : currentLimit} products
                {vendor?.plan?.type !== 'free' && ` • ${planLimits.images} images/product`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`/store/${vendor?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-padi-green transition-colors"
              >
                <FiExternalLink /> View Store
              </a>
              <button
                onClick={handleAddNew}
                disabled={isAtLimit}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus /> Add Product
              </button>
            </div>
          </div>

          {isAtLimit && (
            <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium text-gold">Product limit reached</p>
                  <p className="text-sm text-gray-600">Your {vendor?.plan?.type} plan allows {currentLimit} products.</p>
                </div>
              </div>
              <Link to="/settings" className="bg-gold hover:bg-gold/90 text-white px-5 py-2 rounded-xl font-medium transition-colors whitespace-nowrap">
                Upgrade Plan
              </Link>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-padi-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📦</span>
              </div>
              <h3 className="font-sora font-semibold text-xl mb-2">No Products Yet</h3>
              <p className="text-gray-500 mb-6">Add your first product to start selling</p>
              <button onClick={handleAddNew} className="btn-primary inline-flex items-center gap-2">
                <FiPlus /> Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product._id} className="relative group">
                  <ProductCard product={product} />
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-navy hover:text-white transition-colors"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  {!product.inStock && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-30">
        <div className="flex items-center justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-padi-green">
            <FiPackage />
            <span className="text-xs">Products</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center gap-1 text-gray-400">
            <FiShoppingBag />
            <span className="text-xs">Orders</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center gap-1 text-gray-400">
            <FiSettings />
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-sora font-bold text-lg">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingProduct(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-5">
              <ProductForm
                product={editingProduct}
                onSuccess={handleSuccess}
                onCancel={() => { setShowModal(false); setEditingProduct(null); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
