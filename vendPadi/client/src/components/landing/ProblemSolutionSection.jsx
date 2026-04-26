import { motion } from "framer-motion";
import { FiClock, FiSmile, FiTrendingDown, FiGlobe, FiShare2, FiMessageCircle, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const problemPoints = [
  { icon: FiClock, title: "Sending prices one-by-one", desc: "Wasting hours messaging each customer individually" },
  { icon: FiSmile, title: "Scattered orders", desc: "Orders lost across WhatsApp, DMs, and calls" },
  { icon: FiTrendingDown, title: "Lost sales", desc: "Customers moving to competitors with easier ordering" },
];

const solutionPoints = [
  { icon: FiGlobe, title: "One store link", desc: "Share once, customers browse forever" },
  { icon: FiShare2, title: "Easy sharing", desc: "WhatsApp, Instagram, SMS — anywhere" },
  { icon: FiMessageCircle, title: "Instant orders", desc: "Order button opens WhatsApp with cart" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const ProblemSolutionSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Stop sending price lists manually
            </motion.h2>
            <motion.p 
              className="text-gray-500 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Every minute you spend typing prices is a minute you could be taking orders
            </motion.p>
          </div>
        </ScrollReveal>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {problemPoints.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.15)" }}
              className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center cursor-default"
            >
              <motion.div 
                className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
              >
                <item.icon className="text-red-500 text-2xl" />
              </motion.div>
              <h3 className="font-sora font-bold text-lg text-navy mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.h2 
              className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              One store link. <span className="text-padi-green">All orders on WhatsApp.</span>
            </motion.h2>
            <motion.p 
              className="text-gray-500 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Share your link once. Let customers browse and order themselves.
            </motion.p>
          </div>
        </ScrollReveal>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {solutionPoints.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)" }}
              className="bg-gradient-to-br from-padi-green/5 to-padi-green/10 border border-padi-green/20 rounded-2xl p-6 text-center cursor-default group"
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-padi-green to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-padi-green/30"
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <item.icon className="text-white text-2xl" />
              </motion.div>
              <h3 className="font-sora font-bold text-lg text-navy mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
              <motion.div 
                className="flex items-center justify-center gap-1 mt-3 text-padi-green text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn more <FiArrowRight size={14} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;