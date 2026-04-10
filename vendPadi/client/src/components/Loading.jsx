export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-padi-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  </div>
);

export const ButtonLoader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  return (
    <div className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}></div>
  );
};

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'w-12 h-12 rounded-full',
    card: 'h-48 rounded-xl',
    button: 'h-10 w-24 rounded-lg',
  };
  
  return (
    <div className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}></div>
  );
};

export const Spinner = ({ size = 'md', color = 'padi-green' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  const colors = {
    'padi-green': 'border-padi-green border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };
  
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}></div>
  );
};
