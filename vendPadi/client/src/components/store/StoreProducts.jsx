import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import ProductCard from "../ProductCard";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const gridClassMap = {
  grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4",
  list: "flex flex-col gap-3",
  showcase: "grid grid-cols-1 sm:grid-cols-2 gap-5",
};

const StoreProducts = ({ products, view, search, setSearch, onOpenDetail }) => {
  const gridClass = gridClassMap[view] || gridClassMap.grid;

  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-36">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-sora font-bold text-navy text-lg">
            {search ? `"${search}"` : "Menu"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <motion.div {...fadeIn} className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiSearch size={36} className="text-gray-400" />
          </div>
          <h3 className="font-sora font-semibold text-navy text-xl mb-2">
            No items found
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Try adjusting your search
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-padi-green font-semibold text-sm hover:underline">
            Clear search
          </button>
        </motion.div>
      ) : (
        <motion.div layout className={gridClass}>
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpenDetail={onOpenDetail}
                view={view}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
};

export default StoreProducts;
