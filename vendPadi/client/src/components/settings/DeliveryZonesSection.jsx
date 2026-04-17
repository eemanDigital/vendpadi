import { useState } from 'react';
import { vendorAPI } from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { FiTruck, FiPlus, FiTrash, FiSave } from 'react-icons/fi';

const COMMON_ZONES = [
  'Lagos - Mainland',
  'Lagos - Island',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan'
];

const DeliveryZonesSection = ({ deliveryZones: initialZones, deliveryEnabled: initialEnabled, onUpdate }) => {
  const [deliveryEnabled, setDeliveryEnabled] = useState(initialEnabled || false);
  const [zones, setZones] = useState(initialZones || []);
  const [loading, setLoading] = useState(false);

  const handleAddZone = () => {
    setZones([...zones, { name: '', fee: '', estimatedDays: '1-2 days', isActive: true }]);
  };

  const handleRemoveZone = (index) => {
    setZones(zones.filter((_, i) => i !== index));
  };

  const handleZoneChange = (index, field, value) => {
    const updated = [...zones];
    updated[index] = { ...updated[index], [field]: value };
    setZones(updated);
  };

  const handleQuickAdd = (zoneName) => {
    if (!zones.find(z => z.name === zoneName)) {
      setZones([...zones, { name: zoneName, fee: '', estimatedDays: '1-2 days', isActive: true }]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const validZones = zones.filter(z => z.name.trim()).map(z => ({
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
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update delivery zones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
            {zones.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FiTruck className="text-3xl mx-auto mb-2" />
                <p className="text-sm">No delivery zones added yet</p>
              </div>
            ) : (
              zones.map((zone, index) => (
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
                  <button 
                    type="button" 
                    onClick={() => handleRemoveZone(index)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <button 
            type="button" 
            onClick={handleAddZone} 
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-padi-green hover:text-padi-green transition-colors flex items-center justify-center gap-2"
          >
            <FiPlus /> Add Delivery Zone
          </button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-blue-700 font-medium mb-2">Quick add common zones:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_ZONES.filter(z => !zones.find(dz => dz.name === z)).map(zone => (
                <button 
                  key={zone} 
                  type="button" 
                  onClick={() => handleQuickAdd(zone)} 
                  className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs text-blue-700 hover:bg-blue-100"
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
      <button 
        type="button" 
        onClick={handleSave} 
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {loading ? (
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
    </div>
  );
};

export default DeliveryZonesSection;
