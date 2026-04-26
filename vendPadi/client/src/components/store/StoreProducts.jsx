import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../ProductCard";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    }
  },
  exit: { opacity: 0, y: 20 },
};

const gridClassMap = {
  grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
  list: "flex flex-col gap-3",
  showcase: "grid grid-cols-1 sm:grid-cols-2 gap-5",
};

const StoreProducts = ({ products, view, search, setSearch, onOpenDetail }) => {
  const gridClass = gridClassMap[view] || gridClassMap.grid;

  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-36">
      <motion.div 
        className="flex items-center justify-between mb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <motion.h2 
            className="font-sora font-bold text-navy text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {search ? `"${search}"` : "Menu"}
          </motion.h2>
          <motion.p 
            className="text-xs text-gray-400 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {products.length} {products.length === 1 ? "item" : "items"}
          </motion.p>
        </div>
      </motion.div>

      {products.length === 0 ? (
        <motion.div {...fadeIn} className="text-center py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <FiSearch size={36} className="text-gray-400" />
          </motion.div>
          <motion.h3 
            className="font-sora font-semibold text-navy text-xl mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            No items found
          </motion.h3>
          <motion.p 
            className="text-gray-500 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Try adjusting your search
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSearch("")}
            className="text-padi-green font-semibold text-sm hover:underline"
          >
            Clear search
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className={gridClass}
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                transition={{ 
                  delay: Math.min(index * 0.05, 0.3),
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ProductCard
                  product={product}
                  onOpenDetail={onOpenDetail}
                  view={view}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
};

export default StoreProducts;