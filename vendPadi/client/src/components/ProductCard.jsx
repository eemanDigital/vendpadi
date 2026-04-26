import { useState } from "react";
import StockBadge from "./ui/StockBadge";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiBox,
  FiGift,
  FiSmartphone,
  FiEye,
  FiTrendingUp,
  FiStar,
  FiHome,
  FiGrid,
  FiZap,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const CategoryIcon = ({ category, size = 16, className = "" }) => {
  const props = { size, className };
  switch (category) {
    case "food": return <FiGift {...props} />;
    case "fashion": return <FiBox {...props} />;
    case "phones": return <FiSmartphone {...props} />;
    case "beauty": return <FiStar {...props} />;
    case "cakes": return <FiGift {...props} />;
    case "electronics": return <FiZap {...props} />;
    case "home": return <FiHome {...props} />;
    case "sports": return <FiTrendingUp {...props} />;
    case "books": return <FiGrid {...props} />;
    case "toys": return <FiBox {...props} />;
    case "services": return <FiStar {...props} />;
    default: return <FiBox {...props} />;
  }
};

const CATEGORY_META = {
  food: { label: "Food & Drinks", bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", emoji: "🍔" },
  fashion: { label: "Fashion", bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", emoji: "👗" },
  phones: { label: "Phones & Gadgets", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", emoji: "📱" },
  beauty: { label: "Beauty", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", emoji: "💄" },
  cakes: { label: "Cakes & Pastries", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", emoji: "🎂" },
  electronics: { label: "Electronics", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", emoji: "📺" },
  home: { label: "Home & Living", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", emoji: "🏠" },
  sports: { label: "Sports & Fitness", bg: "bg-green-50", text: "text-green-600", border: "border-green-200", emoji: "⚽" },
  books: { label: "Books & Stationery", bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", emoji: "📚" },
  toys: { label: "Toys & Games", bg: "bg-red-50", text: "text-red-600", border: "border-red-200", emoji: "🎮" },
  services: { label: "Services", bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", emoji: "🛠️" },
  other: { label: "Other", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", emoji: "🏪" },
};

const CategoryBadge = ({ category }) => {
  const meta = CATEGORY_META[category] || null;
  const label = meta ? meta.label : category;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${meta ? `${meta.bg} ${meta.text} ${meta.border}` : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {meta ? <CategoryIcon category={category} size={10} /> : <span>🏷️</span>}
      <span className="capitalize">{label}</span>
    </span>
  );
};

const ImageCarousel = ({ images = [], name, category }) => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    <motion.div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1 }}
      />
      <motion.img
        src={images[current]}
        alt={name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <AnimatePresence>
        {hasMany && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-between px-2"
          >
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((i) => (i - 1 + images.length) % images.length);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <FiChevronLeft size={16} className="text-gray-700" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((i) => (i + 1) % images.length);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <FiChevronRight size={16} className="text-gray-700" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {hasMany && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === current ? "bg-white w-5" : "bg-white/50 w-2"
              }`}
              animate={{
                width: idx === current ? 20 : 8,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const GridCard = ({ product, onOpenDetail, index = 0 }) => {
  if (!product) return null;

  const stockPercent = product.stock > 0 ? Math.min(100, (product.stock / (product.lowStockThreshold || 5) * 100)) : 0;
  const isLow = product.lowStockAlert;
  const isOut = !product.inStock;
  const isFlashSale = product.isFlashSaleActive;
  const flashSalePrice = product.flashSale?.discountPrice;
  const discountPct = product.discountPercentage;

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 active:scale-[0.98] transition-all duration-300 cursor-pointer flex flex-col shadow-sm hover:shadow-xl"
    >
      <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ImageCarousel images={product.images} name={product.name} category={product.category} />
        </motion.div>

        <motion.div
          className="absolute top-2 left-2 z-10 flex gap-1.5 flex-wrap"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isFlashSale && !isOut && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-lg flex items-center gap-1"
            >
              <FiZap size={10} />
              {discountPct}% OFF
            </motion.span>
          )}
          {isLow && !isOut && !isFlashSale && (
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
        </motion.div>

        <motion.div
          className="absolute top-2 right-2 z-10"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CategoryBadge category={product.category} />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="bg-white/95 text-navy text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
          >
            <FiEye size={14} />
            View Details
          </motion.span>
        </motion.div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <motion.h3
          className="font-sora font-bold text-navy text-xs sm:text-sm leading-tight line-clamp-2 mb-2 sm:mb-3"
          whileHover={{ color: "#10B981" }}
        >
          {product.name}
        </motion.h3>

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex flex-col">
            {isFlashSale ? (
              <>
                <motion.span
                  className="font-bold text-base sm:text-lg text-red-500"
                  whileHover={{ scale: 1.05 }}
                >
                  ₦{flashSalePrice?.toLocaleString()}
                </motion.span>
                <span className="text-xs text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <motion.span
                className="font-bold text-base sm:text-lg text-padi-green"
                whileHover={{ scale: 1.05 }}
              >
                ₦{product.price.toLocaleString()}
              </motion.span>
            )}
          </div>
          {product.stock > 0 && (
            <StockBadge stock={product.stock} threshold={product.lowStockThreshold || 5} size="sm" />
          )}
        </div>

        {product.stock > 0 && (
          <div className="mt-auto hidden sm:block">
            <motion.div
              className="flex items-center justify-between text-xs mb-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-500 font-medium">Stock Level</span>
              <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-gray-700'}`}>
                {product.stock} units
              </span>
            </motion.div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${stockPercent}%` }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ListCard = ({ product, onOpenDetail, index = 0 }) => {
  if (!product) return null;

  const isLow = product.lowStockAlert;
  const isOut = !product.inStock;
  const isFlashSale = product.isFlashSaleActive;
  const flashSalePrice = product.flashSale?.discountPrice;

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer flex"
    >
      <motion.div
        className="w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <ImageCarousel images={product.images} name={product.name} category={product.category} />

        {isFlashSale && !isOut && (
          <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
            <FiZap size={8} /> {product.discountPercentage}%
          </div>
        )}
        {isLow && !isOut && !isFlashSale && (
          <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
            Low
          </div>
        )}
        {isOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-600 px-2 py-1 rounded text-xs font-bold">Out</span>
          </div>
        )}
      </motion.div>

      <div className="flex-1 p-2.5 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CategoryBadge category={product.category} />
              {isFlashSale && (
                <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Flash Sale</span>
              )}
              {isLow && !isOut && !isFlashSale && (
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
            {isFlashSale ? (
              <>
                <p className="font-bold text-red-500 text-sm sm:text-lg">
                  ₦{flashSalePrice?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="font-bold text-padi-green text-sm sm:text-lg">
                ₦{product.price.toLocaleString()}
              </p>
            )}
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
              <StockBadge stock={product.stock} threshold={product.lowStockThreshold || 5} size="sm" />
              <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">{product.stock} in stock</span>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-1.5 sm:px-2 py-1 rounded-lg"
            whileHover={{ scale: 1.05, backgroundColor: "#f0fdf4" }}
          >
            <FiEye size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">View</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCard = ({ product, onOpenDetail, view = "grid" }) => {
  if (!product) return null;

  if (view === "list") {
    return <ListCard product={product} onOpenDetail={onOpenDetail} />;
  }

  return <GridCard product={product} onOpenDetail={onOpenDetail} />;
};

export default ProductCard;
export { CategoryBadge, CATEGORY_META, ImageCarousel };