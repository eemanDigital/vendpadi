import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiGift, FiShoppingCart, FiPlus, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

const bundleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const StoreBundles = ({ bundles }) => {
  const dispatch = useDispatch();
  
  const handleAddBundleToCart = (bundle) => {
    dispatch(addItem({
      _id: `bundle-${bundle._id}`,
      name: bundle.name,
      price: bundle.bundlePrice,
      description: `Bundle: ${bundle.products?.map(p => p.name).join(', ')}`,
      images: bundle.products?.[0]?.images || [],
      qty: 1,
      isBundle: true,
      bundleId: bundle._id,
      bundleProducts: bundle.products,
      originalPrice: bundle.originalPrice,
      discountPercentage: bundle.discountPercentage
    }));
    toast.success(`Added ${bundle.name} to cart!`);
  };
  
  if (!bundles || bundles.length === 0) return null;

  const dealOfTheDay = bundles.find(b => b.isDealOfTheDay);
  const otherBundles = bundles.filter(b => !b.isDealOfTheDay);

  return (
    <motion.div 
      className="py-4 px-3 sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          className="font-sora font-bold text-lg text-navy mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FiGift className="text-purple-500" />
          </motion.span>
          Bundles & Deals
        </motion.h2>

        {dealOfTheDay && (
          <motion.div
            variants={bundleVariants}
            initial="initial"
            animate="animate"
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)" }}
            className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-red-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FiZap className="text-yellow-300" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-wider">Deal of the Day</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{dealOfTheDay.name}</h3>
            <p className="text-white/80 text-sm mb-3 line-clamp-1">
              {dealOfTheDay.description || `${dealOfTheDay.products?.length || 0} items included`}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <motion.span 
                  className="text-2xl font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  ₦{dealOfTheDay.bundlePrice?.toLocaleString()}
                </motion.span>
                <span className="text-sm text-white/70 line-through ml-2">
                  ₦{dealOfTheDay.originalPrice?.toLocaleString()}
                </span>
              </div>
              <motion.span 
                className="bg-white text-red-500 px-3 py-1 rounded-full text-sm font-bold"
                whileHover={{ scale: 1.1 }}
              >
                Save {dealOfTheDay.discountPercentage}%
              </motion.span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {dealOfTheDay.products?.slice(0, 4).map((p, i) => (
                <motion.span 
                  key={i} 
                  className="bg-white/20 px-2 py-1 rounded-lg text-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {p.name}
                </motion.span>
              ))}
              {(dealOfTheDay.products?.length || 0) > 4 && (
                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs">
                  +{(dealOfTheDay.products?.length || 0) - 4} more
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddBundleToCart(dealOfTheDay)}
              className="mt-4 w-full bg-white text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <FiShoppingCart size={18} /> Add to Cart
            </motion.button>
          </motion.div>
        )}

        {otherBundles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherBundles.map((bundle, index) => (
              <motion.div
                key={bundle._id}
                variants={bundleVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-navy text-sm line-clamp-1">{bundle.name}</h4>
                  <motion.span 
                    className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    {bundle.discountPercentage}% OFF
                  </motion.span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {bundle.products?.length || 0} items
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-padi-green">₦{bundle.bundlePrice?.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through ml-1">
                      ₦{bundle.originalPrice?.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-green-600 text-xs font-medium">
                    Save ₦{(bundle.originalPrice - bundle.bundlePrice)?.toLocaleString()}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#10B981" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddBundleToCart(bundle)}
                  className="mt-3 w-full bg-padi-green text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-padi-green-dark transition-colors text-sm"
                >
                  <FiShoppingCart size={14} /> Add to Cart
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StoreBundles;