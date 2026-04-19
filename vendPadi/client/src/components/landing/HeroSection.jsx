import { Link } from "react-router-dom";
import { FiZap, FiArrowRight, FiCheck } from "react-icons/fi";
import { FiMessageCircle, FiTrendingUp, FiShoppingBag, FiArrowDownRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import FloatingShape from "./FloatingShape";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 overflow-hidden bg-gradient-to-b from-navy via-navy to-navy-light">
      <FloatingShape className="w-[500px] h-[500px] bg-padi-green -top-40 -left-40" delay={0} />
      <FloatingShape className="w-[400px] h-[400px] bg-padi-green top-1/2 -right-20" delay={1} />

      <div className="max-w-7xl mx-auto relative">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-2.5 rounded-full mb-8 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-padi-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-padi-green"></span>
              </span>
              <span className="text-sm text-gray-300 font-medium">
                Built for Nigerian vendors selling on WhatsApp
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="font-sora font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] tracking-tight text-white">
              Turn your WhatsApp into a{" "}
              <span className="bg-gradient-to-r from-padi-green to-emerald-400 bg-clip-text text-transparent">
                store in 5 minutes
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
              Stop sending price lists. Let customers browse and order instantly.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col items-center justify-center gap-4">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-3 bg-padi-green hover:bg-padi-green-dark text-white font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300 shadow-xl shadow-padi-green/30 hover:shadow-padi-green/50 hover:-translate-y-1 w-full sm:w-auto">
                <FiZap className="group-hover:rotate-12 transition-transform" />
                Create Your Store Now
                <FiArrowRight className="opacity-0 -ml-8 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-gray-300">
                <FiZap className="text-amber-400" size={14} /> 7-Day Premium Trial • No card required
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
                        { label: "Orders", value: "1,247", trend: "+12%", up: true },
                        { label: "Views", value: "8,392", trend: "+24%", up: true },
                        { label: "Revenue", value: "₦456K", trend: "+18%", up: true },
                      ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                          <p className="text-xl font-bold text-navy">{stat.value}</p>
                          <div className="flex items-center gap-1">
                            {stat.up ? (
                              <FiTrendingUp className="text-padi-green" size={12} />
                            ) : (
                              <FiArrowDownRight className="text-red-400" size={12} />
                            )}
                            <span className="text-xs text-padi-green font-medium">{stat.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
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
  );
};

export default HeroSection;