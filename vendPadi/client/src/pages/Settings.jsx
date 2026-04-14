import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { vendorAPI, authAPI } from '../api/axiosInstance';
import { updateVendor } from '../store/authSlice';
import PlanBadge from '../components/PlanBadge';
import PlanUpgradeModal from '../components/PlanUpgradeModal';
import Logo from '../components/Logo';
import DeleteAccountModal from '../components/DeleteAccountModal';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiCopy, FiExternalLink, FiCheck, FiPackage, FiShoppingBag, FiTrendingUp, FiLock, FiAlertCircle, FiGrid, FiHeart, FiMessageSquare, FiAlertTriangle, FiSearch, FiImage, FiLink, FiTrash2, FiZap } from 'react-icons/fi';

const CATEGORIES = ['food', 'fashion', 'phones', 'beauty', 'cakes', 'electronics', 'home', 'sports', 'books', 'toys', 'services', 'other'];

const PLAN_FEATURES = {
  free: { 
    products: 5, 
    images: 1, 
    logo: false, 
    coverImage: false,
    customLink: false,
    pdf: false,
    removeBranding: false,
    analytics: 'basic',
    topProducts: false,
    stockTracking: true,
    lowStockAlert: '10 items',
    filtering: true,
    sorting: false,
    wishlist: true,
    reviews: true,
    shareTools: false
  },
  starter: { 
    products: 30, 
    images: 3, 
    logo: true, 
    coverImage: false,
    customLink: false,
    pdf: false,
    removeBranding: true,
    analytics: 'basic',
    topProducts: false,
    stockTracking: true,
    lowStockAlert: '8 items',
    filtering: true,
    sorting: false,
    wishlist: true,
    reviews: true,
    shareTools: true
  },
  business: { 
    products: 100, 
    images: 5, 
    logo: true, 
    coverImage: false,
    customLink: false,
    pdf: true,
    removeBranding: true,
    analytics: 'full',
    topProducts: true,
    stockTracking: true,
    lowStockAlert: '5 items',
    filtering: true,
    sorting: true,
    wishlist: true,
    reviews: true,
    shareTools: true
  },
  premium: { 
    products: '∞', 
    images: 8, 
    logo: true, 
    coverImage: true,
    customLink: true,
    pdf: true,
    removeBranding: true,
    analytics: 'full',
    topProducts: true,
    stockTracking: true,
    lowStockAlert: '3 items',
    filtering: true,
    sorting: true,
    wishlist: true,
    reviews: true,
    shareTools: true
  }
};

