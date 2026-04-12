import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { planAPI, adminAPI } from '../api/axiosInstance';
import { logout } from '../store/authSlice';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';
import { 
  FiCheck, 
  FiX, 
  FiClock,
  FiRefreshCw, 
  FiImage, 
  FiEye, 
  FiLogOut, 
  FiShield,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiMail,
  FiSend,
  FiStar,
  FiGift,
  FiAward
} from 'react-icons/fi';

const GREETING_TYPES = [
  { value: 'general', label: 'General Check-in', icon: FiMail, description: 'Friendly message to all vendors' },
  { value: 'newYear', label: 'New Year Greeting', icon: FiStar, description: '🎊 Happy New Year wishes' },
  { value: 'holiday', label: 'Holiday Greeting', icon: FiGift, description: '🎄 Season\'s greetings' },
  { value: 'milestone', label: 'Milestone Celebration', icon: FiAward, description: '🏆 Achievement message' },
];

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    byPlan: { free: 0, basic: 0, premium: 0 }, 
    pendingRequests: 0, 
    approvedThisMonth: 0 
  });
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedGreeting, setSelectedGreeting] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [subscriberFilter, setSubscriberFilter] = useState('all');
  const [subscriberView, setSubscriberView] = useState('grouped');
  const [groupedSubscribers, setGroupedSubscribers] = useState({ grouped: {}, counts: {}, revenue: {} });
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, statsRes, groupedRes] = await Promise.all([
        planAPI.getAdminRequests(),
        planAPI.getAdminStats(),
        planAPI.getSubscribers('all', 'grouped')
      ]);
      setRequests(requestsRes.data);
      setStats(statsRes.data);
      setGroupedSubscribers(groupedRes.data);
      
      if (subscriberView === 'table') {
        const subsRes = await planAPI.getSubscribers(subscriberFilter);
        setSubscribers(subsRes.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subscriberFilter, subscriberView]);

  useEffect(() => {
    if (subscriberView === 'table') {
      planAPI.getSubscribers(subscriberFilter).then(res => setSubscribers(res.data));
    }
  }, [subscriberFilter, subscriberView]);

  const handleApprove = async (id) => {
    if (!confirm('Approve this upgrade request?')) return;
    
    setActionLoading(id);
    try {
      await planAPI.approveRequest(id);
      toast.success('Request approved! Vendor plan upgraded.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setActionLoading(selectedRequest._id);
    try {
      await planAPI.rejectRequest(selectedRequest._id, rejectReason);
      toast.success('Request rejected');
      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendpadi_admin_token');
    dispatch(logout());
    navigate('/admin-login');
  };

  const handleSendGreeting = async () => {
    if (!selectedGreeting) return;

    setSendingEmail(true);
    try {
      const result = await adminAPI.sendGreeting(selectedGreeting.value);
      setEmailResult(result.data);
      toast.success(`Email sent to ${result.data.sent} vendors!`);
      setShowEmailModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send emails');
    } finally {
      setSendingEmail(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo variant="icon-light" size="md" />
              <div>
                <h1 className="font-sora font-bold text-lg">Admin</h1>
                <p className="text-xs text-gray-400">Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'stats' 
                ? 'bg-padi-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'requests' 
                ? 'bg-padi-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Requests
            {stats.pendingRequests > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.pendingRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'email' 
                ? 'bg-padi-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiMail size={16} />
            <span className="hidden sm:inline">Send Email</span>
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'subscribers' 
                ? 'bg-padi-green text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiUsers size={16} />
            <span className="hidden sm:inline">Subscribers</span>
            {(stats.byPlan.starter || 0) + (stats.byPlan.business || 0) + (stats.byPlan.premium || 0) > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {(stats.byPlan.starter || 0) + (stats.byPlan.business || 0) + (stats.byPlan.premium || 0)}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'stats' ? (
          /* Stats Tab */
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="text-blue-600 text-xl" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">Total Vendors</p>
              </div>
              
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🆓</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy">{stats.byPlan.free || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Free</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">💡</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy">{stats.byPlan.starter || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Starter</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy">{stats.byPlan.business || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Business</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👑</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy">{stats.byPlan.premium || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Premium</p>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-navy mb-4">Plan Distribution</h3>
              <div className="space-y-4">
                {[
                  { key: 'free', label: 'Free', color: 'bg-gray-400' },
                  { key: 'starter', label: 'Starter', color: 'bg-blue-500' },
                  { key: 'business', label: 'Business', color: 'bg-purple-500' },
                  { key: 'premium', label: 'Premium', color: 'bg-amber-500' }
                ].map(({ key, label, color }) => {
                  const count = stats.byPlan[key] || 0;
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{label}</span>
                        <span className="text-gray-500">{count} vendors ({percentage}%)</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${color} rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FiClock className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">{stats.pendingRequests}</p>
                    <p className="text-sm text-gray-500">Pending Requests</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FiCheck className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">{stats.approvedThisMonth}</p>
                    <p className="text-sm text-gray-500">Approved This Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'requests' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy">Upgrade Requests</h2>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-padi-green text-gray-600 hover:text-padi-green rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-padi-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-emerald-500 text-4xl" />
                </div>
                <h3 className="font-sora font-bold text-xl text-navy mb-2">All Caught Up!</h3>
                <p className="text-gray-500">No pending upgrade requests to review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {req.vendorId?.logo ? (
                              <img src={req.vendorId.logo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl">🏪</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy">{req.vendorId?.businessName}</h3>
                            <p className="text-sm text-gray-500">{req.vendorId?.email}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                            {req.requestedPlan.charAt(0).toUpperCase() + req.requestedPlan.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            req.billingCycle === 'yearly' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {req.billingCycle === 'yearly' ? '📅 Yearly' : '📆 Monthly'}
                          </span>
                          <span className="font-bold text-padi-green text-lg">
                            ₦{req.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <span>{formatDate(req.createdAt)}</span>
                          {req.paymentReference && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                              Ref: {req.paymentReference}
                            </span>
                          )}
                          {req.paymentProof && (
                            <button
                              onClick={() => window.open(req.paymentProof, '_blank')}
                              className="flex items-center gap-1 text-padi-green hover:underline"
                            >
                              <FiImage size={12} /> View receipt
                            </button>
                          )}
                          <button
                            onClick={() => window.open(`/store/${req.vendorId?.slug}`, '_blank')}
                            className="flex items-center gap-1 text-padi-green hover:underline"
                          >
                            <FiEye size={12} /> View store
                          </button>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 lg:min-w-[200px]">
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={actionLoading === req._id}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-padi-green hover:bg-padi-green-dark text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          {actionLoading === req._id ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <FiCheck size={18} />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => { setSelectedRequest(req); setShowRejectModal(true); }}
                          disabled={actionLoading === req._id}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                          <FiX size={18} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'email' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center">
                  <FiMail className="text-padi-green text-xl" />
                </div>
                <div>
                  <h2 className="font-sora font-bold text-lg text-navy">Send Email to Vendors</h2>
                  <p className="text-sm text-gray-500">Send greetings or notifications to your vendors</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GREETING_TYPES.map((greeting) => {
                  const Icon = greeting.icon;
                  return (
                    <button
                      key={greeting.value}
                      onClick={() => { setSelectedGreeting(greeting); setShowEmailModal(true); }}
                      className="p-5 border border-gray-200 rounded-xl hover:border-padi-green hover:bg-padi-green/5 text-left transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 group-hover:bg-padi-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="text-gray-500 group-hover:text-padi-green" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy mb-1">{greeting.label}</h3>
                          <p className="text-sm text-gray-500">{greeting.description}</p>
                        </div>
                        <FiSend className="text-gray-300 group-hover:text-padi-green flex-shrink-0" size={20} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {emailResult && (
              <div className="bg-padi-green/10 border border-padi-green/20 rounded-xl p-4">
                <p className="text-padi-green font-medium">
                  ✓ Sent {emailResult.sent} emails successfully ({emailResult.failed} failed)
                </p>
              </div>
            )}
          </div>
        ) : activeTab === 'subscribers' ? (
          <div className="space-y-6">
            {/* View Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="font-semibold text-navy">Subscribers by Plan</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSubscriberView('grouped')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      subscriberView === 'grouped' ? 'bg-white shadow text-navy' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setSubscriberView('table')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      subscriberView === 'table' ? 'bg-white shadow text-navy' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Table
                  </button>
                </div>
                {subscriberView === 'table' && (
                  <>
                    <select
                      value={subscriberFilter}
                      onChange={(e) => setSubscriberFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-padi-green"
                    >
                      <option value="all">All Plans</option>
                      <option value="starter">Starter</option>
                      <option value="business">Business</option>
                      <option value="premium">Premium</option>
                      <option value="free">Free</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-padi-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : subscriberView === 'grouped' ? (
              <>
                {/* Plan Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'free', icon: '🆓', label: 'Free', color: 'gray', bg: 'bg-gray-50', border: 'border-gray-200' },
                    { key: 'starter', icon: '💡', label: 'Starter', color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200' },
                    { key: 'business', icon: '🚀', label: 'Business', color: 'purple', bg: 'bg-purple-50', border: 'border-purple-200' },
                    { key: 'premium', icon: '👑', label: 'Premium', color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200' }
                  ].map((plan) => {
                    const count = groupedSubscribers.counts?.[plan.key] || 0;
                    const monthlyRevenue = groupedSubscribers.revenue?.[plan.key]?.monthly || 0;
                    const yearlyRevenue = groupedSubscribers.revenue?.[plan.key]?.yearly || 0;
                    const colorClasses = {
                      gray: 'text-gray-600',
                      blue: 'text-blue-600',
                      purple: 'text-purple-600',
                      amber: 'text-amber-600'
                    };
                    return (
                      <button
                        key={plan.key}
                        onClick={() => setSelectedGroup(selectedGroup === plan.key ? null : plan.key)}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${
                          selectedGroup === plan.key 
                            ? `${plan.border} ${plan.bg} shadow-md scale-[1.02]` 
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{plan.icon}</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${plan.bg} ${colorClasses[plan.color]}`}>
                            {count} {count === 1 ? 'vendor' : 'vendors'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-navy mb-1">{plan.label}</h3>
                        {plan.key !== 'free' ? (
                          <div className="space-y-1 mt-2">
                            <p className="text-xs text-gray-500">
                              <span className="text-padi-green font-medium">₦{monthlyRevenue.toLocaleString()}</span>/mo
                            </p>
                            <p className="text-xs text-gray-500">
                              <span className="text-green-600 font-medium">₦{yearlyRevenue.toLocaleString()}</span>/yr
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-2">₦0</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Revenue Summary */}
                <div className="bg-gradient-to-r from-padi-green to-emerald-600 rounded-2xl p-5 text-white">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-white/80 text-sm">Monthly Potential</p>
                      <p className="text-2xl lg:text-3xl font-bold mt-1">
                        ₦{(groupedSubscribers.totalMonthly || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Yearly Potential</p>
                      <p className="text-2xl lg:text-3xl font-bold mt-1">
                        ₦{(groupedSubscribers.totalYearly || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Monthly Subs</p>
                      <p className="text-2xl lg:text-3xl font-bold mt-1">
                        {groupedSubscribers.counts?.monthly || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Yearly Subs</p>
                      <p className="text-2xl lg:text-3xl font-bold mt-1">
                        {groupedSubscribers.counts?.yearly || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Group Details */}
                {selectedGroup && (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-navy capitalize">
                        {selectedGroup} Plan Subscribers
                        <span className="ml-2 text-sm text-gray-500">
                          ({(groupedSubscribers.grouped?.[selectedGroup]?.monthly?.length || 0) + (groupedSubscribers.grouped?.[selectedGroup]?.yearly?.length || 0)})
                        </span>
                      </h3>
                      <button
                        onClick={() => setSelectedGroup(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    {((groupedSubscribers.grouped?.[selectedGroup]?.monthly?.length || 0) + (groupedSubscribers.grouped?.[selectedGroup]?.yearly?.length || 0)) > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {['monthly', 'yearly'].map((cycle) => {
                          const subs = groupedSubscribers.grouped?.[selectedGroup]?.[cycle] || [];
                          if (subs.length === 0) return null;
                          return (
                            <div key={cycle}>
                              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                                <span className="text-xs font-medium text-gray-500 uppercase">
                                  {cycle} ({subs.length})
                                </span>
                              </div>
                              {subs.map((sub) => (
                                <div key={sub._id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                      {sub.logo ? (
                                        <img src={sub.logo} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-lg">🏪</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-navy">{sub.businessName}</p>
                                      <p className="text-sm text-gray-500">{sub.email}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">{sub.phone}</p>
                                    <p className="text-xs text-gray-400">
                                      Joined {new Date(sub.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No vendors on this plan yet
                      </div>
                    )}
                  </div>
                )}

                {/* All Vendors by Plan */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-navy">All Vendors by Plan</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {['free', 'starter', 'business', 'premium'].map((plan) => {
                      const monthlyVendors = groupedSubscribers.grouped?.[plan]?.monthly || [];
                      const yearlyVendors = groupedSubscribers.grouped?.[plan]?.yearly || [];
                      const totalVendors = monthlyVendors.length + yearlyVendors.length;
                      if (totalVendors === 0) return null;
                      return (
                        <div key={plan}>
                          <button
                            onClick={() => setSelectedGroup(selectedGroup === plan ? null : plan)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {plan === 'free' ? '🆓' : plan === 'starter' ? '💡' : plan === 'business' ? '🚀' : '👑'}
                              </span>
                              <span className="font-medium text-navy capitalize">{plan}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                {monthlyVendors.length} mo / {yearlyVendors.length} yr
                              </span>
                              <FiTrendingUp className={`text-gray-400 transition-transform ${selectedGroup === plan ? 'rotate-90' : ''}`} />
                            </div>
                          </button>
                          {selectedGroup === plan && (
                            <div className="bg-gray-50 p-4 space-y-3">
                              {monthlyVendors.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Monthly ({monthlyVendors.length})</p>
                                  {monthlyVendors.map((sub) => (
                                    <div key={`mo-${sub._id}`} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                          {sub.logo ? (
                                            <img src={sub.logo} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <span>🏪</span>
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-navy">{sub.businessName}</p>
                                          <p className="text-xs text-gray-500">{sub.email}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {yearlyVendors.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-green-600 uppercase mb-2">Yearly ({yearlyVendors.length})</p>
                                  {yearlyVendors.map((sub) => (
                                    <div key={`yr-${sub._id}`} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                          {sub.logo ? (
                                            <img src={sub.logo} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <span>🏪</span>
                                          )}
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-navy">{sub.businessName}</p>
                                          <p className="text-xs text-gray-500">{sub.email}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {subscribers.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUsers className="text-gray-400 text-4xl" />
                    </div>
                    <h3 className="font-sora font-bold text-xl text-navy mb-2">No Subscribers</h3>
                    <p className="text-gray-500">No subscribers found for this filter.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billing</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {subscribers.map((sub) => (
                        <tr key={sub._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-navy">{sub.businessName}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{sub.email}</td>
                          <td className="px-6 py-4 text-gray-600">{sub.phone}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sub.plan?.type === 'premium' ? 'bg-amber-100 text-amber-700' :
                              sub.plan?.type === 'business' ? 'bg-purple-100 text-purple-700' :
                              sub.plan?.type === 'starter' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {sub.plan?.type || 'free'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sub.plan?.billingCycle === 'yearly' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {sub.plan?.billingCycle === 'yearly' ? '📅 Yearly' : '📆 Monthly'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </main>

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiX className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="font-sora font-bold text-lg text-navy">Reject Request</h3>
                <p className="text-sm text-gray-500">{selectedRequest.vendorId?.businessName}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
                rows={3}
                placeholder="e.g., Payment amount doesn't match, Unable to verify transfer..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setSelectedRequest(null); setRejectReason(''); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === selectedRequest._id}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === selectedRequest._id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Reject Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      {showEmailModal && selectedGreeting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEmailModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-padi-green/10 rounded-full flex items-center justify-center">
                <FiMail className="text-padi-green text-xl" />
              </div>
              <div>
                <h3 className="font-sora font-bold text-lg text-navy">Send {selectedGreeting.label}</h3>
                <p className="text-sm text-gray-500">This will email all {stats.total} vendors</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 text-sm">
                ⚠️ This will send an email to all <strong>{stats.total} vendors</strong>. Make sure you want to proceed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowEmailModal(false); setSelectedGreeting(null); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendGreeting}
                disabled={sendingEmail}
                className="flex-1 py-3 bg-padi-green hover:bg-padi-green-dark text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sendingEmail ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
