import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI, analyticsAPI } from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import PlanBadge from '../components/PlanBadge';
import PlanUpgradeModal from '../components/PlanUpgradeModal';
import TrialBanner from '../components/TrialBanner';
import Logo from '../components/Logo';
import ShareStoreModal from '../components/ShareStoreModal';
import SearchInput from '../components/ui/SearchInput';
import SortDropdown from '../components/ui/SortDropdown';
import FilterBar from '../components/ui/FilterBar';
import EmptyState from '../components/ui/EmptyState';
import LowStockAlert from '../components/ui/LowStockAlert';
import AnalyticsCard from '../components/ui/AnalyticsCard';
import TopProductsList from '../components/ui/TopProductsList';
import GrowthInsights from '../components/ui/GrowthInsights';
import InventoryModal from '../components/store/InventoryModal';
import BundleManager from '../components/store/BundleManager';
import Loading from '../components/Loading';
import { logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';
import toast from 'react-hot-toast';
import { FiPlus, FiCopy, FiEdit2, FiTrash2, FiExternalLink, FiX, FiPackage, FiSettings, FiShoppingBag, FiLogOut, FiGrid, FiList, FiAlertTriangle, FiPackage as FiBox, FiEye, FiMessageCircle, FiShare2, FiTrendingUp, FiPercent, FiDollarSign } from 'react-icons/fi';

const PLAN_LIMITS = {
  free: { products: 5, images: 1 },
  starter: { products: 30, images: 3 },
  business: { products: 100, images: 5 },
  premium: { products: Infinity, images: 8 }
};

const Dashboard = () => {
  const { vendor } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: '',
    inStock: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    lowStock: false
  });

  // Get effective plan - trial takes priority over paid plan
  const isOnTrial = vendor?.trial?.active === true;
  const trialPlan = vendor?.trial?.plan || 'premium';
  const planType = isOnTrial ? trialPlan : (vendor?.plan?.type || 'free');
  const effectivePlan = planType;
  
  const PLANS = { free: 0, starter: 1, business: 2, premium: 3 };
  const planLimits = PLAN_LIMITS[planType];
  const hasAnalytics = PLANS[planType] >= PLANS.starter;
  const hasFullAnalytics = PLANS[planType] >= PLANS.business;
  const currentLimit = planLimits.products;
  const isAtLimit = products.length >= currentLimit && currentLimit !== Infinity;

  const lowStockProducts = useMemo(() => 
    products.filter(p => p.lowStockAlert),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.inStock !== undefined) {
      result = result.filter(p => p.inStock === filters.inStock);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.lowStock) {
      result = result.filter(p => p.lowStockAlert);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock_low':
        result.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;
      case 'stock_high':
        result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await analyticsAPI.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, [fetchProducts, fetchAnalytics]);

  const storeUrl = `${window.location.origin}/store/${vendor?.slug}`;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

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
      const displayPlan = isOnTrial ? `Premium (Trial)` : vendor?.plan?.type;
      toast.error(`Your ${displayPlan} plan allows only ${currentLimit} products. Upgrade to add more.`);
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', inStock: undefined, minPrice: undefined, maxPrice: undefined, lowStock: false });
    setSearchQuery('');
  };

  const gridCols = viewMode === 'grid' 
    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
    : 'grid-cols-1';
  
  const gridGap = viewMode === 'grid' ? 'gap-2 sm:gap-4' : 'gap-3';

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="hidden lg:block fixed left-0 top-0 w-64 h-screen bg-navy text-white p-6 flex flex-col overflow-y-auto z-20">
        <Link to="/" className="flex items-center gap-3 mb-6">
          <Logo variant="icon-light" size="md" />
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
            <PlanBadge plan={vendor?.plan} trial={vendor?.trial} size="sm" />
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

