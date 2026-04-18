import { Link, useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiShare2,
  FiMessageCircle,
  FiCheck,
  FiMenu,
  FiX,
  FiLogOut,
  FiLayout,
  FiPackage,
  FiGrid,
  FiHeart,
  FiMessageSquare,
  FiAlertTriangle,
  FiBarChart2,
  FiZap,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiStar,
  FiShield,
  FiGlobe,
  FiSmartphone,
  FiUsers,
  FiDollarSign,
  FiAward,
  FiPercent,
  FiArrowUpRight,
  FiArrowDownRight,
  FiShoppingBag,
  FiShoppingCart,
  FiHome,
  FiSmile,
  FiTrendingDown,
  FiGift,
  FiSun,
  FiCoffee,
  FiCopy,
  FiLink,
  FiTruck,
  FiTarget,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { clearCart } from "../store/cartSlice";
import Logo from "../components/Logo";
import { PLAN_DETAILS } from "../data/planConstants";

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

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}>
      {children}
    </div>
  );
};

const FloatingShape = ({ className, delay = 0 }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
    style={{ animationDelay: `${delay}s`, animationDuration: "4s" }}
  />
);

const BentoCard = ({ children, className = "", span = "1x1" }) => {
  const spans = {
    "1x1": "",
    "2x1": "md:col-span-2",
    "1x2": "md:row-span-2",
    "2x2": "md:col-span-2 md:row-span-2",
  };

  return (
    <div
      className={`bg-white rounded-3xl p-8 border border-gray-100 hover:border-padi-green/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${spans[span]} ${className}`}>
      {children}
    </div>
  );
};

