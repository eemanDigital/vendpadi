import { motion } from "framer-motion";
import {
  FiGrid,
  FiList,
  FiMaximize2,
} from "react-icons/fi";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const ViewToggle = ({ view, setView }) => {
  const views = [
    { key: "grid", icon: <FiGrid size={16} />, label: "Grid" },
    { key: "list", icon: <FiList size={16} />, label: "List" },
    { key: "showcase", icon: <FiMaximize2 size={16} />, label: "Showcase" },
  ];

  return (
    <div className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-0.5 sm:p-1 flex-shrink-0">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => setView(v.key)}
          className={`relative flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs font-medium transition-all duration-200 ${
            view === v.key ? "text-navy" : "text-gray-400 hover:text-gray-600"
          }`}>
          {view === v.key && (
            <motion.div
              layoutId="viewToggle"
              className="absolute inset-0 bg-white shadow-sm rounded-md sm:rounded-lg"
              transition={springTransition}
            />
          )}
          <span className="relative z-10">{v.icon}</span>
          <span className="hidden sm:inline relative z-10">{v.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
