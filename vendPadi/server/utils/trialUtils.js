const PLAN_LEVELS = {
  free: 0,
  starter: 1,
  business: 2,
  premium: 3
};

const hasAccess = (vendor, requiredPlan) => {
  if (!vendor) return false;
  
  const effectivePlan = vendor.getEffectivePlan 
    ? vendor.getEffectivePlan() 
    : vendor.plan?.type || 'free';
  
  if (PLAN_LEVELS[effectivePlan] >= PLAN_LEVELS[requiredPlan]) {
    return true;
  }
  
  return false;
};

const getEffectivePlan = (vendor) => {
  if (!vendor) return 'free';
  
  if (vendor.getEffectivePlan) {
    return vendor.getEffectivePlan();
  }
  
  if (vendor.trial?.active && vendor.trial?.plan) {
    if (vendor.trial.endDate && new Date() > vendor.trial.endDate) {
      return vendor.plan?.type || 'free';
    }
    return vendor.trial.plan;
  }
  
  return vendor.plan?.type || 'free';
};

const getTrialStatus = (vendor) => {
  if (!vendor) return null;
  
  if (vendor.trial?.active && vendor.trial?.endDate) {
    const now = new Date();
    const endDate = new Date(vendor.trial.endDate);
    
    if (now > endDate) {
      return { active: false, expired: true, daysRemaining: 0 };
    }
    
    const diff = endDate - now;
    const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.ceil(diff / (1000 * 60 * 60));
    
    return {
      active: true,
      expired: false,
      plan: vendor.trial.plan,
      startDate: vendor.trial.startDate,
      endDate: vendor.trial.endDate,
      daysRemaining,
      hoursRemaining,
      isExpiringSoon: daysRemaining <= 2
    };
  }
  
  return { 
    active: false, 
    expired: false, 
    used: vendor.trial?.used || false,
    daysRemaining: 0 
  };
};

const isOnTrial = (vendor) => {
  if (!vendor?.trial?.active) return false;
  
  const now = new Date();
  const endDate = vendor.trial.endDate;
  
  if (!endDate) return false;
  
  return now <= new Date(endDate);
};

const canUseTrial = (vendor) => {
  if (!vendor) return false;
  if (vendor.trial?.used) return false;
  if (vendor.plan?.type !== 'free') return false;
  return true;
};

module.exports = {
  PLAN_LEVELS,
  hasAccess,
  getEffectivePlan,
  getTrialStatus,
  isOnTrial,
  canUseTrial
};
