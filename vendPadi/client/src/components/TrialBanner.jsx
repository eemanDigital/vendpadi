import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { vendorAPI, planAPI } from '../api/axiosInstance';
import { updateVendor } from '../store/authSlice';
import toast from 'react-hot-toast';
import { FiX, FiZap, FiClock, FiAlertCircle } from 'react-icons/fi';

const TrialBanner = ({ onTrialStarted }) => {
  const { vendor } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Trial states
  const trialActive = vendor?.trial?.active === true;
  const trialUsed = vendor?.trial?.used === true;
  const trialEndDate = vendor?.trial?.endDate ? new Date(vendor.trial.endDate) : null;
  const currentPlan = vendor?.plan?.type || 'free';
  const isFreePlan = currentPlan === 'free';
  const canStartTrial = isFreePlan && !trialUsed && !trialActive;

  useEffect(() => {
    if (trialActive && trialEndDate) {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const diff = trialEndDate - now;

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
  }, [trialActive, trialEndDate]);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (vendor?._id) {
        try {
          const { data } = await vendorAPI.getTrialStatus();
          if (data.trial) {
            dispatch(updateVendor({ trial: data.trial }));
          }
        } catch (error) {
          console.error('Failed to fetch trial status:', error);
        }
      }
    };

    fetchTrialStatus();
  }, [vendor?._id, dispatch]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('trial_banner_dismissed', 'true');
  };

  const handleStartTrial = async () => {
    try {
      const { data } = await planAPI.startTrial();
      toast.success('7-Day Premium Trial activated! Enjoy all Premium features.');
      dispatch(updateVendor({ trial: data.trial }));
      onTrialStarted?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start trial');
    }
  };

  const isRecentlyDismissed = localStorage.getItem('trial_banner_dismissed') === 'true';

  // 1. Show active trial banner with countdown
  if (trialActive && daysRemaining > 0 && !dismissed && !isRecentlyDismissed) {
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
  }

  // 2. Show trial ended message for users whose trial has expired
  if (trialUsed && isFreePlan && !dismissed && !isRecentlyDismissed) {
    return (
      <div className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="lg:ml-64">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <FiClock className="text-gray-500" size={14} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm">
                  Your 7-day trial has ended
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 flex-wrap">
                  <span>You have been moved to the Free plan.</span>
                  <Link 
                    to="/settings" 
                    className="underline hover:text-padi-green font-medium whitespace-nowrap text-padi-green"
                  >
                    Upgrade anytime
                  </Link>
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <FiX className="text-gray-400" size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Show prompt to start trial for free users who haven't used trial
  if (canStartTrial && !dismissed && !isRecentlyDismissed) {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="lg:ml-64">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FiZap className="text-white" size={14} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                  <FiZap className="text-yellow-200 flex-shrink-0" />
                  <span>Start your 7-day Premium Trial — FREE!</span>
                </p>
                <p className="text-xs text-white/90 flex items-center gap-1 flex-wrap">
                  <span>No credit card required.</span>
                  <button 
                    onClick={handleDismiss}
                    className="text-white/70 hover:text-white text-xs underline whitespace-nowrap"
                  >
                    Dismiss
                  </button>
                </p>
              </div>
            </div>
            <button
              onClick={handleStartTrial}
              className="bg-white text-amber-600 px-3 sm:px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-white/90 transition-colors flex-shrink-0"
            >
              Start Trial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TrialBanner;
