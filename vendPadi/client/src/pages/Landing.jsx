import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { clearCart } from "../store/cartSlice";
import Logo from "../components/Logo";
import { PLAN_DETAILS } from "../data/planConstants";
import {
  FiTrendingUp,
  FiShare2,
  FiMessageCircle,
  FiCheck,
  FiMenu,
  FiX,
  FiLogOut,
  FiLayout,
  FiLink,
  FiBarChart2,
  FiArrowRight,
  FiStar,
  FiShield,
  FiGlobe,
  FiSmartphone,
  FiDollarSign,
  FiAward,
  FiPercent,
  FiTrendingDown,
  FiShoppingBag,
  FiShoppingCart,
  FiHome,
  FiSmile,
  FiGift,
  FiSun,
  FiCoffee,
  FiCopy,
  FiTruck,
  FiTarget,
  FiGrid,
  FiHeart,
  FiMessageSquare,
  FiAlertTriangle,
  FiZap,
  FiClock,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import {
  HeroSection,
  SetupServiceSection,
  ProblemSolutionSection,
  FeaturesSection,
  DemoStoreSection,
  TrustSection,
  PricingSection,
  FinalCTASection,
} from "../components/landing";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
    setMobileMenuOpen(false);
  };

  const faqs = [
    { q: "Do I need a credit card to start the free trial?", a: "No! You get 7 days of free Premium access with no credit card required." },
    { q: "Can I switch plans later?", a: "Absolutely. Upgrade or downgrade anytime from your dashboard." },
    { q: "How do WhatsApp orders work?", a: "Customers browse your store, tap 'Order', and it opens WhatsApp with their cart items pre-filled." },
    { q: "Can I use my own domain?", a: "Custom domains are available on the Premium plan." },
  ];

  const useCases = [
    { icon: FiShoppingBag, title: "Fashion & Clothing", desc: "Showcase your latest collections", example: "From ₦0/mo" },
    { icon: FiSmartphone, title: "Electronics & Gadgets", desc: "Perfect for phones and tech", example: "From ₦0/mo" },
    { icon: FiHeart, title: "Beauty & Cosmetics", desc: "Let customers browse shades", example: "From ₦0/mo" },
    { icon: FiCoffee, title: "Food & Catering", desc: "Share menus and take orders", example: "From ₦0/mo" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Logo variant="icon-light" size="sm" showText={true} />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-padi-green transition-colors font-medium flex items-center gap-2 text-sm">
                    <FiLayout size={18} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition-colors font-medium flex items-center gap-2 text-sm">
                    <FiLogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">Features</a>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">Pricing</a>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium text-sm">Login</Link>
                  <Link to="/register" className="bg-padi-green hover:bg-padi-green-dark text-white font-semibold py-2.5 px-5 rounded-full transition-all duration-300 text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-padi-green/30">
                    <FiZap size={14} /> Start for Free
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-white hover:bg-white/10 rounded-lg transition-colors md:hidden">
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"}`}>
            <div className="flex flex-col gap-1 pt-2 border-t border-white/10">
              <a href="#features" className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium text-sm text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium text-sm text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-3 text-white" onClick={() => setMobileMenuOpen(false)}>
                    <FiLayout size={20} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-3 text-left text-red-400">
                    <FiLogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium text-white" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="mt-2 mx-1 bg-padi-green text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white" onClick={() => setMobileMenuOpen(false)}>
                    <FiZap size={14} /> Start for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />
      <SetupServiceSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <DemoStoreSection />
      <TrustSection />

      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((item, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-padi-green/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-padi-green/10 to-padi-green/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-padi-green text-2xl" />
                </div>
                <h3 className="font-sora font-bold text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <div className="text-padi-green font-semibold text-sm">Starting {item.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            {[
              { step: "01", icon: FiZap, title: "Sign Up — It's Free", desc: "Create your account in 30 seconds. Get a unique store link.", color: "from-amber-400 to-orange-500" },
              { step: "02", icon: FiLink, title: "Add Your Products", desc: "Upload photos, set prices. Your store is live instantly.", color: "from-padi-green to-emerald-400" },
              { step: "03", icon: FiShare2, title: "Share & Get Orders", desc: "Share your link on WhatsApp. Customers order directly.", color: "from-blue-400 to-indigo-500" },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <item.icon className="text-white text-2xl" />
                  </div>
                  {i < 2 && <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent mx-auto mt-2"></div>}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 hover:border-padi-green/20 hover:shadow-lg transition-all">
                  <span className="text-xs font-bold text-gray-400 tracking-widest">STEP {item.step}</span>
                  <h3 className="font-sora font-bold text-xl text-navy mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Chioma Eze", role: "Fashion Vendor, Lagos", text: "VendPadi changed how I sell. Orders come in automatically!" },
              { name: "Emeka Okonkwo", role: "Electronics Store, Abuja", text: "Setup was incredibly easy. My store was ready in minutes." },
              { name: "Fatima Bello", role: "Cosmetic Business, Kano", text: "Finally, a solution that works for Nigerian businesses!" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-padi-green/20 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <FiStar key={j} className="text-yellow-400 fill-yellow-400" size={20} />)}
                </div>
                <div className="flex-1">
                  <svg className="w-10 h-10 text-padi-green/20 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">"{item.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-padi-green to-padi-green-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-navy pr-4">{faq.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openFaq === i ? "bg-padi-green text-white" : "bg-gray-100 text-gray-500"}`}>
                    {openFaq === i ? <FiX size={14} /> : <FiArrowRight size={14} />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-48" : "max-h-0"}`}>
                  <p className="px-6 pb-5 text-gray-500">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection />

      <footer className="bg-navy text-gray-400 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <Logo variant="icon-light" size="md" />
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                Build your online store in minutes. Share on WhatsApp. Track your growth.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-padi-green transition-colors">
                  <FiMessageCircle className="text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-padi-green transition-colors">
                  <FiGlobe className="text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm hover:text-padi-green transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm hover:text-padi-green transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-sm hover:text-padi-green transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy-policy" className="text-sm hover:text-padi-green transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-sm hover:text-padi-green transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="text-sm hover:text-padi-green transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm flex items-center gap-2">
              © {new Date().getFullYear()} VendPadi. Made with <FiHeart className="text-red-400" /> in Nigeria
            </p>
            <div className="flex items-center gap-2 text-sm">
              <FiShield className="text-padi-green" /><span>Secure & Reliable</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;