{lowStockProducts.length > 0 && (
              <LowStockAlert products={lowStockProducts} onManageClick={() => setShowInventoryModal(true)} />
            )}

            {hasAnalytics && (
              <GrowthInsights analytics={analytics} />
            )}

            <BundleManager 
              products={products.filter(p => p.inStock)} 
              onUpgradeClick={() => setShowUpgradeModal(true)} 
            />

            <div className="flex items-center justify-between">
              <h2 className="font-sora font-bold text-lg text-navy">
                Your Products
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-colors ${
                    viewMode === 'grid' ? 'bg-padi-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-colors ${
                    viewMode === 'list' ? 'bg-padi-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>

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

        {!isOnTrial && planType !== 'premium' && (
          <div className="mt-4 p-4 bg-gold/20 rounded-xl border border-gold/30">
            <p className="text-xs text-gold font-medium mb-2">👑 Upgrade Your Plan</p>
            <p className="text-xs text-gray-400 mb-3">Unlock more features & products</p>
            <button onClick={() => setShowUpgradeModal(true)} className="text-xs bg-gold hover:bg-gold/90 text-white px-3 py-1.5 rounded-lg font-medium">
              Upgrade Now
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="icon" size="sm" showText />
          </Link>
          <PlanBadge plan={vendor?.plan} trial={vendor?.trial} size="sm" />
        </div>
      </header>

      <TrialBanner />

      <div className="lg:ml-64 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
          {hasAnalytics && (
            <div className="mb-4 sm:mb-6">
              <div className={`grid gap-2 sm:gap-3 mb-3 sm:mb-4 ${hasFullAnalytics ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2 lg:grid-cols-4'}`}>
                <AnalyticsCard
                  title="Store Views"
                  value={analyticsLoading ? '...' : (analytics?.viewsCount || 0)}
                  icon={FiEye}
                  color="blue"
                />
                <AnalyticsCard
                  title="Orders Received"
                  value={analyticsLoading ? '...' : (analytics?.whatsappClicks || 0)}
                  subtitle="via WhatsApp"
                  icon={FiMessageCircle}
                  color="green"
                />
                <AnalyticsCard
                  title="Revenue"
                  value={analyticsLoading ? '...' : `₦${(analytics?.totalRevenue || 0).toLocaleString()}`}
                  subtitle="confirmed orders"
                  icon={FiDollarSign}
                  color="gold"
                />
                {hasFullAnalytics && (
                  <AnalyticsCard
                    title="Conversion Rate"
                    value={analyticsLoading ? '...' : `${analytics?.conversionRate || 0}%`}
                    subtitle="views to orders"
                    icon={FiPercent}
                    color="purple"
                  />
                )}
                <AnalyticsCard
                  title="Total Products"
                  value={analyticsLoading ? '...' : (analytics?.totalProducts || 0)}
                  icon={FiPackage}
                  color="gray"
                />
              </div>
              
              {hasFullAnalytics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  <div className="sm:col-span-2 lg:col-span-2">
                    <GrowthInsights
                      topProduct={analytics?.topProduct}
                      viewsCount={analytics?.viewsCount}
                      whatsappClicks={analytics?.whatsappClicks}
                      conversionRate={analytics?.conversionRate}
                      totalRevenue={analytics?.totalRevenue}
                    />
                  </div>
                  <div>
                    <TopProductsList products={analytics?.topProducts || []} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-sora font-bold text-2xl text-navy">Products</h1>
              <p className="text-gray-500 text-sm">
                {filteredProducts.length} of {products.length} products
                {effectivePlan !== 'free' && ` • ${planLimits.images} images max`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/store/${vendor?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-padi-green transition-colors"
              >
                <FiExternalLink /> Preview
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

          <LowStockAlert 
            products={lowStockProducts} 
            onManageInventory={() => setShowInventoryModal(true)}
            className="mb-6"
          />

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search products..."
                />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <SortDropdown
                  value={sortBy}
                  onChange={setSortBy}
                />
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {isAtLimit && (
            <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-medium text-gold">Product limit reached</p>
                  <p className="text-sm text-gray-600">Your {isOnTrial ? 'Premium (Trial)' : vendor?.plan?.type} plan allows {currentLimit} products.</p>
                </div>
              </div>
              <Link to="/settings" className="bg-gold hover:bg-gold/90 text-white px-5 py-2 rounded-xl font-medium transition-colors whitespace-nowrap">
                Upgrade Plan
              </Link>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loading variant="spinner" size="lg" />
            </div>
          ) : filteredProducts.length === 0 ? (
            products.length === 0 ? (
              <EmptyState
                icon={FiBox}
                title="No Products Yet"
                description="Add your first product to start selling on WhatsApp"
                action={handleAddNew}
                actionLabel="Add Your First Product"
              />
            ) : (
              <EmptyState
                icon={FiPackage}
                title="No Products Found"
                description="Try adjusting your search or filters"
                action={clearFilters}
                actionLabel="Clear Filters"
              />
            )
          ) : (
            <motion.div 
              layout
              className={`grid ${gridCols} ${gridGap}`}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group"
                    onClick={() => handleEdit(product)}
                  >
                    <ProductCard product={product} view={viewMode} />
                    <div 
                      className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 sm:opacity-0 group-active:opacity-100 transition-opacity z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                    {product.lowStockAlert && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FiAlertTriangle size={10} /> Low
                        </span>
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Out</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

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

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        products={products.filter(p => p.stock > 0)}
        onUpdate={fetchProducts}
      />

      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => setShowUpgradeModal(false)}
      />

      <ShareStoreModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        storeUrl={storeUrl}
        storeName={vendor?.businessName}
      />
    </div>
  );
};

export default Dashboard;
