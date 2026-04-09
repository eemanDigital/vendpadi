import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { planAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { FiX, FiCheck, FiUpload, FiClock, FiAlertCircle, FiCreditCard, FiSmartphone, FiRefreshCw } from 'react-icons/fi';

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    icon: '🆓',
    price: 0,
    color: 'gray',
    features: [
      { text: '5 products', included: true },
      { text: '1 image per product', included: true },
      { text: 'WhatsApp orders', included: true },
      { text: 'Shareable store link', included: true },
      { text: 'Logo upload', included: false },
      { text: 'PDF invoices', included: false },
      { text: 'Priority support', included: false }
    ]
  },
  basic: {
    name: 'Basic',
    icon: '💡',
    price: 1500,
    color: 'blue',
    features: [
      { text: '20 products', included: true },
      { text: '3 images per product', included: true },
      { text: 'Logo upload', included: true },
      { text: 'WhatsApp orders', included: true },
      { text: 'Custom store link', included: true },
      { text: 'PDF invoices', included: false },
      { text: 'Priority support', included: false }
    ]
  },
  premium: {
    name: 'Premium',
    icon: '👑',
    price: 3000,
    color: 'gold',
    features: [
      { text: 'Unlimited products', included: true },
      { text: '3 images per product', included: true },
      { text: 'Logo upload', included: true },
      { text: 'WhatsApp orders', included: true },
      { text: 'Custom store link', included: true },
      { text: 'PDF invoices & receipts', included: true },
      { text: 'Priority support', included: true }
    ]
  }
};

const FALLBACK_PAYMENT = {
  bankName: 'First Bank of Nigeria',
  accountName: 'VendPadi Ltd',
  accountNumber: '3084721938'
};

