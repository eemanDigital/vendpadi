import { motion } from "framer-motion";
import { FiZap, FiGift } from "react-icons/fi";

const StoreBundles = ({ bundles }) => {
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreBundles;
