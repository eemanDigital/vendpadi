import { Link } from "react-router-dom";
import { FiZap, FiArrowRight, FiCheck, FiClock, FiUsers, FiDollarSign, FiAward } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import FloatingShape from "./FloatingShape";

const FinalCTASection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-gradient-to-br from-padi-green via-padi-green-dark to-padi-green relative overflow-hidden">
      <FloatingShape className="w-96 h-96 bg-white top-0 right-0 opacity-10" delay={0} />
      <FloatingShape className="w-64 h-64 bg-white bottom-0 left-1/4 opacity-10" delay={1} />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-5 py-2.5 rounded-full mb-6">
                <FiZap className="text-yellow-300" />
                <span className="text-white font-medium">7-Day Premium Trial</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                Ready to get more orders?
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Stop sending price lists manually. Let customers browse your store and order instantly on WhatsApp.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col items-center sm:items-start gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 bg-white text-padi-green font-bold py-4 px-8 sm:px-10 rounded-full text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
                  <FiZap className="group-hover:rotate-12 transition-transform" />
                  Create Your Store Now
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
                    { icon: FiClock, label: "Setup Time", value: "2 minutes" },
                    { icon: FiUsers, label: "Happy Customers", value: "2000+" },
                    { icon: FiDollarSign, label: "Money Saved", value: "₦10K/year" },
                    { icon: FiAward, label: "Satisfaction", value: "4.8/5" },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-4 bg-white/10 rounded-2xl">
                      <item.icon className="text-yellow-300 mx-auto mb-2" size={24} />
                      <div className="text-white font-bold text-lg">{item.value}</div>
                      <div className="text-white/70 text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;