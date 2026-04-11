import { FiClock, FiMapPin, FiStar } from "react-icons/fi";
import OptimizedImage from "../OptimizedImage";
import CategoryBadge, { CATEGORY_META } from "../ProductCard";

const StoreHero = ({ vendor }) => {
  const meta = CATEGORY_META[vendor.category] || null;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">
      {vendor.coverImage && (
        <div className="w-full h-32 sm:h-48 overflow-hidden">
          <OptimizedImage
            src={vendor.coverImage}
            alt="Store cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-start gap-3 sm:gap-5">
          <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0 bg-white ${vendor.coverImage ? '-mt-8 sm:-mt-12' : ''}`}>
            <OptimizedImage
              src={vendor.logo}
              alt={vendor.businessName}
              className="w-full h-full"
              fallback={
                <div
                  className={`w-full h-full flex items-center justify-center text-2xl sm:text-4xl ${meta.bg}`}>
                  {meta.icon}
                </div>
              }
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-sora font-bold text-lg sm:text-2xl sm:text-3xl text-navy leading-tight truncate sm:truncate-none">
              {vendor.businessName}
            </h1>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
              <CategoryBadge category={vendor.category} />
              <span className="text-gray-300 hidden xs:inline">•</span>
              <div className="flex items-center gap-1 text-amber-500">
                <FiStar size={12} className="fill-current" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600">4.8</span>
              </div>
            </div>

            {vendor.description && (
              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 leading-relaxed line-clamp-1 sm:line-clamp-2">
                {vendor.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-2 sm:gap-3 gap-y-1 mt-2 sm:mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-padi-green animate-pulse" />
                <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                  Open Now
                </span>
              </div>
              <div className="hidden xs:flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                <FiClock size={10} />
                <span>15-30 min</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
                <FiMapPin size={12} />
                <span>Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHero;
