import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { planAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiClock, FiPackage, FiSettings, FiShoppingBag, FiUser, FiImage, FiEye } from 'react-icons/fi';

const AdminPanel = () => {
  const { vendor } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (vendor?.isAdmin) {
      fetchRequests();
    }
  }, [vendor]);

  const fetchRequests = async () => {
    try {
      const { data } = await planAPI.getAdminRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this upgrade request?')) return;
    
    try {
      await planAPI.approveRequest(id);
      toast.success('Request approved!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    try {
      await planAPI.rejectRequest(selectedRequest._id, rejectReason);
      toast.success('Request rejected');
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanIcon = (plan) => {
    if (plan === 'free') return '🆓';
    if (plan === 'basic') return '💡';
    return '👑';
  };

  if (!vendor?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="text-red-500 text-3xl" />
          </div>
          <h2 className="font-sora font-bold text-xl mb-2">Access Denied</h2>
          <p className="text-gray-500">You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-6">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-padi-green rounded-lg flex items-center justify-center">
              <span className="font-sora font-bold text-white">V</span>
            </div>
            <span className="font-sora font-bold text-navy">VendPadi Admin</span>
          </Link>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 w-64 h-screen bg-navy text-white p-6">
        <Link to="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-padi-green rounded-xl flex items-center justify-center">
            <span className="font-sora font-bold text-xl">V</span>
          </div>
          <span className="font-sora font-bold text-lg">VendPadi</span>
        </Link>

        <div className="mb-6 p-3 bg-white/10 rounded-xl">
          <p className="text-xs text-gray-400">Admin Panel</p>
          <p className="font-medium truncate">{vendor?.businessName}</p>
        </div>

        <nav className="space-y-1">
          <div className="px-4 py-2.5 bg-padi-green/20 text-padi-green rounded-lg">
            <span className="flex items-center gap-3">
              <FiUser /> Plan Requests
            </span>
          </div>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiPackage /> Products
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
            <FiSettings /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="max-w-5xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-sora font-bold text-2xl text-navy">Plan Upgrade Requests</h1>
              <p className="text-gray-500">{requests.length} pending request{requests.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={fetchRequests} className="btn-secondary flex items-center gap-2">
              <FiEye size={16} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-padi-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-gray-400 text-4xl" />
              </div>
              <h3 className="font-sora font-semibold text-xl mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No pending upgrade requests to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {req.vendorId?.logo ? (
                            <img src={req.vendorId.logo} alt="" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <span className="text-xl">🏪</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{req.vendorId?.businessName}</h3>
                          <p className="text-sm text-gray-500">{req.vendorId?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{getPlanIcon(req.currentPlan)} {req.currentPlan}</span>
                        <span className="text-gray-300">→</span>
                        <span className="text-padi-green font-medium">{getPlanIcon(req.requestedPlan)} {req.requestedPlan}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-bold text-navy">₦{req.amount.toLocaleString()}</span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        Requested {formatDate(req.createdAt)}
                      </p>

                      {req.paymentReference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref: {req.paymentReference}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {req.paymentProof && (
                        <button
                          onClick={() => window.open(req.paymentProof, '_blank')}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          title="View payment proof"
                        >
                          <FiImage className="text-gray-600" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => window.open(`/store/${req.vendorId?.slug}`, '_blank')}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        title="View store"
                      >
                        <FiEye className="text-gray-600" />
                      </button>

                      <button
                        onClick={() => handleApprove(req._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-padi-green text-white rounded-lg hover:bg-padi-green-dark transition-colors font-medium"
                      >
                        <FiCheck size={16} /> Approve
                      </button>

                      <button
                        onClick={() => { setSelectedRequest(req); setShowRejectModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors font-medium"
                      >
                        <FiX size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="font-sora font-bold text-xl mb-4">Reject Request</h3>
            
            <p className="text-gray-600 mb-4">
              Reject upgrade request from <strong>{selectedRequest.vendorId?.businessName}</strong>?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="e.g., Payment not verified, Invalid amount, etc."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setSelectedRequest(null); setRejectReason(''); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
