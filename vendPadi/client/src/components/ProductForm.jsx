import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { productAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { FiImage, FiX, FiCheck, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import { CATEGORIES } from './ui/FilterBar';
import StockBadge from './ui/StockBadge';

const PLAN_IMAGE_LIMITS = {
  free: 1,
  starter: 3,
  business: 5,
  premium: 8
};

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const { vendor } = useSelector((state) => state.auth);
  const isEditing = Boolean(product?._id);
  const maxImages = PLAN_IMAGE_LIMITS[vendor?.plan?.type || 'free'];
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    customCategory: '',
    inStock: product?.inStock !== false,
    stock: product?.stock || 0,
    lowStockThreshold: product?.lowStockThreshold || 5,
    images: product?.images || []
  });
  const [localImages, setLocalImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product?.images) {
      setFormData(prev => ({ ...prev, images: product.images }));
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category' && value !== 'other') {
      setFormData(prev => ({ ...prev, [name]: value, customCategory: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleLocalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remaining = maxImages - (formData.images.length + localImages.length);
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed for your plan`);
      return;
    }

    const filesToUpload = files.slice(0, remaining);

    for (const file of filesToUpload) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalImages(prev => [...prev, { url: e.target.result, file }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLocalImage = (index) => {
    setLocalImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadImagesAndCreateProduct = async (productData) => {
    const filesToUpload = localImages.filter(img => img.file);
    
    if (filesToUpload.length === 0) {
      return productData;
    }

    setUploading(true);
    try {
      const uploadedUrls = [];

      for (const img of filesToUpload) {
        const uploadFormData = new FormData();
        uploadFormData.append('images', img.file);
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/products/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('vendpadi_token')}`
          },
          body: uploadFormData
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Upload failed');
        }
        
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          uploadedUrls.push(data.images[data.images.length - 1]);
        }
      }

      setLocalImages([]);
      toast.success(`${uploadedUrls.length} image(s) uploaded!`);
      
      return {
        ...productData,
        images: [...(productData.images || []), ...uploadedUrls]
      };
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || Number(formData.price) < 0) {
      toast.error('Valid price is required');
      return;
    }
    if (formData.category === 'other' && !formData.customCategory?.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setSaving(true);
    try {
      let finalData = { ...formData };
      
      if (formData.category === 'other') {
        finalData.category = formData.customCategory.trim().toLowerCase().replace(/\s+/g, '-');
      }
      
      delete finalData.customCategory;

      if (isEditing) {
        if (localImages.length > 0) {
          finalData = await uploadImagesAndCreateProduct(finalData);
        }
        await productAPI.update(product._id, finalData);
        toast.success('Product updated!');
      } else {
        finalData = await uploadImagesAndCreateProduct(finalData);
        await productAPI.create(finalData);
        toast.success('Product created!');
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data?.message || error.message) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error('Failed to save product');
      }
    } finally {
      setSaving(false);
    }
  };

  const isLowStock = formData.stock > 0 && formData.stock <= formData.lowStockThreshold;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., Jollof Rice Special"
          required
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
          placeholder="Describe your product..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₦) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {formData.category === 'other' ? (
            <input
              type="text"
              name="customCategory"
              value={formData.customCategory || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter category name"
              required
            />
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Alert At
          </label>
          <input
            type="number"
            name="lowStockThreshold"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            className="input-field"
            placeholder="5"
            min="1"
          />
        </div>
      </div>

      {formData.stock > 0 && (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-400" />
            <span className="text-sm text-gray-600">Stock Status:</span>
          </div>
          <StockBadge 
            stock={Number(formData.stock)} 
            threshold={Number(formData.lowStockThreshold)} 
            size="sm"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Product Images (max {maxImages})
          </label>
          <span className="text-xs text-gray-400">
            {formData.images.length + localImages.length}/{maxImages}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {formData.images.map((img, index) => (
            <div key={`existing-${index}`} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden group">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
          {localImages.map((img, index) => (
            <div key={`local-${index}`} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">...</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeLocalImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
          {(formData.images.length + localImages.length) < maxImages && (
            <label className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-padi-green hover:bg-padi-green/5 transition-colors">
              <FiImage className="text-gray-400" size={20} />
              <span className="text-xs text-gray-400 mt-1 hidden sm:block">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleLocalImageUpload}
                className="hidden"
                disabled={saving}
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <input
          type="checkbox"
          name="inStock"
          id="inStock"
          checked={formData.inStock}
          onChange={handleChange}
          className="w-4 h-4 text-padi-green rounded"
        />
        <label htmlFor="inStock" className="text-sm text-gray-700">
          Available for order
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {uploading ? 'Uploading...' : (isEditing ? 'Updating...' : 'Creating...')}
            </>
          ) : (
            <>
              <FiCheck />
              {isEditing ? 'Update Product' : 'Add Product'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
