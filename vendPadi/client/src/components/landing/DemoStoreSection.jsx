import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiSmartphone, FiCoffee, FiExternalLink, FiMaximize2, FiArrowUpRight } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const demoStores = [
  {
    id: 1,
    name: "Fashion Store",
    label: "Fashion",
    icon: FiShoppingBag,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgGradient: "from-pink-500/20",
    image: "/image3.png",
    desc: "Clothes, shoes, bags & accessories",
  },
  {
    id: 2,
    name: "Food Business",
    label: "Food & Drinks",
    icon: FiCoffee,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bgGradient: "from-amber-500/20",
    image: "/image2.png",
    desc: "Meals, snacks & catering",
  },
  {
    id: 3,
    name: "Gadget Store",
    label: "Electronics",
    icon: FiSmartphone,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    bgGradient: "from-blue-500/20",
    image: "/image1.png",
    desc: "Phones, accessories & gadgets",
  },
];

const DemoStoreSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-padi-green/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-gray-300 font-medium mb-6 border border-white/10">
              <FiMaximize2 size={14} />
              Live Preview
            </div>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
              See how your store will look
            </h2>
            <p className="text-gray-400 text-lg">
              Preview real demo stores from Nigerian vendors already selling with VendPadi
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoStores.map((store, i) => (
            <ScrollReveal key={store.id} delay={i * 100}>
              <a
                href="https://demo.vendpadi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
              >
                <div className={`relative bg-gradient-to-br ${store.bgGradient} to-transparent rounded-3xl p-1 backdrop-blur-xl`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative rounded-[22px] overflow-hidden bg-gray-950 border border-white/10">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${store.gradient}" />
                    
                    <div className="aspect-[9/16] sm:aspect-[4/5] relative">
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/10" />
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                          <FiExternalLink size={10} className="text-white/70" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                        <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${store.gradient} flex items-center justify-center shadow-lg`}>
                            <store.icon className="text-white" size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm truncate">{store.name}</p>
                            <p className="text-xs text-white/60 truncate">{store.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between px-2 pb-2">
                    <div>
                      <p className="font-semibold text-white">{store.name}</p>
                      <p className="text-sm text-gray-400">{store.desc}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${store.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <FiArrowUpRight className="text-white" size={16} />
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="text-center mt-16">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-padi-green to-emerald-400 hover:from-padi-green-dark hover:to-emerald-500 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl shadow-padi-green/30 hover:shadow-padi-green/50 hover:-translate-y-1"
            >
              Create Your Store Now
              <FiArrowRight />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Free to start • No credit card needed • Setup in 5 minutes
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DemoStoreSection;