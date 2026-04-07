import { useState, useEffect } from 'react';
import { productAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { FiImage, FiX, FiUpload, FiCheck } from 'react-icons/fi';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const isEditing = Boolean(product?._id);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    inStock: product?.inStock !== false,
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remaining = 3 - (formData.images.length + localImages.length);
    if (remaining <= 0) {
      toast.error('Maximum 3 images allowed');
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

  const handleImageUpload = async (productId) => {
    const filesToUpload = localImages.filter(img => img.file);
    
    if (filesToUpload.length === 0) return;

    setUploading(true);
    try {
      const newImages = [];

      for (const img of filesToUpload) {
        const uploadFormData = new FormData();
        uploadFormData.append('images', img.file);
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/products/${productId}/images`, {
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
          const existingCount = formData.images.length + newImages.length;
          newImages.push(data.images[existingCount] || data.images[data.images.length - 1]);
        }
      }

      toast.success('Images uploaded!');
      setLocalImages([]);
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
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

    setSaving(true);
    try {
      if (isEditing) {
        await productAPI.update(product._id, formData);
        
        if (localImages.length > 0) {
          await handleImageUpload(product._id);
        }
        
        toast.success('Product updated!');
      } else {
        const created = await productAPI.create(formData);
        
        if (localImages.length > 0) {
          await handleImageUpload(created.data._id);
        }
        
        toast.success('Product created!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const allImages = [...formData.images];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Rice"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images (max 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {formData.images.map((img, index) => (
            <div key={`existing-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
          {localImages.map((img, index) => (
            <div key={`local-${index}`} className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs">New</span>
              </div>
              <button
                type="button"
                onClick={() => removeLocalImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
          {(formData.images.length + localImages.length) < 3 && (
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-padi-green transition-colors">
              <FiImage className="text-gray-400" size={20} />
              <span className="text-xs text-gray-400 mt-1">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleLocalImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-padi-green mt-2">
            <div className="w-4 h-4 border-2 border-padi-green border-t-transparent rounded-full animate-spin"></div>
            Uploading images...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
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

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          disabled={saving || uploading}
        >
          {saving || uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
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
          className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          disabled={saving || uploading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
