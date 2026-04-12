import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/axiosInstance';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';
import { FiTrash2, FiX, FiAlertTriangle, FiDownload, FiCheck } from 'react-icons/fi';

const DeleteAccountModal = ({ isOpen, onClose, vendor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState('confirm');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);

  if (!isOpen) return null;

  const handleExportData = async () => {
    setLoadingExport(true);
    try {
      const { data } = await authAPI.exportAccountData();
      setExportData(data);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoadingExport(false);
    }
  };

  const handleDownloadExport = () => {
    if (!exportData) return;
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendpadi-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error('Please enter your password to confirm');
      return;
    }

    setLoading(true);
    try {
      await authAPI.requestDeleteAccount(password, reason);
      toast.success('Account deletion requested. You have 30 days to restore it.');
      dispatch(logout());
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setPassword('');
    setReason('');
    setExportData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-sora font-bold text-lg flex items-center gap-2 text-red-600">
            <FiTrash2 /> Delete Account
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-red-800">This action cannot be undone</p>
                  <p className="text-sm text-red-600 mt-1">
                    All your products, store settings, and analytics will be permanently deleted.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-medium text-amber-800 mb-2">What you should know:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Your account will be disabled immediately</li>
                  <li>• You have 30 days to restore your account</li>
                  <li>• After 30 days, all data is permanently deleted</li>
                  <li>• Order records are kept for legal compliance</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you leaving? (optional)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a reason...</option>
                  <option value="not_using">Not using the service</option>
                  <option value="too_expensive">Too expensive</option>
                  <option value="missing_features">Missing features I need</option>
                  <option value="switched_competitor">Switched to a competitor</option>
                  <option value="temporary">Just taking a break</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                onClick={() => setStep('export')}
                disabled={loadingExport}
                className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {loadingExport ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FiDownload /> Download My Data First
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'export' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Download a copy of your data before deleting your account. This includes:
              </p>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Products</span>
                  <span className="font-medium">{exportData?.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-medium">{exportData?.totalOrders || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Account Info</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>

              {exportData ? (
                <button
                  onClick={handleDownloadExport}
                  className="w-full py-3 bg-padi-green text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-padi-green-dark transition-colors"
                >
                  <FiDownload /> Download JSON Export
                </button>
              ) : (
                <button
                  onClick={handleExportData}
                  disabled={loadingExport}
                  className="w-full py-3 bg-padi-green text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-padi-green-dark transition-colors disabled:opacity-50"
                >
                  {loadingExport ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Preparing export...
                    </>
                  ) : (
                    <>
                      <FiDownload /> Generate Export File
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setStep('final')}
                className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue with Deletion
              </button>
            </div>
          )}

          {step === 'final' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium mb-2">Final Confirmation Required</p>
                <p className="text-sm text-red-600">
                  To delete your account, please enter your password and confirm the action.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || !password}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 /> Delete Forever
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="w-full py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
