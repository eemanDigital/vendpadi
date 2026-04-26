import { motion } from "framer-motion";
import { FiZap, FiSmartphone, FiArrowRight } from "react-icons/fi";

const SetupServiceSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50/50">
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h3 
          className="font-sora font-bold text-2xl sm:text-3xl mb-3 text-navy"
          whileHover={{ scale: 1.02 }}
        >
          Don't want to set it up yourself?
        </motion.h3>
        <motion.p 
          className="text-gray-600 text-lg mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          We'll create your professional store for you in 24 hours.
        </motion.p>
        <motion.div 
          className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-xl mb-8 border border-amber-100"
          whileHover={{ boxShadow: "0 20px 40px rgba(245, 158, 11, 0.2)" }}
        >
          <span className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">₦5,000</span>
          <span className="text-gray-500 text-sm">one-time</span>
        </motion.div>
        <br />
        <motion.a
          href="mailto:support@vendpadi.com?subject=Store Setup Service"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-10 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <FiSmartphone size={20} />
          Request Setup Service
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
          >
            <FiArrowRight size={18} />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
};

export default SetupServiceSection;