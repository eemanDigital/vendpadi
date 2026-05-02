import { Link } from 'react-router-dom';

const StoreBranding = ({ plan }) => {
  const linkClass = 'text-navy hover:text-padi-green font-medium transition-colors';

  if (plan && plan.type !== 'free') {
    return (
      <div className="py-3 px-4 text-center border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">
          Powered by{' '}
          <Link 
            to="/" 
            className="text-padi-green hover:text-padi-green-dark font-medium transition-colors"
          >
            VendPadi
          </Link>
          {' '}•{' '}
          <Link 
            to="/track" 
            className={linkClass}
          >
            Track Order →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="py-3 px-4 text-center border-t border-gray-100 bg-gray-50">
      <p className="text-xs text-gray-400">
        Powered by{' '}
        <Link 
          to="/" 
          className="text-padi-green hover:text-padi-green-dark font-medium transition-colors"
        >
          VendPadi
        </Link>
        {' '}•{' '}
        <Link 
          to="/register" 
          className="text-gold hover:text-gold/80 font-medium transition-colors"
        >
          Remove branding →
        </Link>
        {' '}•{' '}
        <Link 
          to="/track" 
          className={linkClass}
        >
          Track Order →
        </Link>
      </p>
    </div>
  );
};

export default StoreBranding;
