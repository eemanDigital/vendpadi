import { useState } from "react";
import { FiSearch, FiX, FiFilter, FiSliders } from "react-icons/fi";
import { motion } from "framer-motion";
import ViewToggle from "./ViewToggle";

const StoreToolbar = ({ search, setSearch, view, setView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-14 z-20"
    >
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="flex-1 relative"
            whileFocusWithin={{ scale: 1.01 }}
          >
            <motion.div
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400"
              whileHover={{ scale: 1.1, color: "#10B981" }}
            >
              <FiSearch size={14} />
            </motion.div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
            />
            {search && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearch("")}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={14} />
              </motion.button>
            )}
          </motion.div>

          <ViewToggle view={view} setView={setView} />

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all lg:hidden flex-shrink-0"
          >
            <FiSliders size={16} className="text-gray-500" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreToolbar;