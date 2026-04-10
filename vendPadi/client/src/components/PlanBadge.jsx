const PLAN_CONFIG = {
  free: {
    label: 'Free',
    color: 'bg-gray-100 text-gray-600',
    badge: ''
  },
  starter: {
    label: 'Starter',
    color: 'bg-blue-100 text-blue-600',
    badge: '💡'
  },
  business: {
    label: 'Business',
    color: 'bg-green-100 text-green-600',
    badge: '🚀'
  },
  premium: {
    label: 'Premium',
    color: 'bg-gold/10 text-gold',
    badge: '👑'
  }
};

const PlanBadge = ({ plan, size = 'md' }) => {
  const config = PLAN_CONFIG[plan?.type || 'free'];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      {config.badge && <span>{config.badge}</span>}
      {config.label}
    </span>
  );
};

export default PlanBadge;
