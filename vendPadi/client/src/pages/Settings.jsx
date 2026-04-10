import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { vendorAPI, authAPI } from '../api/axiosInstance';
import { updateVendor } from '../store/authSlice';
import PlanBadge from '../components/PlanBadge';
import PlanUpgradeModal from '../components/PlanUpgradeModal';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiCopy, FiExternalLink, FiCheck, FiPackage, FiShoppingBag, FiTrendingUp, FiLock, FiAlertCircle } from 'react-icons/fi';

const CATEGORIES = ['food', 'fashion', 'phones', 'cakes', 'other'];

const PLAN_FEATURES = {
  free: { products: 10, images: 2, logo: false, pdf: false },
  starter: { products: 50, images: 4, logo: true, pdf: false },
  business: { products: 200, images: 6, logo: true, pdf: true },
  premium: { products: '∞', images: 8, logo: true, pdf: true }
};

const Settings = () => {
  const dispatch = useDispatch();
  const { vendor } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    phone: '',
    category: 'food'
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentFeatures = PLAN_FEATURES[vendor?.plan?.type || 'free'];

  useEffect(() => {
    if (vendor) {
      setFormData({
        businessName: vendor.businessName || '',
        description: vendor.description || '',
        phone: vendor.phone || '',
        category: vendor.category || 'other'
      });
      setLogoPreview(vendor.logo || '');
    }
  }, [vendor]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

      if (logoFile) {
        const formDataLogo = new FormData();
        formDataLogo.append('logo', logoFile);
        const { data: logoData } = await vendorAPI.updateLogo(formDataLogo);
        updatedData.logo = logoData.logo;
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
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="icon" size="sm" />
          </Link>
          <PlanBadge plan={vendor?.plan} size="sm" />
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
            <PlanBadge plan={vendor?.plan} size="sm" />
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-sora font-semibold text-lg">Current Plan</h2>
                <div className="flex items-center gap-2 mt-1">
                  <PlanBadge plan={vendor?.plan} size="md" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {vendor?.plan?.type === 'free' && '🆓'}
                  {vendor?.plan?.type === 'starter' && '💡'}
                  {vendor?.plan?.type === 'business' && '🚀'}
                  {vendor?.plan?.type === 'premium' && '👑'}
                </span>
                {vendor?.plan?.type !== 'premium' && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                  >
                    <FiTrendingUp size={14} /> Upgrade
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-sora font-semibold text-lg mb-4">Store Logo</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🏪</span>
                  )}
                </div>
                <div>
                  <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                    <FiUpload /> Upload Logo
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG or WebP. Max 2MB.</p>
                </div>
              </div>
            </div>

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
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Store Link */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-sora font-semibold text-lg mb-4">Your Store Link</h2>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <span className="flex-1 text-gray-600 break-all text-sm">{window.location.origin}/store/{vendor?.slug}</span>
                <button type="button" onClick={copyStoreLink} className="flex items-center gap-2 text-padi-green hover:text-padi-green-dark transition-colors whitespace-nowrap text-sm font-medium">
                  {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy'}
                </button>
                <a href={`/store/${vendor?.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-padi-green transition-colors whitespace-nowrap text-sm font-medium">
                  <FiExternalLink /> Preview
                </a>
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

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : <><FiSave /> Save Changes</>}
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
    </div>
  );
};

export default Settings;
