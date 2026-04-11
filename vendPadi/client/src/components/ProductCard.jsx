import { useState } from "react";
import StockBadge from "./ui/StockBadge";
import {
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiGift,
  FiSmartphone,
  FiEye,
  FiTrendingUp,
} from "react-icons/fi";

const CategoryIcon = ({ category, size = 16, className = "" }) => {
  const props = { size, className };
  switch (category) {
    case "food": return <FiGift {...props} />;
    case "fashion": return <FiBox {...props} />;
    case "phones": return <FiSmartphone {...props} />;
    case "cakes": return <FiGift {...props} />;
    default: return <FiBox {...props} />;
  }
};

const CATEGORY_META = {
  food: { label: "Food", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  fashion: { label: "Fashion", bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  phones: { label: "Phones", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  cakes: { label: "Cakes", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  other: { label: "Other", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
};

const CategoryBadge = ({ category }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.other;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${meta.bg} ${meta.text} ${meta.border}`}>
      <CategoryIcon category={category} size={10} />
      <span className="capitalize">{meta.label}</span>
    </span>
  );
};

const ImageCarousel = ({ images = [], name, category }) => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const hasMany = images && images.length > 1;

  if (!images || images.length === 0) {
    const meta = CATEGORY_META[category] || CATEGORY_META.other;
    return (
      <div className={`w-full h-full flex items-center justify-center ${meta.bg}`}>
        <CategoryIcon category={category} size={48} className={meta.text} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/img">
      {!loaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}
      <img
        src={images[current]}
        alt={name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {hasMany && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/img:opacity-100 transition-all z-10">
            <FiChevronLeft size={16} className="text-gray-700" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/img:opacity-100 transition-all z-10">
            <FiChevronRight size={16} className="text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === current ? "bg-white w-4" : "bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── GRID CARD ───────────────────────────────────────────────
const GridCard = ({ product, onOpenDetail }) => {
  if (!product) return null;

  const stockPercent = product.stock > 0 ? Math.min(100, (product.stock / (product.lowStockThreshold || 5) * 100)) : 0;
  const isLow = product.lowStockAlert;
  const isOut = !product.inStock;

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl active:scale-[0.98] transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <ImageCarousel images={product.images} name={product.name} category={product.category} />
        
        <div className="absolute top-2 left-2 z-10 flex gap-1.5">
          {isLow && !isOut && (
            <span className="bg-amber-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-lg flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Low Stock
            </span>
          )}
          {isOut && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 z-10">
          <CategoryBadge category={product.category} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity flex items-end justify-center pb-4 pointer-events-none">
          <span className="bg-white/95 text-navy text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <FiEye size={14} />
            View Details
          </span>
        </div>
        
        <div className="absolute inset-0 bg-black/5 opacity-0 group-active:opacity-100 transition-opacity sm:hidden" />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-sora font-bold text-navy text-xs sm:text-sm leading-tight line-clamp-2 mb-2 sm:mb-3">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="font-bold text-base sm:text-lg text-padi-green">
            ₦{product.price.toLocaleString()}
          </span>
          {product.stock > 0 && (
            <StockBadge stock={product.stock} threshold={product.lowStockThreshold || 5} size="sm" />
          )}
        </div>

        {product.stock > 0 && (
          <div className="mt-auto hidden sm:block">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Stock Level</span>
              <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-gray-700'}`}>
                {product.stock} units
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`}
                style={{ width: `${stockPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── LIST CARD ───────────────────────────────────────────────
const ListCard = ({ product, onOpenDetail }) => {
  if (!product) return null;

  const isLow = product.lowStockAlert;
  const isOut = !product.inStock;

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer flex"
    >
      <div className="w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <ImageCarousel images={product.images} name={product.name} category={product.category} />
        
        {isLow && !isOut && (
          <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
            Low
          </div>
        )}
        {isOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-600 px-2 py-1 rounded text-xs font-bold">Out</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-2.5 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CategoryBadge category={product.category} />
              {isLow && !isOut && (
                <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-semibold">Low</span>
              )}
            </div>
          </div>
          <h3 className="font-sora font-bold text-navy text-xs sm:text-base line-clamp-2 mb-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-1 hidden sm:block">{product.description}</p>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 mt-1 sm:mt-2">
          <div>
            <p className="font-bold text-padi-green text-sm sm:text-lg">
              ₦{product.price.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
              <StockBadge stock={product.stock} threshold={product.lowStockThreshold || 5} size="sm" />
              <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">{product.stock} in stock</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-1.5 sm:px-2 py-1 rounded-lg">
            <FiEye size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── EXPORTED WRAPPER ────────────────────────────────────────
const ProductCard = ({ product, onOpenDetail, view = "grid" }) => {
  if (!product) return null;

  if (view === "list") {
    return <ListCard product={product} onOpenDetail={onOpenDetail} />;
  }

  return <GridCard product={product} onOpenDetail={onOpenDetail} />;
};

export default ProductCard;
export { CategoryBadge, CATEGORY_META, ImageCarousel };
