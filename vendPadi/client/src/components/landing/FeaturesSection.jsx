import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMessageCircle, FiLink, FiBarChart2, FiShare2, FiArrowRight, FiFileText } from "react-icons/fi";
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
  {
    icon: FiFileText,
    title: "Invoices & Receipts",
    desc: "Manual invoices for offline sales",
    badge: "Business+",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Everything you need to <span className="text-padi-green">get orders</span>
            </motion.h2>
            <motion.p 
              className="text-gray-500 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Built for busy Nigerian vendors who want to sell more with less effort
            </motion.p>
          </div>
        </ScrollReveal>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {coreFeatures.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)" }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-padi-green/30 transition-all duration-300 cursor-default group"
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-padi-green to-emerald-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-padi-green/20"
                whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="text-white text-2xl" />
              </motion.div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-sora font-bold text-lg text-navy">{feature.title}</h3>
                {feature.badge && (
                  <motion.span 
                    className="text-xs bg-padi-green/10 text-padi-green px-2 py-0.5 rounded-full font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {feature.badge}
                  </motion.span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
              <motion.div 
                className="flex items-center gap-1 mt-3 text-padi-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn more <FiArrowRight size={14} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

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