const PlanUpgradeModal = ({ isOpen, onClose, onSuccess }) => {
  const { vendor } = useSelector((state) => state.auth);
  const [step, setStep] = useState('select');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(FALLBACK_PAYMENT);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  const currentPlan = vendor?.plan?.type || 'free';

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      fetchRequests();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const { data } = await planAPI.getPlans();
      setPaymentDetails(data.paymentDetails || FALLBACK_PAYMENT);
    } catch (error) {
      setPaymentDetails(FALLBACK_PAYMENT);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await planAPI.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests');
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan === currentPlan) return;
    if (plan === 'free') return;
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handleRequestUpgrade = async () => {
    setLoading(true);
    try {
      await planAPI.requestUpgrade(selectedPlan);
      toast.success('Upgrade request submitted! Proceed to payment.');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleProofUpload = async () => {
    if (!proofFile && !paymentRef.trim()) {
      toast.error('Please enter the transfer reference from your bank app');
      return;
    }

    setLoading(true);
    try {
      let requestId;
      
      const existingRequest = requests.find(r => r.requestedPlan === selectedPlan && r.status === 'pending');
      
      if (!existingRequest) {
        const { data } = await planAPI.requestUpgrade(selectedPlan);
        requestId = data._id;
      } else {
        requestId = existingRequest._id;
      }

      const formData = new FormData();
      if (proofFile) {
        formData.append('proof', proofFile);
      }
      if (paymentRef.trim()) {
        formData.append('paymentReference', paymentRef.trim());
      }

      await planAPI.uploadProof(requestId, formData);
      toast.success('Payment proof submitted! We will verify and activate your plan shortly.');
      setProofFile(null);
      setProofPreview('');
      setPaymentRef('');
      setStep('success');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!confirm('Cancel this upgrade request?')) return;
    
    try {
      await planAPI.cancelRequest(id);
      toast.success('Request cancelled');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max 5MB.');
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const pendingRequest = requests.find(r => r.requestedPlan === selectedPlan && r.status === 'pending');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-sora font-bold text-xl">
            {step === 'select' && 'Choose Your Plan'}
            {step === 'payment' && `Upgrade to ${PLAN_DETAILS[selectedPlan]?.name}`}
            {step === 'success' && 'Payment Submitted'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {step === 'select' && (
            <div className="space-y-4">
              {['basic', 'premium'].map((planKey) => {
                const plan = PLAN_DETAILS[planKey];
                const isCurrentPlan = currentPlan === planKey;
                const isDowngrade = ['basic', 'premium'].indexOf(currentPlan) > ['basic', 'premium'].indexOf(planKey);
                
                return (
                  <div
                    key={planKey}
                    className={`relative p-5 rounded-2xl border-2 transition-all ${
                      isCurrentPlan
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-100 hover:border-padi-green/30 hover:shadow-lg'
                    } ${isDowngrade ? 'opacity-50' : ''}`}
                  >
                    {isCurrentPlan && (
                      <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                        Current Plan
                      </span>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{plan.icon}</span>
                        <div>
                          <h3 className="font-sora font-bold text-lg">{plan.name}</h3>
                          <p className="text-2xl font-bold text-padi-green">
                            ₦{plan.price.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/month</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-5">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.included ? (
                            <FiCheck className="text-padi-green flex-shrink-0" />
                          ) : (
                            <FiX className="flex-shrink-0" />
                          )}
                          {feature.text}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(planKey)}
                      disabled={isCurrentPlan || isDowngrade}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        isCurrentPlan || isDowngrade
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-padi-green text-white hover:bg-padi-green-dark'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : isDowngrade ? 'Downgrade via Settings' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}

              {requests.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-sm text-gray-500 mb-3">Pending Requests</h4>
                  <div className="space-y-2">
                    {requests.filter(r => r.status === 'pending').map((req) => (
                      <div key={req._id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-3">
                          <FiClock className="text-amber-600" />
                          <div>
                            <p className="font-medium text-sm">Upgrade to {PLAN_DETAILS[req.requestedPlan]?.name}</p>
                            <p className="text-xs text-gray-500">₦{req.amount.toLocaleString()} - {req.paymentProof ? 'Proof uploaded' : 'Awaiting payment proof'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelRequest(req._id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && paymentDetails && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-padi-green/10 to-padi-green/5 border border-padi-green/20 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{PLAN_DETAILS[selectedPlan]?.icon}</span>
                  <div>
                    <p className="font-bold text-lg">{PLAN_DETAILS[selectedPlan]?.name} Plan</p>
                    <p className="text-padi-green font-bold text-xl">₦{PLAN_DETAILS[selectedPlan]?.price.toLocaleString()}/month</p>
                  </div>
                </div>
              </div>

              <div className="bg-navy text-white rounded-2xl p-5">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FiCreditCard /> Make Transfer To
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bank</span>
                    <span className="font-medium">{paymentDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Account Name</span>
                    <span className="font-medium">{paymentDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Account Number</span>
                    <span className="font-bold text-xl tracking-wider">{paymentDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span className="text-gray-300">Amount</span>
                    <span className="font-bold text-padi-green text-lg">₦{PLAN_DETAILS[selectedPlan]?.price.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  Transfer the exact amount. After payment, copy the reference from your bank app and paste it below.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FiCreditCard /> Confirm Your Payment
                </h4>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-xl border-2 border-padi-green/30">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Transfer Reference <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Copy the reference from your bank app after making the transfer
                    </p>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="e.g., TRF123456789"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Upload Screenshot <span className="text-gray-400 font-normal">(optional)</span>
                    </p>
                    <div className="relative">
                      {proofPreview ? (
                        <div className="relative">
                          <img src={proofPreview} alt="Receipt" className="w-full h-40 object-cover rounded-xl border-2 border-padi-green" />
                          <button
                            type="button"
                            onClick={() => { setProofFile(null); setProofPreview(''); }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <FiX size={16} />
                          </button>
                          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs text-white bg-padi-green px-2 py-1 rounded-lg">
                            <FiCheck size={12} /> Screenshot added
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="proof-input"
                          className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-padi-green hover:bg-padi-green/5 transition-colors bg-white">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <FiUpload className="text-gray-400" size={20} />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Tap to add screenshot</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</span>
                        </label>
                      )}
                      <input 
                        id="proof-input"
                        type="file" 
                        accept="image/*" 
                        onChange={handleProofChange} 
                        className="hidden" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">What happens next?</p>
                  <p className="text-amber-700 mt-1">
                    After you submit, our team will verify your payment within 24 hours and activate your {PLAN_DETAILS[selectedPlan]?.name} plan automatically.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-padi-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-padi-green text-4xl" />
              </div>
              <h3 className="font-sora font-bold text-xl mb-2">Payment Submitted!</h3>
              <p className="text-gray-500 mb-6">
                We have received your payment proof. Your plan will be activated within 24 hours after verification.
              </p>
              <p className="text-sm text-gray-400">
                You can close this window. We'll notify you once your plan is active.
              </p>
            </div>
          )}
        </div>

        <div className="p-5 border-t bg-gray-50">
          {step === 'select' && (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Maybe Later
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="flex gap-3">
              <button onClick={() => setStep('select')} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Back
              </button>
              <button
                onClick={handleProofUpload}
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiUpload /> Submit Payment Proof
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'success' && (
            <button onClick={onClose} className="w-full btn-primary py-3">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanUpgradeModal;
