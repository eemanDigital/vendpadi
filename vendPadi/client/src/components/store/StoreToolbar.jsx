import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import ViewToggle from "./ViewToggle";

const StoreToolbar = ({ search, setSearch, view, setView }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-14 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX size={14} />
              </button>
            )}
          </div>

          <ViewToggle view={view} setView={setView} />

          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all lg:hidden">
            <FiFilter size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreToolbar;
