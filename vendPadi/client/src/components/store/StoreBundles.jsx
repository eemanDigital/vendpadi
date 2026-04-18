import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { motion } from "framer-motion";
import { FiZap, FiGift, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

const StoreBundles = ({ bundles }) => {
  const dispatch = useDispatch();
  
  const handleAddBundleToCart = (bundle) => {
    // Add as a single bundle item with the bundle price
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
    <div className="py-4 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-sora font-bold text-lg text-navy mb-4 flex items-center gap-2">
          <FiGift className="text-purple-500" />
          Bundles & Deals
        </h2>

        {dealOfTheDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg shadow-red-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Deal of the Day</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{dealOfTheDay.name}</h3>
            <p className="text-white/80 text-sm mb-3 line-clamp-1">
              {dealOfTheDay.description || `${dealOfTheDay.products?.length || 0} items included`}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">₦{dealOfTheDay.bundlePrice?.toLocaleString()}</span>
                <span className="text-sm text-white/70 line-through ml-2">
                  ₦{dealOfTheDay.originalPrice?.toLocaleString()}
                </span>
              </div>
              <span className="bg-white text-red-500 px-3 py-1 rounded-full text-sm font-bold">
                Save {dealOfTheDay.discountPercentage}%
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {dealOfTheDay.products?.slice(0, 4).map((p, i) => (
                <span key={i} className="bg-white/20 px-2 py-1 rounded-lg text-xs">
                  {p.name}
                </span>
              ))}
              {(dealOfTheDay.products?.length || 0) > 4 && (
                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs">
                  +{(dealOfTheDay.products?.length || 0) - 4} more
                </span>
              )}
            </div>
            <button
              onClick={() => handleAddBundleToCart(dealOfTheDay)}
              className="mt-4 w-full bg-white text-red-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <FiShoppingCart size={18} /> Add to Cart
            </button>
          </motion.div>
        )}

        {otherBundles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherBundles.map((bundle) => (
              <div
                key={bundle._id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-navy text-sm line-clamp-1">{bundle.name}</h4>
                  <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {bundle.discountPercentage}% OFF
                  </span>
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
                <button
                  onClick={() => handleAddBundleToCart(bundle)}
                  className="mt-3 w-full bg-padi-green text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-padi-green-dark transition-colors text-sm"
                >
                  <FiShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreBundles;
