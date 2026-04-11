import { useState } from 'react';
import { FiX, FiPlus, FiMinus, FiSave } from 'react-icons/fi';
import { productAPI } from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import StockBadge from '../ui/StockBadge';

const InventoryModal = ({ isOpen, onClose, products, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [saving, setSaving] = useState(null);

  if (!isOpen) return null;

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditValue(product.stock);
  };

  const handleSave = async (productId) => {
    setSaving(productId);
    try {
      await productAPI.update(productId, { 
        operation: 'adjust',
        stock: editValue 
      });
      toast.success('Stock updated!');
      setEditingId(null);
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    } finally {
      setSaving(null);
    }
  };

  const handleQuickAdjust = async (productId, operation, amount = 1) => {
    try {
      await productAPI.update(productId, { 
        operation, 
        amount,
        stock: operation === 'adjust' ? amount : undefined 
      });
      toast.success('Stock updated');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stock');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-sora font-bold text-lg">Inventory Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products with stock to manage
            </div>
          ) : (
            <div className="divide-y">
              {products.map((product) => (
                <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          📦
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-navy truncate">{product.name}</h4>
                          <p className="text-sm text-gray-500">₦{product.price.toLocaleString()}</p>
                        </div>
                        <StockBadge stock={product.stock} threshold={product.lowStockThreshold || 5} />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {editingId === product._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(Number(e.target.value))}
                              min="0"
                              className="w-20 px-3 py-2 border rounded-lg text-center"
                            />
                            <button
                              onClick={() => handleSave(product._id)}
                              disabled={saving === product._id}
                              className="p-2 bg-padi-green text-white rounded-lg hover:bg-padi-green-dark disabled:opacity-50"
                            >
                              <FiSave size={16} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuickAdjust(product._id, 'decrement', 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <FiMinus size={14} />
                              </button>
                              <button
                                onClick={() => handleEdit(product)}
                                className="w-16 text-center font-bold text-lg hover:bg-gray-100 py-1 rounded"
                              >
                                {product.stock}
                              </button>
                              <button
                                onClick={() => handleQuickAdjust(product._id, 'increment', 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-sm text-padi-green hover:underline"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
