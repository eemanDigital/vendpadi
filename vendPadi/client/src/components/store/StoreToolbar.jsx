import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import ViewToggle from "./ViewToggle";

const StoreToolbar = ({ search, setSearch, view, setView }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-14 z-20">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <FiSearch
              size={14}
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX size={14} />
              </button>
            )}
          </div>

          <ViewToggle view={view} setView={setView} />

          <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all lg:hidden flex-shrink-0">
            <FiFilter size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreToolbar;
