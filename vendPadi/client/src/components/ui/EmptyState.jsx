const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
          <Icon size={36} className="text-gray-400" />
        </div>
      )}
      <h3 className="font-sora font-semibold text-lg text-navy mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-3 bg-padi-green text-white rounded-xl font-medium hover:bg-padi-green-dark transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
