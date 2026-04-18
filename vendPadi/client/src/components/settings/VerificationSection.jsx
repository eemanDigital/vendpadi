import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { vendorAPI } from '../../api/axiosInstance';
import { updateVendor } from '../../store/authSlice';
import toast from 'react-hot-toast';
import { FiShield, FiFileText, FiCheckCircle, FiX, FiClock, FiCheck } from 'react-icons/fi';

const DOCUMENT_TYPES = [
  { value: 'cac', label: 'CAC Certificate', description: 'Corporate Affairs Commission registration' },
  { value: 'nin', label: 'National ID (NIN)', description: "Nigeria National Identification Number" },
  { value: 'passport', label: 'International Passport', description: 'Valid international passport' },
  { value: 'drivers_license', label: "Driver's License", description: 'Valid Nigerian drivers license' }
];

const VerificationSection = ({ verification, onUpdate }) => {
  const dispatch = useDispatch();
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(verification?.status || 'none');
  const [isVerified, setIsVerified] = useState(verification?.isVerified || false);

  useEffect(() => {
    setStatus(verification?.status || 'none');
    setIsVerified(verification?.isVerified || false);
  }, [verification]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Document must be less than 10MB');
        return;
      }
      setDocumentFile(file);
      setDocumentPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!documentType || !documentFile) {
      toast.error('Please select a document type and upload a document');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('document', documentFile);
      
      await vendorAPI.submitVerification(documentType, formData);
      toast.success('Verification documents submitted! We will review within 24-48 hours.');
      
      setStatus('pending');
      setDocumentType('');
      setDocumentFile(null);
      setDocumentPreview('');
      
      const { data: vendorData } = await vendorAPI.getMe();
      dispatch(updateVendor(vendorData));
      
      if (onUpdate) onUpdate(vendorData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = status !== 'pending' && !isVerified;

  return (
    <div className="space-y-4">
      {status === 'pending' ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <FiClock className="text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Verification Pending</p>
            <p className="text-sm text-amber-600">Your documents are being reviewed. This usually takes 24-48 hours.</p>
          </div>
        </div>
      ) : status === 'rejected' ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <FiX className="text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Verification Rejected</p>
              {verification?.rejectionReason && (
                <p className="text-sm text-red-600">Reason: {verification.rejectionReason}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-red-600">Please submit new verification documents.</p>
        </div>
      ) : isVerified ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <FiCheckCircle className="text-green-500 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">You're Verified!</p>
            <p className="text-sm text-green-600">Your store now displays a verified badge to build customer trust.</p>
          </div>
        </div>
      ) : canSubmit ? (
        <>
          <p className="text-sm text-gray-600">Submit your business document to get verified. This helps customers trust your business.</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <div className="grid grid-cols-2 gap-3">
              {DOCUMENT_TYPES.map(doc => (
                <label 
                  key={doc.value} 
                  className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${documentType === doc.value ? 'border-padi-green bg-padi-green/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input
                    type="radio"
                    name="documentType"
                    value={doc.value}
                    checked={documentType === doc.value}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-sm">{doc.label}</p>
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center ${documentPreview ? 'border-padi-green' : 'border-gray-300'}`}>
              {documentPreview ? (
                <div className="space-y-3">
                  <FiFileText className="text-padi-green text-4xl mx-auto" />
                  <p className="text-sm text-gray-600">{documentFile?.name}</p>
                  <button 
                    type="button" 
                    onClick={() => { setDocumentFile(null); setDocumentPreview(''); }} 
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <FiFileText className="text-gray-400 text-3xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload document</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP or PDF (max 10MB)</p>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading || !documentType || !documentFile}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <FiShield /> Submit for Verification
              </>
            )}
          </button>
        </>
      ) : null}
    </div>
  );
};

export default VerificationSection;