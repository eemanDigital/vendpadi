import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowLeft, FiExternalLink, FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStore, setSelectedStore] = useState('all');
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const allOrders = [];
    const storeSlugs = new Set();

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vendpadi_orders_')) {
          const slug = key.replace('vendpadi_orders_', '');
          storeSlugs.add(slug);
          const stored = JSON.parse(localStorage.getItem(key) || '[]');
          stored.forEach(order => {
            allOrders.push({ ...order, storeSlug: slug });
          });
        }
      }
    } catch {}

    allOrders.sort((a, b) => new Date(b.trackedAt) - new Date(a.trackedAt));
    setOrders(allOrders);
    setStores([...storeSlugs]);
  }, []);

  const filtered = selectedStore === 'all' 
    ? orders 
    : orders.filter(o => o.storeSlug === selectedStore);

  const handleClearStore = (slug) => {
    localStorage.removeItem(`vendpadi_orders_${slug}`);
    setOrders(prev => prev.filter(o => o.storeSlug !== slug));
    setStores(prev => prev.filter(s => s !== slug));
    if (selectedStore === slug) setSelectedStore('all');
  };

  const handleClearAll = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vendpadi_orders_')) {
          localStorage.removeItem(key);
        }
      }
    } catch {}
    setOrders([]);
    setStores([]);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center">
            <FiPackage size={24} className="text-navy" />
          </div>
          <div className="flex-1">
            <h1 className="font-sora font-bold text-xl text-navy">My Orders</h1>
            <p className="text-sm text-gray-500">Your recent orders ({orders.length})</p>
          </div>
        </div>

        {stores.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedStore('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStore === 'all'
                  ? 'bg-navy text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              All Stores
            </button>
            {stores.map(slug => (
              <button
                key={slug}
                onClick={() => setSelectedStore(slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${
                  selectedStore === slug
                    ? 'bg-navy text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {slug}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border p-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock size={24} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-4">Orders you place will appear here</p>
            <Link
              to="/"
              className="inline-block bg-padi-green text-white px-6 py-2.5 rounded-xl font-medium hover:bg-padi-green-dark transition-colors"
            >
              Browse Stores
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              {selectedStore === 'all' ? (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 size={12} />
                  Clear All
                </button>
              ) : (
                <button
                  onClick={() => handleClearStore(selectedStore)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <FiTrash2 size={12} />
                  Clear {selectedStore}
                </button>
              )}
            </div>

            {filtered.map((order, index) => (
              <motion.div
                key={`${order.orderId}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-navy text-lg">#{order.shortId}</span>
                    </div>
                    <p className="text-xs text-gray-400 capitalize">Store: {order.storeSlug}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FiCalendar size={12} />
                    {formatDate(order.trackedAt)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/track?orderId=${order.orderId}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-padi-green text-white py-3 rounded-xl font-semibold hover:bg-padi-green-dark transition-colors text-sm"
                  >
                    <FiExternalLink size={14} />
                    Track Order
                  </Link>
                  <button
                    onClick={() => {
                      const newOrders = orders.filter(o => o !== order);
                      setOrders(newOrders);
                      try {
                        const key = `vendpadi_orders_${order.storeSlug}`;
                        const existing = JSON.parse(localStorage.getItem(key) || '[]');
                        const filtered = existing.filter(o => o.orderId !== order.orderId);
                        localStorage.setItem(key, JSON.stringify(filtered));
                      } catch {}
                    }}
                    className="px-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
