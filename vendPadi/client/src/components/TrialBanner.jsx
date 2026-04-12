import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { vendorAPI } from '../api/axiosInstance';
import { updateVendor } from '../store/authSlice';
import { FiX, FiZap, FiClock, FiAlertCircle } from 'react-icons/fi';

const TrialBanner = () => {
  const { vendor } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (vendor?.trial?.active && vendor?.trial?.endDate) {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const endDate = new Date(vendor.trial.endDate);
        const diff = endDate - now;

        if (diff <= 0) {
          setDaysRemaining(0);
          return;
        }

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setDaysRemaining(days);
        setIsExpiringSoon(days <= 2);
      };

      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 60000);
      return () => clearInterval(interval);
    }
  }, [vendor?.trial]);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (vendor?._id && !vendor?.trial?.active) {
        try {
          const { data } = await vendorAPI.getTrialStatus();
          if (data.trial?.active) {
            dispatch(updateVendor({ trial: data.trial }));
          }
        } catch (error) {
          console.error('Failed to fetch trial status:', error);
        }
      }
    };

    fetchTrialStatus();
  }, [vendor?._id, vendor?.trial?.active, dispatch]);

  if (!vendor?.trial?.active || dismissed) {
    return null;
  }

  if (daysRemaining === 0) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('trial_banner_dismissed', 'true');
  };

  const isRecentlyDismissed = localStorage.getItem('trial_banner_dismissed') === 'true';
  if (isRecentlyDismissed && !isExpiringSoon) {
    return null;
  }

  const bannerStyle = isExpiringSoon
    ? 'bg-gradient-to-r from-red-500 to-orange-500'
    : 'bg-gradient-to-r from-amber-500 to-yellow-500';

  return (
    <div className={`${bannerStyle} text-white px-3 sm:px-4 py-2.5 sm:py-3`}>
      <div className="lg:ml-64">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {isExpiringSoon ? <FiAlertCircle className="text-white" size={14} /> : <FiZap className="text-white" size={14} />}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <FiZap className="text-yellow-200 flex-shrink-0" />
                <span className="truncate">Premium Trial Active</span>
                {isExpiringSoon && (
                  <span className="bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full text-xs flex-shrink-0">
                    Expiring Soon!
                  </span>
                )}
              </p>
              <p className="text-xs text-white/90 flex items-center gap-1 flex-wrap">
                <FiClock className="text-yellow-200 flex-shrink-0" />
                <span>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</span>
                <span className="hidden sm:inline">•</span>
                <Link 
                  to="/settings" 
                  className="underline hover:text-white font-medium whitespace-nowrap"
                >
                  Upgrade now
                </Link>
                {!isExpiringSoon && (
                  <button 
                    onClick={handleDismiss}
                    className="text-white/70 hover:text-white text-xs underline whitespace-nowrap"
                  >
                    Dismiss
                  </button>
                )}
              </p>
            </div>
          </div>
          
          {isExpiringSoon && (
            <Link
              to="/settings"
              className="bg-white text-amber-600 px-3 sm:px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors flex-shrink-0"
            >
              Upgrade
            </Link>
          )}

          {!isExpiringSoon && (
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            >
              <FiX className="text-white" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
