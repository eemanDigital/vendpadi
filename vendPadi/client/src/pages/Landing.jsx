import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiShare2, FiMessageCircle, FiCheck, FiStar, FiMenu, FiX, FiLogOut, FiLayout } from 'react-icons/fi';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, vendor } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-padi-green rounded-lg flex items-center justify-center">
                <span className="font-sora font-bold text-lg">V</span>
              </div>
              <span className="font-sora font-bold text-xl">VendPadi</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:text-padi-green transition-colors font-medium flex items-center gap-2">
                    <FiLayout size={18} /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="hover:text-red-400 transition-colors font-medium flex items-center gap-2"
                  >
                    <FiLogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-padi-green transition-colors font-medium">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-2.5 px-5">Get Started Free</Link>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiLayout size={18} /> Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2 text-left text-red-400"
                    >
                      <FiLogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="mx-4 btn-primary text-center py-2.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-navy to-navy-light text-white py-16 sm:py-20 lg:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
            <FiMessageCircle className="text-padi-green" />
            <span className="text-sm">Built for Nigerian businesses 🇳🇬</span>
          </div>
          
          <h1 className="font-sora font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight">
            Your Products.<br />
            <span className="text-padi-green">One Link.</span><br />
            Orders on WhatsApp.
          </h1>
          
          <p className="text-base sm:text-lg text-gray-300 mb-10 max-w-2xl mx-auto px-4">
            Create your online store in minutes. Share your link on WhatsApp, Instagram, or anywhere. 
            Customers order with a single tap — no app downloads needed.
          </p>
          
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-padi-green hover:bg-padi-green-dark text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all shadow-lg shadow-padi-green/30 hover:shadow-padi-green/50"
          >
            <FiStar />
            Create Your Free Store
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">How It Works</h2>
          <p className="text-gray-500 text-center mb-10">Three simple steps to start selling</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '1', icon: FiCheck, title: 'Register Your Store', desc: 'Sign up in 30 seconds. Get a unique link like vendpadi.com/store/yourname' },
              { step: '2', icon: FiTrendingUp, title: 'Add Your Products', desc: 'Upload photos, set prices, add descriptions. Your catalog is ready instantly.' },
              { step: '3', icon: FiShare2, title: 'Share & Get Orders', desc: 'Share your link on WhatsApp. Customers tap to order — it opens WhatsApp with their order ready.' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-14 h-14 bg-padi-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-padi-green text-2xl" />
                </div>
                <span className="text-padi-green font-bold text-sm">Step {item.step}</span>
                <h3 className="font-sora font-semibold text-lg sm:text-xl mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">Simple Pricing</h2>
          <p className="text-gray-500 text-center mb-10">Start free, upgrade when you grow</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                plan: 'Free', 
                price: '₦0', 
                period: 'forever',
                features: ['5 products', '1 image per product', 'WhatsApp orders', 'Shareable store link'],
                cta: 'Get Started',
                highlight: false,
                badge: null
              },
              { 
                plan: 'Basic', 
                price: '₦1,500', 
                period: '/month',
                features: ['20 products', '3 images per product', 'Logo upload', 'WhatsApp orders', 'Custom store link'],
                cta: 'Upgrade to Basic',
                highlight: true,
                badge: null
              },
              { 
                plan: 'Premium', 
                price: '₦3,000', 
                period: '/month',
                features: ['Unlimited products', '3 images per product', 'Logo upload', 'WhatsApp orders', 'PDF Invoices & Receipts', 'Priority support'],
                cta: 'Go Premium',
                highlight: false,
                badge: '👑'
              }
            ].map((item, i) => (
              <div key={i} className={`relative p-6 sm:p-8 rounded-2xl transition-transform hover:scale-[1.02] ${item.highlight ? 'bg-navy text-white ring-4 ring-padi-green shadow-xl' : 'bg-white border border-gray-200 hover:border-padi-green/30'}`}>
                {item.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-sm font-bold">
                    {item.badge} Most Popular
                  </div>
                )}
                <h3 className="font-sora font-bold text-xl sm:text-2xl mt-2">{item.plan}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl sm:text-5xl font-bold">{item.price}</span>
                  <span className={`text-sm ${item.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{item.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <FiCheck className={`flex-shrink-0 ${item.highlight ? 'text-padi-green' : 'text-padi-green'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                    item.highlight 
                      ? 'bg-padi-green text-white hover:bg-padi-green-dark shadow-lg shadow-padi-green/30' 
                      : 'bg-navy text-white hover:bg-navy-light'
                  }`}
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-padi-green to-padi-green-dark text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl mb-4">Ready to Start Selling?</h2>
          <p className="text-white/90 mb-8 text-sm sm:text-base">Join thousands of Nigerian vendors already using VendPadi to grow their business.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-padi-green font-bold py-4 px-8 rounded-2xl text-lg hover:bg-gray-100 transition-all shadow-xl">
            Create Your Store Now — It's Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-padi-green rounded-lg flex items-center justify-center">
              <span className="font-sora font-bold text-lg text-white">V</span>
            </div>
            <span className="font-sora font-bold text-xl text-white">VendPadi</span>
          </Link>
          <p className="text-sm">© 2024 VendPadi. Made with ❤️ in Nigeria.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
