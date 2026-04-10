import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';
import Logo from './Logo';
import { FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendor, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <nav className="bg-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="icon-light" size="sm" />
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && vendor ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm hover:text-padi-green transition-colors"
                >
                  <FiPackage />
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-sm hover:text-padi-green transition-colors"
                >
                  <FiSettings />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors"
                >
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm hover:text-padi-green transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
