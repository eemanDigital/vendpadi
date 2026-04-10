import { FiClock, FiMapPin, FiStar } from "react-icons/fi";
import OptimizedImage from "../OptimizedImage";
import CategoryBadge, { CATEGORY_META } from "../ProductCard";

const StoreHero = ({ vendor }) => {
  const meta = CATEGORY_META[vendor.category] || CATEGORY_META.other || { icon: "🏪", bg: "bg-gray-100" };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-start gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0 bg-white">
            <OptimizedImage
              src={vendor.logo}
              alt={vendor.businessName}
              className="w-full h-full"
              fallback={
                <div
                  className={`w-full h-full flex items-center justify-center text-4xl ${meta.bg}`}>
                  {meta.icon}
                </div>
              }
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-sora font-bold text-2xl sm:text-3xl text-navy leading-tight">
              {vendor.businessName}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <CategoryBadge category={vendor.category} />
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-amber-500">
                <FiStar size={14} className="fill-current" />
                <span className="text-xs font-medium text-gray-600">4.8</span>
              </div>
            </div>

            {vendor.description && (
              <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">
                {vendor.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-padi-green animate-pulse" />
                <span className="text-xs font-medium text-gray-600">
                  Open Now
                </span>
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <FiClock size={12} />
                <span>15-30 min prep</span>
              </div>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <FiMapPin size={12} />
                <span>Delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHero;
