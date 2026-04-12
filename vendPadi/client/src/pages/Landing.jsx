import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiShare2, FiMessageCircle, FiCheck, FiStar, FiMenu, FiX, FiLogOut, FiLayout, FiPackage, FiGrid, FiHeart, FiMessageSquare, FiAlertTriangle, FiSearch, FiBarChart2, FiZap, FiClock } from 'react-icons/fi';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { clearCart } from '../store/cartSlice';
import Logo from '../components/Logo';

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

  const features = [
    { icon: FiBarChart2, title: 'Analytics Dashboard', desc: 'Track store views, orders & top products' },
    { icon: FiTrendingUp, title: 'Growth Insights', desc: 'See what\'s working and get more orders' },
    { icon: FiShare2, title: 'One-Click Sharing', desc: 'Share your store on WhatsApp, Instagram & anywhere' },
    { icon: FiPackage, title: 'Stock Management', desc: 'Track inventory, get low stock alerts, manage quantities easily' },
    { icon: FiGrid, title: 'Smart Filtering', desc: 'Search, sort & filter products by category, price, or stock' },
    { icon: FiHeart, title: 'Wishlist', desc: 'Customers can save favorite items for later purchase' },
    { icon: FiMessageSquare, title: 'Reviews & Ratings', desc: 'Build trust with customer reviews and star ratings' },
    { icon: FiAlertTriangle, title: 'Low Stock Alerts', desc: 'Get notified when products are running low' },
  ];

  const revenueFeatures = [
    { 
      icon: FiTrendingUp,
      title: 'See Your Growth',
      desc: 'Track views, clicks, and orders. Know what\'s working.',
      highlight: 'Your store analytics'
    },
    { 
      icon: FiShare2,
      title: 'Share Everywhere',
      desc: 'One link for WhatsApp, Instagram bio, or anywhere.',
      highlight: 'Instant sharing'
    },
    { 
      icon: FiMessageCircle,
      title: 'Orders on WhatsApp',
      desc: 'Customers order with one tap. No app downloads needed.',
      highlight: 'Zero friction'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-navy text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2">
              <Logo variant="icon-light" size="sm" />
            </Link>
            
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
                  <Link to="/register" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
                    <FiZap size={14} /> Free 7-Day Trial
                  </Link>
                </>
              )}
            </div>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-48 pb-4' : 'max-h-0'}`}>
            <div className="flex flex-col gap-1 pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiLayout size={20} /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-3 text-left text-red-400"
                  >
                    <FiLogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="mt-2 mx-1 btn-primary text-center py-3 flex items-center justify-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiZap size={14} /> Start Free 7-Day Trial
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-navy to-navy-light text-white py-16 sm:py-20 lg:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
            <FiTrendingUp className="text-padi-green" />
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
            <FiZap />
            Start 7-Day Premium Trial — Free
          </Link>
          <p className="mt-4 text-sm text-gray-400 flex items-center justify-center gap-2">
            <FiCheck className="text-padi-green" /> No credit card required
            <span className="mx-2">•</span>
            <FiCheck className="text-padi-green" /> All Premium features included
          </p>
        </div>
      </section>

      {/* Revenue Focus Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-padi-green/5 to-gold/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">Built to Help You <span className="text-padi-green">Make More Sales</span></h2>
          <p className="text-gray-500 text-center mb-10">Everything you need to get orders and grow your business</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {revenueFeatures.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-padi-green/20 hover:shadow-md hover:border-padi-green/40 transition-all">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-padi-green bg-padi-green/10 px-2 py-1 rounded-full">
                  {item.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">Powerful Features</h2>
          <p className="text-gray-500 text-center mb-10">Everything you need to manage and grow your business</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">How It Works</h2>
          <p className="text-gray-500 text-center mb-10">Three simple steps to start selling</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '1', icon: FiCheck, title: 'Sign Up (Free)', desc: 'Sign up in 30 seconds. Get a unique link like vendpadi.com/store/yourname. Start with 7 days FREE Premium access.' },
              { step: '2', icon: FiTrendingUp, title: 'Add Your Products', desc: 'Upload photos, set prices, add stock. Your catalog is ready instantly. All features unlocked during your trial.' },
              { step: '3', icon: FiShare2, title: 'Share & Get Orders', desc: 'Share your link on WhatsApp. Customers tap to order — it opens WhatsApp with their order ready.' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
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

      {/* Why Vendors Love Us */}
      <section className="py-16 sm:py-20 px-4 bg-navy text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">Why Vendors Choose VendPadi</h2>
          <p className="text-gray-400 text-center mb-10">More than just a store builder — it's a sales platform</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔥', stat: '1,000+', label: 'Trials Started' },
              { icon: '🛒', stat: '5,000+', label: 'Orders Received' },
              { icon: '🏪', stat: '2,000+', label: 'Active Stores' },
              { icon: '⭐', stat: '4.8/5', label: 'Customer Rating' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-sora font-bold text-3xl text-padi-green mb-1">{item.stat}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trial CTA */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
            <FiZap className="text-yellow-200" />
            <span className="text-sm font-medium">7-Day Free Trial</span>
          </div>
          <h2 className="font-sora font-bold text-2xl sm:text-4xl mb-4">Try Premium — Completely Free</h2>
          <p className="text-white/90 mb-6 text-base sm:text-lg max-w-2xl mx-auto">
            When you sign up, you get <strong>7 days of FREE Premium access</strong>. 
            No credit card needed. Experience all Premium features before deciding.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8">
            <div className="flex items-center gap-2">
              <FiClock className="text-yellow-200" />
              <span className="text-sm">7 days free</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-yellow-200" />
              <span className="text-sm">Unlimited products</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-yellow-200" />
              <span className="text-sm">All features unlocked</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="text-yellow-200" />
              <span className="text-sm">Custom store link</span>
            </div>
          </div>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-white text-amber-600 font-bold py-4 px-10 rounded-2xl text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            <FiZap /> Start Your Free Trial
          </Link>
          <p className="mt-4 text-sm text-white/80">After trial: choose any plan or continue with Free tier</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-center mb-3">Simple Pricing</h2>
          <p className="text-gray-500 text-center mb-8">Start free. Upgrade when you start getting orders.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { 
                plan: 'Free', 
                icon: '🆓',
                price: '₦0', 
                period: 'forever',
                tagline: 'Perfect to get started',
                features: [
                  '5 products',
                  '1 image per product',
                  'WhatsApp orders',
                  'Basic store link',
                  'Store QR code',
                  'Stock tracking',
                  'Low stock alerts',
                  'Product filtering & search',
                  'Wishlist for customers',
                  'Customer reviews',
                  'VendPadi branding'
                ],
                cta: 'Get Started',
                highlight: false,
                badge: null
              },
              { 
                plan: 'Starter', 
                icon: '💡',
                price: '₦1,000', 
                period: '/month',
                tagline: 'Look professional and get more orders',
                features: [
                  '30 products',
                  '3 images per product',
                  'Remove branding',
                  'Logo upload',
                  'Store analytics (views & orders)',
                  'Share store link',
                  'Stock tracking',
                  'Low stock alerts',
                  'Product filtering & search',
                  'Wishlist for customers',
                  'Customer reviews'
                ],
                cta: 'Upgrade',
                highlight: false,
                badge: null
              },
              { 
                plan: 'Business', 
                icon: '🚀',
                price: '₦2,500', 
                period: '/month',
                tagline: 'Grow faster and track what sells best',
                features: [
                  '100 products',
                  '5 images per product',
                  'Remove branding',
                  'Logo upload',
                  'PDF invoices & receipts',
                  'Full analytics (views, orders & conversion)',
                  'Top products tracking',
                  'Share store link',
                  'Product QR codes',
                  'Stock tracking',
                  'Low stock alerts',
                  'Advanced filtering & sorting',
                  'Wishlist for customers',
                  'Customer reviews'
                ],
                cta: 'Go Business',
                highlight: true,
                badge: 'Most Popular'
              },
              { 
                plan: 'Premium', 
                icon: '👑',
                price: '₦5,000', 
                period: '/month',
                tagline: 'Run your business like a brand',
                features: [
                  'Unlimited products',
                  '8 images per product',
                  'Remove branding',
                  'Logo + cover image',
                  'PDF invoices & receipts',
                  'Full analytics (views, orders & conversion)',
                  'Top products tracking',
                  'Share store link',
                  'Custom store link',
                  'Stock tracking',
                  'Low stock alerts',
                  'Advanced filtering & sorting',
                  'Wishlist for customers',
                  'Customer reviews',
                  'Priority support'
                ],
                cta: 'Start Free Trial',
                highlight: false,
                badge: 'Try Free for 7 Days'
              }
            ].map((item, i) => (
              <div key={i} className={`relative flex flex-col p-5 sm:p-6 rounded-2xl transition-all ${item.highlight ? 'bg-navy text-white ring-2 ring-padi-green shadow-xl scale-[1.02]' : 'bg-white border border-gray-200 hover:border-padi-green/30'}`}>
                {item.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-padi-green text-white px-4 py-1 rounded-full text-sm font-bold">
                    {item.badge}
                  </div>
                )}
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="font-sora font-bold text-xl sm:text-2xl">{item.plan}</h3>
                <div className="mt-4 mb-1">
                  <span className="text-4xl sm:text-5xl font-bold">{item.price}</span>
                  <span className={`text-sm ${item.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{item.period}</span>
                </div>
                <p className={`text-xs mb-4 ${item.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{item.tagline}</p>
                <ul className="space-y-2 mb-4 flex-1">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <FiCheck className={`flex-shrink-0 mt-0.5 text-padi-green`} size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all mt-auto ${
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
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
            <FiZap className="text-yellow-200" />
            <span className="text-sm font-medium">7-Day Premium Trial</span>
          </div>
          <h2 className="font-sora font-bold text-2xl sm:text-4xl mb-4">Ready to Get More Orders?</h2>
          <p className="text-white/90 mb-6 text-base sm:text-lg">
            Stop sending price lists manually.<br />
            Let customers browse your store and order instantly on WhatsApp.
          </p>
          <p className="text-white font-medium mb-4">
            Start with 7 days of FREE Premium access.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-padi-green font-bold py-4 px-10 rounded-2xl text-lg hover:bg-gray-100 transition-all shadow-xl mb-4">
            <FiZap /> Start Your Free Trial
          </Link>
          <p className="text-white/70 text-sm">No credit card needed • Set up in 2 minutes</p>
          <p className="mt-4 text-white/80 text-sm font-medium">
            Join Nigerian vendors already growing with VendPadi.
          </p>
        </div>
      </section>

      {/* One-Time Setup Option */}
      <section className="py-12 px-4 bg-gold/10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-sora font-bold text-xl mb-2">One-Time Setup Option</h3>
          <p className="text-gray-600 text-sm mb-4">
            Don't want to set it up yourself?<br />
            We'll create your store for you in 24 hours.
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-sm mb-4">
            <span className="text-2xl font-bold text-gold">₦5,000</span>
            <span className="text-gray-500 text-sm">one-time</span>
          </div>
          <p className="text-sm text-gray-500">Contact us to get started</p>
          <a 
            href="mailto:support@vendpadi.com?subject=Store Setup Service" 
            className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark font-medium transition-colors"
          >
            👉 Request Setup Service
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <Logo variant="icon-light" size="md" />
              </Link>
              <p className="text-sm text-gray-400">Build your online store in minutes. Share on WhatsApp. Track your growth. Sell more.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-sm hover:text-padi-green transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-sm hover:text-padi-green transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-sm hover:text-padi-green transition-colors">Cookie Policy</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@vendpadi.com" className="text-sm hover:text-padi-green transition-colors">Contact Us</a>
                </li>
                <li>
                  <Link to="/faq" className="text-sm hover:text-padi-green transition-colors">FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-sm">© {new Date().getFullYear()} VendPadi. Made with ❤️ in Nigeria 🇳🇬</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
