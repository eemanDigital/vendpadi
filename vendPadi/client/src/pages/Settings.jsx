import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { vendorAPI } from '../api/axiosInstance';
import { updateVendor } from '../store/authSlice';
import PlanBadge from '../components/PlanBadge';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiCopy, FiExternalLink, FiCheck } from 'react-icons/fi';

const CATEGORIES = ['food', 'fashion', 'phones', 'cakes', 'other'];

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

        <nav className="space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
            📦 Products
          </a>
          <a href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-padi-green/20 text-padi-green">
            ⚙️ Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-sora font-bold text-2xl text-navy mb-6">Store Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload */}
            <div className="card p-6">
              <h2 className="font-sora font-semibold text-lg mb-4">Store Logo</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🏪</span>
                  )}
                </div>
                <div>
                  <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                    <FiUpload /> Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG or WebP. Max 2MB.</p>
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="card p-6">
              <h2 className="font-sora font-semibold text-lg mb-4">Store Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Tell customers about your store..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="2348012345678"
                  />
                  <p className="text-xs text-gray-400 mt-1">Include country code (e.g., 234 for Nigeria)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Store Link */}
            <div className="card p-6">
              <h2 className="font-sora font-semibold text-lg mb-4">Your Store Link</h2>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <span className="flex-1 text-gray-600 break-all">
                  {window.location.origin}/store/{vendor?.slug}
                </span>
                <button
                  type="button"
                  onClick={copyStoreLink}
                  className="flex items-center gap-2 text-padi-green hover:text-padi-green-dark transition-colors whitespace-nowrap"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={`/store/${vendor?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-500 hover:text-padi-green transition-colors whitespace-nowrap"
                >
                  <FiExternalLink /> Preview
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
