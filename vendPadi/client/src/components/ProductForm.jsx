import { useState } from 'react';
import { productAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { FiImage, FiX } from 'react-icons/fi';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    inStock: product?.inStock !== false,
    images: product?.images || []
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remaining = 3 - formData.images.length;
    if (remaining <= 0) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.slice(0, remaining).map(async (file) => {
        const formDataImg = new FormData();
        formDataImg.append('images', file);
        
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/products/${product?._id || 'temp'}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('vendpadi_token')}`
          },
          body: formDataImg
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Upload failed');
        }
        
        const data = await res.json();
        return data.images[data.images.length - 1];
      });

      const newImages = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 3)
      }));
      toast.success('Image(s) uploaded!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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

    try {
      if (product?._id) {
        await productAPI.update(product._id, formData);
        toast.success('Product updated!');
      } else {
        await productAPI.create(formData);
        toast.success('Product created!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

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
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
              >
                <FiX size={12} />
              </button>
            </div>
          ))}
          {formData.images.length < 3 && (
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-padi-green transition-colors">
              <FiImage className="text-gray-400" size={20} />
              <span className="text-xs text-gray-400 mt-1">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>
        {uploading && <p className="text-sm text-padi-green mt-1">Uploading...</p>}
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
          className="btn-primary flex-1"
          disabled={uploading}
        >
          {product?._id ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
