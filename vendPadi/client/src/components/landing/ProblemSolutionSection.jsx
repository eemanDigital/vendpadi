import { FiClock, FiSmile, FiTrendingDown, FiGlobe, FiShare2, FiMessageCircle } from "react-icons/fi";
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

const ProblemSolutionSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-red-500 font-semibold text-sm mb-3 tracking-wider uppercase">
              The Problem
            </span>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-4">
              Stop sending price lists manually
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problemPoints.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-red-500 text-2xl" />
                </div>
                <h3 className="font-sora font-bold text-lg text-navy mb-2">{item.title}</h3>
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
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-4">
              One store link. <span className="text-padi-green">All orders on WhatsApp.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {solutionPoints.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-gradient-to-br from-padi-green/5 to-padi-green/10 border border-padi-green/20 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-padi-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-sora font-bold text-lg text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;