const Settings = () => {
  const dispatch = useDispatch();
  const { vendor } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    phone: '',
    category: 'food',
    customCategory: ''
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [customLink, setCustomLink] = useState('');
  const [customLinkLoading, setCustomLinkLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOnTrial = vendor?.trial?.active === true;
  const trialPlan = vendor?.trial?.plan || 'premium';
  const effectivePlan = isOnTrial ? trialPlan : (vendor?.plan?.type || 'free');
  const currentFeatures = PLAN_FEATURES[effectivePlan];
  const isCustomCategory = !CATEGORIES.includes(formData.category) && formData.category !== 'food';

  useEffect(() => {
    if (vendor) {
      setFormData({
        businessName: vendor.businessName || '',
        description: vendor.description || '',
        phone: vendor.phone || '',
        category: vendor.category || 'food',
        customCategory: !CATEGORIES.includes(vendor.category) && vendor.category ? vendor.category : ''
      });
      setLogoPreview(vendor.logo || '');
      setCoverPreview(vendor.coverImage || '');
      setCustomLink(vendor.customLink || '');
    }
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' && value !== 'other') {
      setFormData(prev => ({ ...prev, [name]: value, customCategory: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedData = { ...formData };

      if (formData.category === 'other' && formData.customCategory?.trim()) {
        updatedData.category = formData.customCategory.trim().toLowerCase().replace(/\s+/g, '-');
      }
      delete updatedData.customCategory;

      if (logoFile) {
        const formDataLogo = new FormData();
        formDataLogo.append('logo', logoFile);
        const { data: logoData } = await vendorAPI.updateLogo(formDataLogo);
        updatedData.logo = logoData.logo;
      }

      if (coverFile && currentFeatures.coverImage) {
        const formDataCover = new FormData();
        formDataCover.append('coverImage', coverFile);
        const { data: coverData } = await vendorAPI.updateCover(formDataCover);
        updatedData.coverImage = coverData.coverImage;
      }

      const { data } = await vendorAPI.updateMe(updatedData);
      dispatch(updateVendor(data));
      toast.success('Settings saved!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const copyStoreLink = () => {
    const link = `${window.location.origin}/store/${vendor?.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomLinkSubmit = async (e) => {
    e.preventDefault();
    if (!customLink.trim()) return;
    
    setCustomLinkLoading(true);
    try {
      const { data } = await vendorAPI.updateCustomLink(customLink.trim());
      setCustomLink(data.customLink);
      dispatch(updateVendor({ ...vendor, customLink: data.customLink }));
      toast.success('Custom link updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update custom link');
    } finally {
      setCustomLinkLoading(false);
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6 overflow-x-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="icon" size="sm" showText />
          </Link>
          <PlanBadge plan={vendor?.plan} trial={vendor?.trial} size="sm" />
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 w-64 h-full bg-navy text-white p-6">
        <Link to="/" className="flex items-center gap-3 mb-8">
          <Logo variant="icon-light" size="md" />
        </Link>

        <div className="mb-6">
          <div className="w-16 h-16 bg-padi-green/20 rounded-xl mx-auto flex items-center justify-center mb-3 overflow-hidden">
            {vendor?.logo ? (
              <img src={vendor.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <h3 className="font-sora font-semibold text-center">{vendor?.businessName}</h3>
          <div className="flex justify-center mt-2">
            <PlanBadge plan={vendor?.plan} trial={vendor?.trial} size="sm" />
          </div>
        </div>

        <nav className="space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiPackage /> Products
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-padi-green/20 text-padi-green">
            ⚙️ Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="max-w-2xl mx-auto p-4 lg:p-6">
          <h1 className="font-sora font-bold text-2xl text-navy mb-6">Store Settings</h1>

            {/* Plan Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-sora font-semibold text-lg">Current Plan</h2>
                <div className="flex items-center gap-2 mt-1">
                  <PlanBadge plan={vendor?.plan} trial={vendor?.trial} size="md" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl">
                  {effectivePlan === 'free' && '🆓'}
                  {effectivePlan === 'starter' && '💡'}
                  {effectivePlan === 'business' && '🚀'}
                  {effectivePlan === 'premium' && '👑'}
                </span>
                {isOnTrial && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <FiZap size={10} /> Trial Active
                  </span>
                )}
                {!isOnTrial && effectivePlan !== 'premium' && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <FiTrendingUp size={14} /> Upgrade
                  </button>
                )}
                {isOnTrial && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <FiTrendingUp size={14} /> Upgrade Now
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-navy">{currentFeatures.products}</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xl font-bold text-navy">{currentFeatures.images}</p>
                <p className="text-xs text-gray-500">Images/Product</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg">{currentFeatures.logo ? '✅' : '❌'}</p>
                <p className="text-xs text-gray-500">Logo Upload</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg">{currentFeatures.pdf ? '✅' : '❌'}</p>
                <p className="text-xs text-gray-500">PDF Invoices</p>
              </div>
            </div>

            {/* New Features */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 font-medium">Included Features:</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium whitespace-nowrap">
                  <FiPackage size={12} /> Stock Tracking
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium whitespace-nowrap">
                  <FiAlertTriangle size={12} /> Low Stock ({currentFeatures.lowStockAlert})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium whitespace-nowrap">
                  <FiSearch size={12} /> Search & Filter
                </span>
                {currentFeatures.sorting && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    <FiGrid size={12} /> Advanced Sorting
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium whitespace-nowrap">
                  <FiHeart size={12} /> Wishlist
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium whitespace-nowrap">
                  <FiMessageSquare size={12} /> Reviews
                </span>
                {currentFeatures.analytics && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    📊 Analytics ({currentFeatures.analytics === 'full' ? 'Full' : 'Basic'})
                  </span>
                )}
                {currentFeatures.topProducts && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    📈 Top Products
                  </span>
                )}
                {currentFeatures.shareTools && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    🔗 Share Tools
                  </span>
                )}
                {currentFeatures.coverImage && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold rounded-lg text-xs font-medium whitespace-nowrap">
                    🖼️ Cover Image
                  </span>
                )}
                {currentFeatures.customLink && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold/20 text-gold rounded-lg text-xs font-medium whitespace-nowrap">
                    🔗 Custom Link
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="font-sora font-semibold text-lg">Store Logo</h2>
                {!currentFeatures.logo && (
                  <button onClick={() => setShowUpgradeModal(true)} className="text-xs text-gold hover:text-gold/80 flex items-center gap-1">
                    <FiTrendingUp size={12} /> Upgrade to unlock
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🏪</span>
                  )}
                </div>
                <div>
                  {currentFeatures.logo ? (
                    <>
                      <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                        <FiUpload /> Upload Logo
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-400 mt-2">JPG, PNG or WebP. Max 2MB.</p>
                    </>
                  ) : (
                    <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-400 text-sm flex items-center gap-2">
                      <FiLock size={16} /> Logo upload requires Starter plan
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image - Premium Only */}
            {currentFeatures.coverImage && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="font-sora font-semibold text-lg">Store Cover Image</h2>
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full shrink-0">Premium</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-full sm:w-32 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {coverPreview ? (
                      <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FiImage className="text-gray-300 text-2xl" />
                    )}
                  </div>
                  <div>
                    <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                      <FiUpload /> Upload Cover
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('Cover image must be less than 5MB');
                            return;
                          }
                          setCoverFile(file);
                          setCoverPreview(URL.createObjectURL(file));
                        }
                      }} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Recommended: 1200x400px. Max 5MB.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Store Link - Premium Only */}
            {currentFeatures.customLink ? (
              <div className="bg-white rounded-2xl border border-gold/30 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sora font-semibold text-lg flex items-center gap-2">
                    <FiLink className="text-gold" /> Custom Store Link
                  </h2>
                  <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">Premium</span>
                </div>
                <form onSubmit={handleCustomLinkSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-600 text-sm shrink-0">vendpadi.com/</span>
                  <div className="flex flex-col sm:flex-row gap-2 flex-1">
                    <input 
                      type="text" 
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="your-store"
                      className="flex-1 bg-white px-3 py-2 rounded-lg border border-gray-200 text-sm min-w-0"
                    />
                    <button 
                      type="submit"
                      disabled={customLinkLoading}
                      className="px-4 py-2 bg-padi-green text-white text-sm rounded-lg hover:bg-padi-green-dark disabled:opacity-50 shrink-0"
                    >
                      {customLinkLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
                {vendor?.customLink && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(`https://vendpadi.com/store/custom/${vendor.customLink}`)}
                      className="text-padi-green text-sm hover:underline flex items-center gap-1"
                    >
                      <FiCopy size={14} /> Copy
                    </button>
                    <span className="text-gray-400">•</span>
                    <a 
                      href={`/store/custom/${vendor.customLink}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-padi-green text-sm hover:underline flex items-center gap-1"
                    >
                      <FiExternalLink size={14} /> View
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sora font-semibold text-lg flex items-center gap-2">
                    <FiLink className="text-gray-400" /> Custom Store Link
                  </h2>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Premium</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-400 text-sm">
                  Upgrade to Premium to set your custom store link (e.g., vendpadi.com/store/mystore)
                </div>
              </div>
            )}

            {/* Store Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-sora font-semibold text-lg mb-4">Store Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="input-field" placeholder="Your business name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none" rows={3} placeholder="Tell customers about your store..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="2348012345678" />
                  <p className="text-xs text-gray-400 mt-1">Include country code (e.g., 234 for Nigeria)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  {formData.category === 'other' ? (
                    <input
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter business category"
                    />
                  ) : (
                    <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Store Link */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-sora font-semibold text-lg mb-4">Your Store Link</h2>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-600 break-all text-sm mb-3">{window.location.origin}/store/{vendor?.slug}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" onClick={copyStoreLink} className="flex items-center gap-2 text-padi-green hover:text-padi-green-dark transition-colors whitespace-nowrap text-sm font-medium">
                    {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <a href={`/store/${vendor?.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-padi-green transition-colors whitespace-nowrap text-sm font-medium">
                    <FiExternalLink /> Preview
                  </a>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-padi-green/10 rounded-xl flex items-center justify-center">
                  <FiLock className="text-padi-green" />
                </div>
                <h2 className="font-sora font-semibold text-lg">Change Password</h2>
              </div>

              {passwordError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <FiAlertCircle size={16} />
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    placeholder="Re-enter new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-padi-green border-t-transparent rounded-full animate-spin"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <FiLock /> Change Password
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 mt-4">
                Forgot your password?{' '}
                <Link to="/forgot-password" className="text-padi-green hover:underline">
                  Reset it here
                </Link>
              </p>
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-2xl border border-red-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <FiTrash2 className="text-red-500" />
                </div>
                <div>
                  <h2 className="font-sora font-semibold text-lg">Delete Account</h2>
                  <p className="text-sm text-gray-500">Permanently remove your account and data</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. All your products, orders, 
                and store settings will be permanently removed.
              </p>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiTrash2 /> Delete My Account
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 border-2 border-padi-green border-t-transparent rounded-full animate-spin"></div> Saving...</> : <><FiSave /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-30">
        <div className="flex items-center justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
            <FiPackage /><span className="text-xs">Products</span>
          </Link>
          <Link to="/orders" className="flex flex-col items-center gap-1 text-gray-400">
            <FiShoppingBag /><span className="text-xs">Orders</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center gap-1 text-padi-green">
            <FiCheck /><span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>

      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => setShowUpgradeModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        vendor={vendor}
      />
    </div>
  );
};

export default Settings;
