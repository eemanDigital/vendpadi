import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { productAPI, vendorAPI } from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import PlanBadge from '../components/PlanBadge';
import toast from 'react-hot-toast';
import { FiPlus, FiCopy, FiEdit2, FiTrash2, FiExternalLink, FiX, FiPackage } from 'react-icons/fi';

const Dashboard = () => {
  const { vendor } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [copied, setCopied] = useState(false);

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
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
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

  const productLimit = { free: 5, basic: 20, premium: Infinity };
  const currentLimit = productLimit[vendor?.plan?.type || 'free'];
  const isAtLimit = products.length >= currentLimit && currentLimit !== Infinity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-navy text-white fixed w-64 h-full p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-padi-green rounded-xl flex items-center justify-center">
            <span className="font-sora font-bold text-xl">V</span>
          </div>
          <div>
            <span className="font-sora font-bold text-lg">VendPadi</span>
            <p className="text-xs text-gray-400">Vendor Dashboard</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="w-16 h-16 bg-padi-green/20 rounded-xl mx-auto flex items-center justify-center mb-3">
            {vendor?.logo ? (
              <img src={vendor.logo} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <h3 className="font-sora font-semibold text-center">{vendor?.businessName}</h3>
          <div className="flex justify-center mt-2">
            <PlanBadge plan={vendor?.plan} size="sm" />
          </div>
        </div>

        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-padi-green/20 text-padi-green">
            <FiPackage /> Products
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            ⚙️ Settings
          </Link>
        </nav>

        <div className="mt-8 p-4 bg-white/10 rounded-xl">
          <p className="text-xs text-gray-400 mb-2">Your Store Link</p>
          <p className="text-sm font-medium break-all">/store/{vendor?.slug}</p>
          <button
            onClick={copyStoreLink}
            className="mt-2 flex items-center gap-2 text-sm text-padi-green hover:text-padi-green-dark transition-colors"
          >
            <FiCopy /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-sora font-bold text-2xl text-navy">Your Products</h1>
              <p className="text-gray-500">{products.length} of {currentLimit === Infinity ? '∞' : currentLimit} products</p>
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
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-gold">Upgrade to add more products</p>
                <p className="text-sm text-gray-600">Your {vendor?.plan?.type} plan allows {currentLimit} products.</p>
              </div>
              <Link to="/settings" className="bg-gold text-white px-4 py-2 rounded-lg font-medium hover:bg-gold/90 transition-colors">
                Upgrade Plan
              </Link>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product._id} className="relative group">
                  <ProductCard product={product} showAddToCart={false} />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-navy hover:text-white transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-sora font-bold text-xl">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingProduct(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
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
