import { Link } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiSmartphone, FiCoffee, FiExternalLink } from "react-icons/fi";
import ScrollReveal from "./ScrollReveal";

const demoStores = [
  {
    id: 1,
    name: "Fashion Store",
    label: "Fashion",
    icon: FiShoppingBag,
    color: "from-pink-500 to-rose-500",
    image: "/image3.png",
    desc: "Clothes, shoes, bags & accessories",
  },
  {
    id: 2,
    name: "Food Business",
    label: "Food & Drinks",
    icon: FiCoffee,
    color: "from-amber-500 to-orange-500",
    image: "/image2.png",
    desc: "Meals, snacks & catering",
  },
  {
    id: 3,
    name: "Gadget Store",
    label: "Electronics",
    icon: FiSmartphone,
    color: "from-blue-500 to-indigo-500",
    image: "/image1.png",
    desc: "Phones, accessories & gadgets",
  },
];

const DemoStoreSection = () => {
  return (
    <section className="py-20 lg:py-28 px-4 bg-gradient-to-b from-navy via-navy to-navy-light">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
              See how your store will look
            </h2>
            <p className="text-gray-300 text-lg">
              Preview real demo stores from Nigerian vendors already selling with VendPadi
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoStores.map((store, i) => (
            <a
              key={store.id}
              href="https://demo.vendpadi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-3xl"
            >
              <div className="relative aspect-[9/16] sm:aspect-[4/5] lg:aspect-[9/16] overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-lg ${store.color.split(" ")[0]} text-white`}>
                    <store.icon size={12} />
                    Preview
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-semibold flex items-center gap-2 text-sm">
                    Tap to preview <FiArrowRight />
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.desc}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${store.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <FiArrowRight className="text-white" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-padi-green hover:bg-padi-green-dark text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl shadow-padi-green/30 hover:-translate-y-1"
            >
              Create Your Store Now
              <FiArrowRight />
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Free to start • No credit card needed • Setup in 5 minutes
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DemoStoreSection;