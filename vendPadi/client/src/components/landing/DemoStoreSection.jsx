import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const DemoStoreSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-gradient-to-b from-navy via-navy to-navy-light">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
              See It In Action
            </span>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
              See how your store will look
            </h2>
            <p className="text-gray-300 text-lg">
              Preview a sample VendPadi store. Browse products, add to cart, and see how ordering works.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href="https://demo.vendpadi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-3xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 max-w-sm">
              <div className="bg-gray-100 h-64 rounded-2xl mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-padi-green/20 to-padi-green/10 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-padi-green rounded-2xl mx-auto mb-3 flex items-center justify-center">
                      <FiShoppingBag className="text-white text-2xl" />
                    </div>
                    <p className="text-navy font-bold">Fashion Store</p>
                    <p className="text-gray-500 text-sm">Tap to preview</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-navy">Demo Store</p>
                  <p className="text-sm text-gray-500">Mobile-friendly design</p>
                </div>
                <div className="w-10 h-10 bg-padi-green rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiArrowRight className="text-white" />
                </div>
              </div>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="text-center mt-10">
            <Link to="/register" className="inline-flex items-center gap-2 bg-padi-green hover:bg-padi-green-dark text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-padi-green/30 hover:-translate-y-1">
              Create Your Own Store
              <FiArrowRight />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DemoStoreSection;