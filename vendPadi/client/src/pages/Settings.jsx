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
import { FiSave, FiUpload, FiCopy, FiExternalLink, FiCheck, FiPackage, FiShoppingBag, FiTrendingUp, FiLock, FiAlertCircle, FiGrid, FiHeart, FiMessageSquare, FiAlertTriangle, FiSearch, FiImage, FiLink, FiTrash2, FiZap, FiShield, FiTruck, FiPlus, FiTrash, FiClock, FiFileText, FiX } from 'react-icons/fi';

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
    shareTools: false,
    verifiedBadge: false,
    flashSales: false,
    deliveryZones: false,
    bundles: false
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
    shareTools: true,
    verifiedBadge: false,
    flashSales: false,
    deliveryZones: false,
    bundles: false
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
    shareTools: true,
    verifiedBadge: true,
    flashSales: false,
    deliveryZones: true,
    bundles: false
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
    shareTools: true,
    verifiedBadge: true,
    flashSales: true,
    deliveryZones: true,
    bundles: true
  }
};

const DOCUMENT_TYPES = [
  { value: 'cac', label: 'CAC Certificate', description: 'Corporate Affairs Commission registration' },
  { value: 'nin', label: 'National ID (NIN)', description: "Nigeria National Identification Number" },
  { value: 'passport', label: 'International Passport', description: 'Valid international passport' },
  { value: 'drivers_license', label: "Driver's License", description: 'Valid Nigerian drivers license' }
];

