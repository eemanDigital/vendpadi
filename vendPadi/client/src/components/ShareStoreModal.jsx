import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy, FiExternalLink, FiMessageCircle, FiInstagram } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareStoreModal = ({ isOpen, onClose, storeUrl, storeName }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out ${storeName}'s store on VendPadi! ${storeUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleInstagramBio = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success('Store link copied! Add it to your Instagram bio.');
  };

  const shareOptions = [
    {
      label: 'Copy Link',
      description: 'Copy your store link to share anywhere',
      icon: FiCopy,
      onClick: handleCopy,
      color: 'bg-blue-500'
    },
    {
      label: 'Share on WhatsApp',
      description: 'Share directly with your WhatsApp contacts',
      icon: FiMessageCircle,
      onClick: handleWhatsAppShare,
      color: 'bg-green-500'
    },
    {
      label: 'Instagram Bio',
      description: 'Copy link to add to your Instagram bio',
      icon: FiInstagram,
      onClick: handleInstagramBio,
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h2 className="font-sora font-bold text-lg text-navy">Share Your Store</h2>
                <p className="text-sm text-gray-500">Get more customers by sharing</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="bg-gray-50 rounded-xl p-3 mb-5">
                <p className="text-xs text-gray-500 mb-1">Your store link</p>
                <p className="text-sm font-mono text-navy break-all">{storeUrl}</p>
              </div>

              <div className="space-y-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={option.onClick}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  >
                    <div className={`${option.color} p-3 rounded-xl text-white`}>
                      <option.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-navy">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                    <FiExternalLink className="text-gray-400" size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-padi-green/5 border-t">
              <p className="text-sm text-center text-navy font-medium">
                Pro tip: Share your store link on WhatsApp status for maximum reach!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareStoreModal;
