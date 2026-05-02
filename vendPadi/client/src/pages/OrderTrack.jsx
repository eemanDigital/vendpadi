import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiSearch, FiArrowLeft, FiTruck } from 'react-icons/fi';
import { orderTrackingAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: {
    label: 'Processing',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: FiClock,
    message: 'Your order has been received and is being processed.'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: FiCheckCircle,
    message: 'Your order has been confirmed and is being prepared.'
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: FiPackage,
    message: 'Your order has been delivered successfully.'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: FiXCircle,
    message: 'Your order has been cancelled.'
  }
};

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
  { key: 'delivered', label: 'Delivered', icon: FiPackage }
];

const OrderTrack = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchParams.get('orderId')) {
      handleTrack();
    }
  }, []);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();

    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await orderTrackingAPI.track(orderId.trim(), phone.trim() || undefined);
      setOrder(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to track order. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStepIndex = (status) => {
    const stepKeys = ['pending', 'confirmed', 'delivered'];
    if (status === 'cancelled') return -1;
    return stepKeys.indexOf(status);
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

        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center">
              <FiTruck size={24} className="text-padi-green" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-xl text-navy">Track Your Order</h1>
              <p className="text-sm text-gray-500">Enter your order details to check status</p>
            </div>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter full order ID or last 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-padi-green focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Used to verify your order"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-padi-green focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Leave empty to track with Order ID only</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-padi-green text-white font-semibold py-3 rounded-xl hover:bg-padi-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <FiSearch size={18} />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {error && !order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
          >
            <FiXCircle size={40} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-semibold text-red-700 mb-1">Order Not Found</h3>
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-bold text-navy">#{order.shortId}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${STATUS_CONFIG[order.status].color}`}>
                  {STATUS_CONFIG[order.status].label}
                </span>
              </div>

              {order.status !== 'cancelled' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    {STEPS.map((step, index) => {
                      const currentStep = getCurrentStepIndex(order.status);
                      const isActive = index <= currentStep;
                      const isCurrent = index === currentStep;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center mb-2
                            ${isActive ? 'bg-padi-green text-white' : 'bg-gray-100 text-gray-400'}
                            ${isCurrent ? 'ring-4 ring-padi-green/20' : ''}
                          `}>
                            <Icon size={18} />
                          </div>
                          <span className={`text-xs font-medium ${isActive ? 'text-padi-green' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="relative mt-1">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-padi-green rounded-full transition-all duration-500"
                        style={{ width: `${((getCurrentStepIndex(order.status) + 1) / (STEPS.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <p className={`mt-4 text-sm ${order.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
                {STATUS_CONFIG[order.status].message}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-sora font-bold text-lg text-navy mb-4">Order Details</h3>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-navy">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-padi-green">{formatCurrency(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-navy">Total</span>
                <span className="font-bold text-xl text-padi-green">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-sora font-bold text-lg text-navy mb-4">Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-medium text-navy">{order.customerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-navy">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Store</span>
                  <span className="font-medium text-navy">{order.vendor?.businessName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-medium text-navy">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium text-navy">{formatDate(order.updatedAt)}</span>
                </div>
                {order.deliveryInfo?.zone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Zone</span>
                    <span className="font-medium text-navy">{order.deliveryInfo.zone}</span>
                  </div>
                )}
                {order.deliveryInfo?.estimatedDays && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Delivery</span>
                    <span className="font-medium text-navy">{order.deliveryInfo.estimatedDays}</span>
                  </div>
                )}
                {order.note && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-gray-500">Note</span>
                    <p className="font-medium text-navy mt-1">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            {order.status !== 'cancelled' && order.vendor?.phone && (
              <a
                href={`https://wa.me/${order.vendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi! I'm checking on my order #${order.shortId}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white font-semibold py-4 rounded-xl hover:bg-green-600 transition-colors text-center"
              >
                Contact Store on WhatsApp
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTrack;