const COMMON_ZONES = [
  'Lagos - Mainland',
  'Lagos - Island',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan'
];

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
  
  const [verificationData, setVerificationData] = useState({
    documentType: '',
    documentFile: null,
    documentPreview: ''
  });
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

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
      
      if (vendor.deliveryZones) {
        setDeliveryZones(vendor.deliveryZones.zones || []);
        setDeliveryEnabled(vendor.deliveryZones.enabled || false);
      }
    }
  }, [vendor]);
  
  useEffect(() => {
    if (vendor?.verification) {
      setVerificationData(prev => ({
        ...prev,
        documentType: vendor.verification.documentType || ''
      }));
    }
  }, [vendor?.verification]);

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
  
  const handleVerificationDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Document must be less than 10MB');
        return;
      }
      setVerificationData({
        ...verificationData,
        documentFile: file,
        documentPreview: URL.createObjectURL(file)
      });
    }
  };
  
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!verificationData.documentType || !verificationData.documentFile) {
      toast.error('Please select a document type and upload a document');
      return;
    }
    
    setVerificationLoading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('documentType', verificationData.documentType);
      formDataUpload.append('document', verificationData.documentFile);
      
      await vendorAPI.submitVerification(verificationData.documentType, formDataUpload);
      toast.success('Verification documents submitted! We will review within 24-48 hours.');
      
      const { data: vendorData } = await vendorAPI.getMe();
      dispatch(updateVendor(vendorData));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit verification');
    } finally {
      setVerificationLoading(false);
    }
  };
  
  const handleAddZone = () => {
    setDeliveryZones([...deliveryZones, { name: '', fee: '', estimatedDays: '1-2 days', isActive: true }]);
  };
  
  const handleRemoveZone = (index) => {
    setDeliveryZones(deliveryZones.filter((_, i) => i !== index));
  };
  
  const handleZoneChange = (index, field, value) => {
    const updated = [...deliveryZones];
    updated[index][field] = value;
    setDeliveryZones(updated);
  };
  
  const handleDeliveryZonesSubmit = async (e) => {
    e.preventDefault();
    setDeliveryLoading(true);
    try {
      const validZones = deliveryZones.filter(z => z.name.trim()).map(z => ({
        name: z.name.trim(),
        fee: Number(z.fee) || 0,
        estimatedDays: z.estimatedDays || '1-2 days',
        isActive: z.isActive
      }));
      
      await vendorAPI.updateDeliveryZones({
        enabled: deliveryEnabled,
        zones: validZones
      });
      
      toast.success('Delivery zones updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update delivery zones');
    } finally {
      setDeliveryLoading(false);
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
                {currentFeatures.verifiedBadge && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    <FiShield size={12} /> Verified Badge
                  </span>
                )}
                {currentFeatures.flashSales && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    ⚡ Flash Sales
                  </span>
                )}
                {currentFeatures.deliveryZones && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    <FiTruck size={12} /> Delivery Zones
                  </span>
                )}
                {currentFeatures.bundles && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium whitespace-nowrap">
                    <FiGift size={12} /> Product Bundles
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
            
            {/* Verified Badge Section - Business+ Only */}
            {currentFeatures.verifiedBadge ? (
              <div className="bg-white rounded-2xl border border-blue-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <FiShield className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="font-sora font-semibold text-lg flex items-center gap-2">
                        Verified Vendor Badge
                        {vendor?.verification?.isVerified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            <FiCheck size={12} /> Verified
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-gray-500">Build trust with a verified badge on your store</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Business+</span>
                </div>
                
                {vendor?.verification?.status === 'pending' ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <FiClock className="text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Verification Pending</p>
                      <p className="text-sm text-amber-600">Your documents are being reviewed. This usually takes 24-48 hours.</p>
                    </div>
                  </div>
                ) : vendor?.verification?.isVerified ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <FiCheckCircle className="text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">You're Verified!</p>
                      <p className="text-sm text-green-600">Your store now displays a verified badge to build customer trust.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600">Submit your business document to get verified. This helps customers trust your business.</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {DOCUMENT_TYPES.map(doc => (
                          <label key={doc.value} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${verificationData.documentType === doc.value ? 'border-padi-green bg-padi-green/5' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                              type="radio"
                              name="documentType"
                              value={doc.value}
                              checked={verificationData.documentType === doc.value}
                              onChange={(e) => setVerificationData({ ...verificationData, documentType: e.target.value })}
                              className="mt-1"
                            />
                            <div>
                              <p className="font-medium text-sm">{doc.label}</p>
                              <p className="text-xs text-gray-500">{doc.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center ${verificationData.documentPreview ? 'border-padi-green' : 'border-gray-300'}`}>
                        {verificationData.documentPreview ? (
                          <div className="space-y-3">
                            <FiFileText className="text-padi-green text-4xl mx-auto" />
                            <p className="text-sm text-gray-600">{verificationData.documentFile?.name}</p>
                            <button type="button" onClick={() => setVerificationData({ ...verificationData, documentFile: null, documentPreview: '' })} className="text-sm text-red-500 hover:text-red-600">
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <FiUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload document</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP or PDF (max 10MB)</p>
                            <input type="file" accept="image/*,.pdf" onChange={handleVerificationDocumentChange} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <button type="submit" disabled={verificationLoading || !verificationData.documentType || !verificationData.documentFile} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                      {verificationLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiShield /> Submit for Verification
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FiShield className="text-gray-400 text-xl" />
                    </div>
                    <div>
                      <h2 className="font-sora font-semibold text-lg">Verified Vendor Badge</h2>
                      <p className="text-sm text-gray-500">Build trust with customers</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">Business+</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-400 text-sm flex items-center gap-2">
                  <FiLock size={16} /> Upgrade to Business or Premium to get verified badge
                  <button onClick={() => setShowUpgradeModal(true)} className="ml-auto text-padi-green hover:underline whitespace-nowrap">
                    Upgrade
                  </button>
                </div>
              </div>
            )}
            
            {/* Delivery Zones Section - Business+ Only */}
            {currentFeatures.deliveryZones ? (
              <div className="bg-white rounded-2xl border border-orange-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <FiTruck className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="font-sora font-semibold text-lg">Delivery Zones</h2>
                      <p className="text-sm text-gray-500">Set delivery fees for different areas</p>
                    </div>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Business+</span>
                </div>
                
                <form onSubmit={handleDeliveryZonesSubmit} className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-sm">Enable Delivery Calculator</p>
                      <p className="text-xs text-gray-500">Show delivery fees before checkout</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeliveryEnabled(!deliveryEnabled)}
                      className={`relative w-12 h-7 rounded-full transition-colors ${deliveryEnabled ? 'bg-padi-green' : 'bg-gray-300'}`}>
                      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${deliveryEnabled ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  {deliveryEnabled && (
                    <>
                      <div className="space-y-3">
                        {deliveryZones.map((zone, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <input
                              type="text"
                              value={zone.name}
                              onChange={(e) => handleZoneChange(index, 'name', e.target.value)}
                              placeholder="Zone name (e.g., Lagos Island)"
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-sm">₦</span>
                              <input
                                type="number"
                                value={zone.fee}
                                onChange={(e) => handleZoneChange(index, 'fee', e.target.value)}
                                placeholder="Fee"
                                className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                              />
                            </div>
                            <input
                              type="text"
                              value={zone.estimatedDays}
                              onChange={(e) => handleZoneChange(index, 'estimatedDays', e.target.value)}
                              placeholder="ETA"
                              className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                            <button type="button" onClick={() => handleRemoveZone(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                              <FiTrash size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button type="button" onClick={handleAddZone} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-padi-green hover:text-padi-green transition-colors flex items-center justify-center gap-2">
                        <FiPlus /> Add Delivery Zone
                      </button>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-xs text-blue-700 font-medium mb-2">Quick add common zones:</p>
                        <div className="flex flex-wrap gap-2">
                          {COMMON_ZONES.filter(z => !deliveryZones.find(dz => dz.name === z)).map(zone => (
                            <button key={zone} type="button" onClick={() => setDeliveryZones([...deliveryZones, { name: zone, fee: '', estimatedDays: '1-2 days', isActive: true }])} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs text-blue-700 hover:bg-blue-100">
                              {zone}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <button type="submit" disabled={deliveryLoading} className="w-full btn-primary flex items-center justify-center gap-2">
                    {deliveryLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave /> Save Delivery Zones
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FiTruck className="text-gray-400 text-xl" />
                    </div>
                    <div>
                      <h2 className="font-sora font-semibold text-lg">Delivery Zones</h2>
                      <p className="text-sm text-gray-500">Set delivery fees for different areas</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">Business+</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-400 text-sm flex items-center gap-2">
                  <FiLock size={16} /> Upgrade to Business or Premium to set delivery zones
                  <button onClick={() => setShowUpgradeModal(true)} className="ml-auto text-padi-green hover:underline whitespace-nowrap">
                    Upgrade
                  </button>
                </div>
              </div>
            )}

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
