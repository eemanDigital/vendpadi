import { FiMessageCircle, FiSmartphone, FiGlobe } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";
import FloatingShape from "./FloatingShape";

const TrustSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-navy text-white relative overflow-hidden">
      <FloatingShape className="w-96 h-96 bg-padi-green top-0 left-0" delay={0} />
      <div className="max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
              Built for Nigeria
            </span>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
              Early users are already testing VendPadi
            </h2>
            <p className="text-gray-300 text-lg">
              Join Nigerian vendors who are already getting orders through their WhatsApp stores.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-padi-green to-emerald-400 p-1">
                <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                  <FiMessageCircle className="text-white text-3xl" />
                </div>
              </div>
              <div className="font-sora font-bold text-4xl lg:text-5xl text-padi-green mb-2">WhatsApp</div>
              <div className="text-sm text-gray-400 font-medium">Native Ordering</div>
            </div>

            <div className="p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-1">
                <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                  <FiSmartphone className="text-white text-3xl" />
                </div>
              </div>
              <div className="font-sora font-bold text-4xl lg:text-5xl text-padi-green mb-2">Naira</div>
              <div className="text-sm text-gray-400 font-medium">Payments Ready</div>
            </div>

            <div className="p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 p-1">
                <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                  <FiGlobe className="text-white text-3xl" />
                </div>
              </div>
              <div className="font-sora font-bold text-4xl lg:text-5xl text-padi-green mb-2">Local</div>
              <div className="text-sm text-gray-400 font-medium">Support Team</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TrustSection;