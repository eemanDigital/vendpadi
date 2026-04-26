import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap, FiArrowRight, FiCheck, FiClock, FiUsers, FiDollarSign, FiAward } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import FloatingShape from "./FloatingShape";

const statsItems = [
  { icon: FiClock, label: "Setup Time", value: "2 minutes" },
  { icon: FiUsers, label: "Happy Customers", value: "2000+" },
  { icon: FiDollarSign, label: "Money Saved", value: "₦10K/year" },
  { icon: FiAward, label: "Satisfaction", value: "4.8/5" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const FinalCTASection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-gradient-to-br from-padi-green via-padi-green-dark to-emerald-600 relative overflow-hidden">
      <FloatingShape className="w-96 h-96 bg-white top-0 right-0 opacity-10" delay={0} />
      <FloatingShape className="w-64 h-64 bg-white bottom-0 left-1/4 opacity-10" delay={1} />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ScrollReveal>
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <FiZap className="text-yellow-300" />
                </motion.div>
                <span className="text-white font-medium">7-Day Premium Trial</span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <motion.h2 
                variants={itemVariants}
                className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6"
              >
                Ready to get more orders?
              </motion.h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <motion.p 
                variants={itemVariants}
                className="text-white/90 text-lg mb-8 leading-relaxed"
              >
                Stop sending price lists manually. Let customers browse your store and order instantly on WhatsApp.
              </motion.p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center sm:items-start gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-3 bg-white text-padi-green font-bold py-4 px-8 sm:px-10 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                    >
                      <FiZap className="group-hover:rotate-12 transition-transform" />
                    </motion.div>
                    Create Your Store Now
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                    >
                      <FiArrowRight className="opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap items-center gap-6 mt-8 text-white/80 text-sm"
              >
                <motion.span 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiCheck className="text-yellow-300" /> No credit card
                </motion.span>
                <motion.span 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiCheck className="text-yellow-300" /> All Premium features
                </motion.span>
              </motion.div>
            </ScrollReveal>
          </motion.div>

          <ScrollReveal delay={200}>
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
                whileHover={{ boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {statsItems.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="text-center p-6 bg-white/10 rounded-2xl cursor-default"
                      whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon className="text-yellow-300 mx-auto mb-3" size={28} />
                      </motion.div>
                      <div className="text-white font-bold text-2xl">{item.value}</div>
                      <div className="text-white/70 text-sm">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;