const SplitSection = ({
  image,
  title,
  subtitle,
  points,
  reverse = false,
  badge,
}) => {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}>
      <div className={reverse ? "lg:order-2" : ""}>
        {badge && (
          <span className="inline-block text-padi-green font-semibold text-sm mb-4 tracking-wider uppercase">
            {badge}
          </span>
        )}
        <h3 className="font-sora font-bold text-3xl lg:text-4xl text-navy mb-4">
          {title}
        </h3>
        <p className="text-gray-500 text-lg mb-8">{subtitle}</p>
        <ul className="space-y-4">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-padi-green/10 flex items-center justify-center flex-shrink-0 mt-1">
                <FiCheck className="text-padi-green" size={14} />
              </div>
              <span className="text-gray-600">{point}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-padi-green font-semibold mt-8 hover:gap-4 transition-all">
          Start for Free <FiArrowRight />
        </Link>
      </div>
      <div className={`relative ${reverse ? "lg:order-1" : ""}`}>
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl p-8 border border-gray-200">
          {image}
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-padi-green/10 rounded-2xl -z-10"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-gold/10 rounded-xl -z-10"></div>
      </div>
    </div>
  );
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
    {
      q: "Do I need a credit card to start the free trial?",
      a: "No! You get 7 days of free Premium access with no credit card required. Experience all features before deciding.",
    },
    {
      q: "Can I switch plans later?",
      a: "Absolutely. Upgrade or downgrade anytime from your dashboard. Changes take effect immediately.",
    },
    {
      q: "What happens after my free trial ends?",
      a: "You'll automatically move to the Free plan. Your data stays safe, and you can upgrade anytime to unlock more features.",
    },
    {
      q: "How do WhatsApp orders work?",
      a: "Customers browse your store, tap 'Order', and it opens WhatsApp with their cart items pre-filled. You receive the order directly.",
    },
    {
      q: "Can I use my own domain?",
      a: "Custom domains are available on the Premium plan. Free and paid plans use yourname.vendpadi.com by default.",
    },
  ];

  const useCases = [
    {
      icon: FiShoppingBag,
      title: "Fashion & Clothing",
      desc: "Showcase your latest collections with beautiful product galleries",
      example: "From ₦0/mo",
    },
    {
      icon: FiSmartphone,
      title: "Electronics & Gadgets",
      desc: "Perfect for phones, accessories, and tech products",
      example: "From ₦0/mo",
    },
    {
      icon: FiHeart,
      title: "Beauty & Cosmetics",
      desc: "Let customers browse shades and products with ease",
      example: "From ₦0/mo",
    },
    {
      icon: FiCoffee,
      title: "Food & Catering",
      desc: "Share menus and take orders for events",
      example: "From ₦0/mo",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Logo variant="icon-light" size="sm" showText={true} />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-padi-green transition-colors font-medium flex items-center gap-2 text-sm">
                    <FiLayout size={18} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 transition-colors font-medium flex items-center gap-2 text-sm">
                    <FiLogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                    Pricing
                  </a>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors font-medium text-sm">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-padi-green hover:bg-padi-green-dark text-white font-semibold py-2.5 px-5 rounded-full transition-all duration-300 text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-padi-green/30">
                    <FiZap size={14} /> Start for Free
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -mr-2 text-white hover:bg-white/10 rounded-lg transition-colors md:hidden">
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
            }`}>
            <div className="flex flex-col gap-1 pt-2 border-t border-white/10">
              <a
                href="#features"
                className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium text-sm text-white"
                onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a
                href="#pricing"
                className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium text-sm text-white"
                onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-3 text-white"
                    onClick={() => setMobileMenuOpen(false)}>
                    <FiLayout size={20} /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-3 text-left text-red-400">
                    <FiLogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium text-white"
                    onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="mt-2 mx-1 bg-padi-green text-center py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white"
                    onClick={() => setMobileMenuOpen(false)}>
                    <FiZap size={14} /> Start for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 overflow-hidden bg-gradient-to-b from-navy via-navy to-navy-light">
        <FloatingShape
          className="w-[500px] h-[500px] bg-padi-green -top-40 -left-40"
          delay={0}
        />
        <FloatingShape
          className="w-[400px] h-[400px] bg-padi-green top-1/2 -right-20"
          delay={1}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-2.5 rounded-full mb-8 border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-padi-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-padi-green"></span>
                </span>
                <span className="text-sm text-gray-300 font-medium">
                  Built for Nigerian businesses
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="font-sora font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] tracking-tight text-white">
                Your Products.{" "}
                <span className="bg-gradient-to-r from-padi-green to-emerald-400 bg-clip-text text-transparent">
                  One Link.
                </span>{" "}
                <br />
                Orders on WhatsApp.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
                Create your online store in minutes. Share your link on
                WhatsApp, Instagram, or anywhere. Customers order with a single
                tap.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-3 bg-padi-green hover:bg-padi-green-dark text-white font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300 shadow-xl shadow-padi-green/30 hover:shadow-padi-green/50 hover:-translate-y-1 w-full sm:w-auto">
                  <FiZap className="group-hover:rotate-12 transition-transform" />
                  Start for Free
                  <FiArrowRight className="opacity-0 -ml-8 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <FiZap className="text-amber-400" size={14} /> 7-Day Premium
                  Trial included
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <FiCheck className="text-padi-green" /> No credit card
                </span>
                <span className="flex items-center gap-2">
                  <FiCheck className="text-padi-green" /> All Premium features
                </span>
                <span className="flex items-center gap-2">
                  <FiCheck className="text-padi-green" /> Setup in 2 min
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Dashboard Preview */}
          <ScrollReveal delay={500}>
            <div className="mt-20 max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-navy/30 border border-white/10">
                <div className="bg-gradient-to-r from-navy to-navy-light p-1">
                  <div className="bg-white rounded-t-2xl overflow-hidden">
                    <div className="bg-gray-100 h-12 flex items-center px-4 gap-2 border-b border-gray-200">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="ml-4 text-xs text-gray-400">
                        vendpadi.com/store/fashionista
                      </span>
                    </div>
                    <div className="p-6 lg:p-10">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          {
                            label: "Orders",
                            value: "1,247",
                            trend: "+12%",
                            up: true,
                          },
                          {
                            label: "Views",
                            value: "8,392",
                            trend: "+24%",
                            up: true,
                          },
                          {
                            label: "Revenue",
                            value: "₦456K",
                            trend: "+18%",
                            up: true,
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">
                              {stat.label}
                            </p>
                            <p className="text-xl font-bold text-navy">
                              {stat.value}
                            </p>
                            <div className="flex items-center gap-1">
                              {stat.up ? (
                                <FiArrowUpRight
                                  className="text-padi-green"
                                  size={12}
                                />
                              ) : (
                                <FiArrowDownRight
                                  className="text-red-400"
                                  size={12}
                                />
                              )}
                              <span className="text-xs text-padi-green font-medium">
                                {stat.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-20 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Problem/Solution - Split Section */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-red-500 font-semibold text-sm mb-3 tracking-wider uppercase">
                The Problem
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Stop sending price lists manually
              </h2>
              <p className="text-gray-500 text-lg text-balance">
                You're tired of sending individual prices to customers, updating
                WhatsApp statuses, and losing track of orders in chat threads.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: FiSmile,
                title: "Scattered Orders",
                desc: "Orders come through WhatsApp, Instagram DMs, phone calls... chaos.",
              },
              {
                icon: FiClock,
                title: "Wasted Time",
                desc: "Hours spent sending individual prices and updating product lists.",
              },
              {
                icon: FiTrendingDown,
                title: "Lost Sales",
                desc: "Customers forget what you offer or move to a competitor.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-red-500 text-2xl" />
                  </div>
                  <h3 className="font-sora font-bold text-lg text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                The Solution
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                One store. One link.{" "}
                <span className="text-padi-green">All orders on WhatsApp.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FiGlobe,
                title: "Beautiful Store",
                desc: "Professional online store in minutes",
              },
              {
                icon: FiShare2,
                title: "Easy Sharing",
                desc: "Share anywhere: WhatsApp, Instagram, SMS",
              },
              {
                icon: FiMessageCircle,
                title: "Instant Orders",
                desc: "Customers order directly on WhatsApp",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-gradient-to-br from-padi-green/5 to-padi-green/10 border border-padi-green/20 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-padi-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="font-sora font-bold text-lg text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section
        id="features"
        className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                Powerful Features
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Everything you need to{" "}
                <span className="text-padi-green">sell online</span>
              </h2>
              <p className="text-gray-500 text-lg">
                From product management to analytics — all in one place
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
            {/* Large featured card - Analytics */}
            <ScrollReveal className="md:col-span-2 md:row-span-2">
              <BentoCard span="2x2" className="h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-padi-green to-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-padi-green/20">
                  <FiTrendingUp className="text-white text-3xl" />
                </div>
                <h3 className="font-sora font-bold text-2xl text-navy mb-3">
                  Real-time Analytics
                </h3>
                <p className="text-gray-500 mb-6 flex-1">
                  Track views, orders, and revenue in real-time. Know exactly
                  what's selling and what's not. Make data-driven decisions to
                  grow your business.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-padi-green">
                      2.5K
                    </div>
                    <div className="text-xs text-gray-500">Views this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-padi-green">
                      156
                    </div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-padi-green">
                      ₦89K
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              </BentoCard>
            </ScrollReveal>

            {/* Verified Badge - Business+ */}
            <ScrollReveal delay={50}>
              <BentoCard className="h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  Business+
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FiShield className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Verified Badge
                </h3>
                <p className="text-gray-500 text-sm">
                  Build trust with a verified vendor badge
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Flash Sales - Premium */}
            <ScrollReveal delay={100}>
              <BentoCard className="h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  Premium
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <FiZap className="text-red-600 text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Flash Sales
                </h3>
                <p className="text-gray-500 text-sm">
                  Create FOMO with 24hr deals & countdowns
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Delivery Zones - Business+ */}
            <ScrollReveal delay={150}>
              <BentoCard className="h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  Business+
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <FiTruck className="text-orange-600 text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Delivery Zones
                </h3>
                <p className="text-gray-500 text-sm">
                  Set delivery fees by area in Nigeria
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Product Bundles - Premium */}
            <ScrollReveal delay={200}>
              <BentoCard className="h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  Premium
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <FiGift className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Product Bundles
                </h3>
                <p className="text-gray-500 text-sm">
                  Bundle items to boost average order value
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* One-Click Share */}
            <ScrollReveal delay={250}>
              <BentoCard className="h-full">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <FiShare2 className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  One-Click Share
                </h3>
                <p className="text-gray-500 text-sm">
                  Share on WhatsApp, Instagram, or anywhere
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Stock Alerts */}
            <ScrollReveal delay={300}>
              <BentoCard className="h-full">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <FiAlertTriangle className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Stock Alerts
                </h3>
                <p className="text-gray-500 text-sm">
                  Get notified when products are running low
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Smart Filters */}
            <ScrollReveal delay={350}>
              <BentoCard className="h-full">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <FiGrid className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Smart Filters
                </h3>
                <p className="text-gray-500 text-sm">
                  Search, sort by price, category, or availability
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Wishlist */}
            <ScrollReveal delay={400}>
              <BentoCard className="h-full">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <FiHeart className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Wishlist
                </h3>
                <p className="text-gray-500 text-sm">
                  Customers save items for later purchase
                </p>
              </BentoCard>
            </ScrollReveal>

            {/* Reviews */}
            <ScrollReveal delay={450}>
              <BentoCard className="h-full">
                <div className="w-12 h-12 bg-padi-green/10 rounded-xl flex items-center justify-center mb-4">
                  <FiMessageSquare className="text-padi-green text-xl" />
                </div>
                <h3 className="font-sora font-semibold text-lg text-navy mb-2">
                  Reviews & Ratings
                </h3>
                <p className="text-gray-500 text-sm">
                  Build trust with customer feedback
                </p>
              </BentoCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Use Cases - Horizontal Scroll on Mobile */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                Use Cases
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Works for any{" "}
                <span className="text-padi-green">business type</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-padi-green/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="w-14 h-14 bg-gradient-to-br from-padi-green/10 to-padi-green/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="text-padi-green text-2xl" />
                  </div>
                  <h3 className="font-sora font-bold text-lg text-navy mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                  <div className="text-padi-green font-semibold text-sm">
                    Starting {item.example}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Stepped Timeline */}
      <section
        id="how-it-works"
        className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                Simple Process
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Get started in{" "}
                <span className="text-padi-green">3 easy steps</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                icon: FiZap,
                title: "Sign Up — It's Free",
                desc: "Create your account in 30 seconds. Get a unique store link like vendpadi.com/store/yourname. Start immediately with 7 days of FREE Premium access.",
                color: "from-amber-400 to-orange-500",
              },
              {
                step: "02",
                icon: FiPackage,
                title: "Add Your Products",
                desc: "Upload photos, set prices, add stock quantities. Your store is live instantly — no technical skills needed. All features unlocked during your trial.",
                color: "from-padi-green to-emerald-400",
              },
              {
                step: "03",
                icon: FiShare2,
                title: "Share & Get Orders",
                desc: "Share your link on WhatsApp. Customers browse, tap 'Order', and it opens WhatsApp with their order ready. You receive it instantly.",
                color: "from-blue-400 to-indigo-500",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="text-white text-2xl" />
                    </div>
                    {i < 2 && (
                      <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent mx-auto mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 hover:border-padi-green/20 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-gray-400 tracking-widest">
                        STEP {item.step}
                      </span>
                    </div>
                    <h3 className="font-sora font-bold text-xl text-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Horizontal Cards */}
      <section className="py-20 lg:py-28 px-4 bg-navy text-white relative overflow-hidden">
        <FloatingShape
          className="w-96 h-96 bg-padi-green top-0 left-0"
          delay={0}
        />
        <div className="max-w-7xl mx-auto relative">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
                Trusted by <span className="text-padi-green">thousands</span> of
                vendors
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiZap,
                stat: "1000",
                suffix: "+",
                label: "Trials Started",
                color: "from-amber-400 to-orange-500",
              },
              {
                icon: FiShoppingCart,
                stat: "5000",
                suffix: "+",
                label: "Orders Received",
                color: "from-padi-green to-emerald-400",
              },
              {
                icon: FiHome,
                stat: "2000",
                suffix: "+",
                label: "Active Stores",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: FiStar,
                stat: "4.8",
                suffix: "/5",
                label: "Customer Rating",
                color: "from-pink-400 to-rose-500",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br p-1"
                    style={{
                      background: `linear-gradient(135deg, ${item.color.includes("amber") ? "#fbbf24, #ea580c" : item.color.includes("padi-green") ? "#25C866, #34d399" : item.color.includes("blue") ? "#60a5fa, #6366f1" : "#f472b6, #f43f5e"})`,
                    }}>
                    <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                      <item.icon className="text-white text-3xl" />
                    </div>
                  </div>
                  <div className="font-sora font-bold text-4xl lg:text-5xl text-padi-green mb-2">
                    <AnimatedCounter
                      end={parseFloat(item.stat)}
                      suffix={item.suffix}
                    />
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {item.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Large Quote Style */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                Testimonials
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Loved by{" "}
                <span className="text-padi-green">Nigerian vendors</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Chioma Eze",
                role: "Fashion Vendor, Lagos",
                text: "VendPadi changed how I sell. I share my store link on WhatsApp and orders come in automatically. My sales increased by 40% in just one month!",
              },
              {
                name: "Emeka Okonkwo",
                role: "Electronics Store Owner, Abuja",
                text: "The setup was incredibly easy. I had my store ready in minutes. Now my customers can browse products anytime without texting me.",
              },
              {
                name: "Fatima Bello",
                role: "Cosmetic Business, Kano",
                text: "Finally, a solution that works for Nigerian businesses. The WhatsApp ordering feature is exactly what I needed. Highly recommended!",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-padi-green/20 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <FiStar
                        key={j}
                        className="text-yellow-400 fill-yellow-400"
                        size={20}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <svg
                      className="w-10 h-10 text-padi-green/20 mb-4"
                      fill="currentColor"
                      viewBox="0 0 32 32">
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                    </svg>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      "{item.text}"
                    </p>
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                Simple Pricing
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Choose your <span className="text-padi-green">plan</span>
              </h2>
              <p className="text-gray-500 text-lg">
                Start free. Upgrade when you start getting orders.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white rounded-full p-1.5 shadow-lg border border-gray-100">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    billingCycle === "monthly"
                      ? "bg-padi-green text-white shadow-lg shadow-padi-green/30"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    billingCycle === "yearly"
                      ? "bg-padi-green text-white shadow-lg shadow-padi-green/30"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  <FiCalendar size={16} />
                  Yearly
                  {billingCycle === "yearly" && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      Save ~17%
                    </span>
                  )}
                </button>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Object.entries(PLAN_DETAILS).map(([planKey, plan]) => {
              const displayPrice =
                billingCycle === "yearly" ? plan.yearlyPrice : plan.price;
              const period =
                plan.price === 0
                  ? billingCycle === "yearly"
                    ? "/year"
                    : "forever"
                  : billingCycle === "yearly"
                    ? "/year"
                    : "/month";
              const isBusiness = planKey === "business";
              const isPremium = planKey === "premium";
              const cardTextColor = isBusiness ? "text-white" : "text-navy";
              const cardSubtextColor = isBusiness
                ? "text-gray-300"
                : "text-gray-500";
              const cardSecondaryTextColor = isBusiness
                ? "text-gray-200"
                : "text-gray-600";
              const badgeBgColor =
                isBusiness || isPremium ? "bg-white/20" : "bg-padi-green/10";
              const checkmarkColor = "text-padi-green";
              const iconColor = isBusiness
                ? "text-white"
                : isPremium
                  ? "text-amber-600"
                  : "text-padi-green";

              return (
                <ScrollReveal
                  key={planKey}
                  delay={Object.keys(PLAN_DETAILS).indexOf(planKey) * 75}>
                  <div
                    className={`relative flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-2 ${
                      isBusiness
                        ? "bg-gradient-to-br from-navy to-navy-light text-white ring-2 ring-padi-green shadow-2xl shadow-padi-green/20 scale-[1.02]"
                        : planKey === "premium"
                          ? "bg-white border-2 border-gray-200 hover:border-padi-green/30 hover:shadow-xl"
                          : "bg-white border border-gray-200 hover:border-padi-green/30 hover:shadow-xl"
                    }`}>
                    {plan.popular && !isBusiness && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg z-10 bg-gradient-to-r from-padi-green to-padi-green-dark text-white">
                        Most Popular
                      </div>
                    )}
                    {planKey === "premium" && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        {billingCycle === "yearly"
                          ? "Save 17%"
                          : "Try Free 7 Days"}
                      </div>
                    )}
                    {billingCycle === "yearly" &&
                      plan.price > 0 &&
                      planKey !== "premium" && (
                        <div className="absolute -top-4 right-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          Save 17%
                        </div>
                      )}
                    <div className="p-8 flex-1 flex flex-col">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                          isBusiness
                            ? "bg-white/20"
                            : isPremium
                              ? "bg-amber-100"
                              : "bg-gradient-to-br from-padi-green/10 to-padi-green/5"
                        }`}>
                        <span className={`text-3xl ${iconColor}`}>
                          {plan.icon}
                        </span>
                      </div>
                      <h3
                        className={`font-sora font-bold text-2xl mb-1 ${cardTextColor}`}>
                        {plan.name}
                      </h3>

                      {/* Trial Note for Premium */}
                      {planKey === "premium" && (
                        <div className="mt-2 mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600">
                          <FiZap size={12} />7 DAYS FREE
                        </div>
                      )}

                      <div className="mt-4 mb-1">
                        <span className={`text-5xl font-bold ${cardTextColor}`}>
                          {displayPrice === 0
                            ? "₦0"
                            : `₦${displayPrice.toLocaleString()}`}
                        </span>
                        <span className={`text-sm ml-1 ${cardSubtextColor}`}>
                          {period}
                        </span>
                      </div>

                      {/* Yearly Savings */}
                      {billingCycle === "yearly" && plan.price > 0 && (
                        <p
                          className={`text-sm font-semibold mb-2 ${isBusiness ? "text-green-400" : "text-green-600"}`}>
                          Save ₦
                          {(
                            plan.price * 12 -
                            plan.yearlyPrice
                          ).toLocaleString()}
                          /year
                        </p>
                      )}

                      <p className={`text-sm mb-6 ${cardSubtextColor}`}>
                        {plan.tagline}
                      </p>
                      <ul className="space-y-3 mb-8 flex-1">
                        {plan.features
                          .filter((f) => f.included)
                          .map((f, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-3 text-sm">
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isBusiness ? "bg-white/20" : "bg-padi-green/10"}`}>
                                <FiCheck
                                  className={
                                    isBusiness
                                      ? "text-padi-green"
                                      : "text-padi-green"
                                  }
                                  size={12}
                                />
                              </div>
                              <span className={cardSecondaryTextColor}>
                                {f.text}
                              </span>
                            </li>
                          ))}
                      </ul>
                      <Link
                        to="/register"
                        className={`block text-center py-4 px-6 rounded-2xl font-bold transition-all mt-auto ${
                          planKey === "premium"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
                            : isBusiness
                              ? "bg-padi-green text-white hover:bg-padi-green-dark shadow-xl shadow-padi-green/30"
                              : "bg-navy text-white hover:bg-navy-light"
                        }`}>
                        {planKey === "free"
                          ? "Start for Free"
                          : planKey === "premium"
                            ? "Start for Free"
                            : "Upgrade"}
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Yearly Savings & Trial Info */}
          <ScrollReveal delay={400}>
            <div className="mt-12 space-y-4">
              {/* Trial Callout */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl text-sm font-medium">
                  <FiZap className="text-amber-600" size={20} />
                  <span>
                    <strong>Premium comes with 7 DAYS FREE TRIAL.</strong> No
                    credit card required. After trial, automatically reverts to
                    Free plan — upgrade anytime.
                  </span>
                </div>
              </div>

              {/* Yearly Savings */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl text-sm font-medium">
                  <FiPercent className="text-green-600" size={20} />
                  <span>
                    <strong>Yearly plans save you up to 17%!</strong> Starter
                    saves ₦2,000/yr, Business saves ₦5,000/yr, Premium saves
                    ₦10,000/yr.
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
                FAQ
              </span>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
                Questions? <span className="text-padi-green">Answered.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-navy pr-4">
                      {faq.q}
                    </span>
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        openFaq === i
                          ? "bg-padi-green text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                      {openFaq === i ? (
                        <FiX size={14} />
                      ) : (
                        <FiArrowRight size={14} />
                      )}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === i ? "max-h-48" : "max-h-0"
                    }`}>
                    <p className="px-6 pb-5 text-gray-500">{faq.a}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4">Still have questions?</p>
              <a
                href="mailto:support@vendpadi.com"
                className="inline-flex items-center gap-2 text-padi-green font-semibold hover:underline">
                Contact our support team <FiArrowRight />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA - Split */}
      <section className="py-20 lg:py-28 px-4 bg-gradient-to-br from-padi-green via-padi-green-dark to-padi-green relative overflow-hidden">
        <FloatingShape
          className="w-96 h-96 bg-white top-0 right-0 opacity-10"
          delay={0}
        />
        <FloatingShape
          className="w-64 h-64 bg-white bottom-0 left-1/4 opacity-10"
          delay={1}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2.5 rounded-full mb-6">
                  <FiZap className="text-yellow-300" />
                  <span className="text-white font-medium">
                    7-Day Premium Trial
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                  Ready to get more orders?
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Stop sending price lists manually. Let customers browse your
                  store and order instantly on WhatsApp.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="flex flex-col items-center sm:items-start gap-4">
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-3 bg-white text-padi-green font-bold py-4 px-8 sm:px-10 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
                    <FiZap className="group-hover:rotate-12 transition-transform" />
                    Start for Free
                    <FiArrowRight className="opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="flex flex-wrap items-center gap-6 mt-8 text-white/80 text-sm">
                  <span className="flex items-center gap-2">
                    <FiCheck className="text-yellow-300" /> No credit card
                  </span>
                  <span className="flex items-center gap-2">
                    <FiCheck className="text-yellow-300" /> All Premium features
                  </span>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={200}>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        icon: FiClock,
                        label: "Setup Time",
                        value: "2 minutes",
                      },
                      {
                        icon: FiUsers,
                        label: "Happy Customers",
                        value: "2000+",
                      },
                      {
                        icon: FiDollarSign,
                        label: "Money Saved",
                        value: "₦10K/year",
                      },
                      { icon: FiAward, label: "Satisfaction", value: "4.8/5" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="text-center p-4 bg-white/10 rounded-2xl">
                        <item.icon
                          className="text-yellow-300 mx-auto mb-2"
                          size={24}
                        />
                        <div className="text-white font-bold text-lg">
                          {item.value}
                        </div>
                        <div className="text-white/70 text-sm">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Setup Service */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
            <FiSmartphone className="text-white text-2xl" />
          </div>
          <h3 className="font-sora font-bold text-2xl mb-3 text-navy">
            Need help setting up?
          </h3>
          <p className="text-gray-600 mb-6">
            Don't want to set it up yourself? We'll create your store for you in
            24 hours.
          </p>
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg mb-6">
            <span className="text-3xl font-bold text-amber-600">₦5,000</span>
            <span className="text-gray-500 text-sm">one-time</span>
          </div>
          <br />
          <a
            href="mailto:support@vendpadi.com?subject=Store Setup Service"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <FiGlobe size={18} />
            Request Setup Service
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-gray-400 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <Logo variant="icon-light" size="md" />
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
                Build your online store in minutes. Share on WhatsApp. Track
                your growth. Sell more with VendPadi.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-padi-green transition-colors">
                  <FiMessageCircle className="text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-padi-green transition-colors">
                  <FiGlobe className="text-white" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-sm hover:text-padi-green transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm hover:text-padi-green transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm hover:text-padi-green transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-sm hover:text-padi-green transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-sm hover:text-padi-green transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie-policy"
                    className="text-sm hover:text-padi-green transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm flex items-center gap-2">
              © {new Date().getFullYear()} VendPadi. Made with{" "}
              <FiHeart className="text-red-400" /> in Nigeria
            </p>
            <div className="flex items-center gap-2 text-sm">
              <FiShield className="text-padi-green" />
              <span>Secure & Reliable</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
