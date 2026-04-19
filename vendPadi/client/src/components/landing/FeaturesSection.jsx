import { Link } from "react-router-dom";
import { FiMessageCircle, FiLink, FiBarChart2, FiShare2, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const coreFeatures = [
  {
    icon: FiMessageCircle,
    title: "WhatsApp Ordering",
    desc: "Customers tap Order → opens WhatsApp with cart pre-filled",
  },
  {
    icon: FiLink,
    title: "Store Link",
    desc: "Get your own store link. Share once, sell forever.",
  },
  {
    icon: FiBarChart2,
    title: "Analytics",
    desc: "Track views, orders, and revenue in real-time",
  },
  {
    icon: FiShare2,
    title: "Share Anywhere",
    desc: "WhatsApp, Instagram, Status, SMS — everywhere",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
              Core Features
            </span>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
              Everything you need to <span className="text-padi-green">get orders</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-padi-green/30 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-padi-green to-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-sora font-bold text-lg text-navy mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="text-center mt-12">
            <Link to="/register" className="inline-flex items-center gap-2 text-padi-green font-semibold hover:underline">
              See all features <FiArrowRight />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturesSection;