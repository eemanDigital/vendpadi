import { motion } from "framer-motion";
import { FiMessageCircle, FiSmartphone, FiGlobe, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import FloatingShape from "./FloatingShape";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const trustItems = [
  { 
    icon: FiMessageCircle, 
    title: "WhatsApp", 
    subtitle: "Native Ordering",
    color: "from-padi-green to-emerald-400"
  },
  { 
    icon: FiSmartphone, 
    title: "Naira", 
    subtitle: "Payments Ready",
    color: "from-amber-400 to-orange-500"
  },
  { 
    icon: FiGlobe, 
    title: "Local", 
    subtitle: "Support Team",
    color: "from-blue-400 to-indigo-500"
  },
];

const TrustSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-navy text-white relative overflow-hidden">
      <FloatingShape className="w-96 h-96 bg-padi-green top-0 left-0" delay={0} />
      <div className="max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Built for Nigerian vendors
            </motion.h2>
            <motion.p 
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join vendors who are already getting orders through their WhatsApp stores
            </motion.p>
          </div>
        </ScrollReveal>

        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
              className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 cursor-default group"
            >
              <motion.div 
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} p-1`}
                whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                  <item.icon className="text-white text-3xl" />
                </div>
              </motion.div>
              <div className="font-sora font-bold text-4xl lg:text-5xl bg-gradient-to-r from-padi-green to-emerald-400 bg-clip-text text-transparent mb-2">
                {item.title}
              </div>
              <motion.div 
                className="text-sm text-gray-400 font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {item.subtitle} <FiArrowRight size={14} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;