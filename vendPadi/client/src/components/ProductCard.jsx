import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, incrementQty, decrementQty } from "../store/cartSlice";
import WishlistButton from "./store/WishlistButton";
import StockBadge from "./ui/StockBadge";
import {
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiPlus,
  FiMinus,
  FiEye,
  FiZap,
  FiBox,
  FiHeadphones,
  FiGift,
  FiSmartphone,
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
  food: {
    label: "Food",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
  },
  fashion: {
    label: "Fashion",
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
  },
  phones: {
    label: "Phones",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  cakes: {
    label: "Cakes",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  other: {
    label: "Other",
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

const CategoryBadge = ({ category }) => {
  const meta = CATEGORY_META[category] || CATEGORY_META.other;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.bg} ${meta.text} ${meta.border}`}>
      <CategoryIcon category={category} size={12} />
      <span className="capitalize">{meta.label}</span>
    </span>
  );
};

// ─── IMAGE CAROUSEL ────────────────────────────────────────────────
const ImageCarousel = ({ images = [], name, category, compact = false }) => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const hasMany = images && images.length > 1;

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((i) => (i - 1 + images.length) % images.length);
    setLoaded(false);
  };
  const next = (e) => {
    e.stopPropagation();
    setCurrent((i) => (i + 1) % images.length);
    setLoaded(false);
  };

  if (!images || images.length === 0) {
    const meta = CATEGORY_META[category] || CATEGORY_META.other || { bg: "bg-gray-100", text: "text-gray-400" };
    return (
      <div className={`w-full h-full flex items-center justify-center ${meta.bg}`}>
        <CategoryIcon category={category} size={compact ? 32 : 48} className={meta.text} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/img">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={images[current]}
        alt={name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
      />
      
      {hasMany && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 z-10 touch-manipulation">
            <FiChevronLeft size={14} className="text-gray-700" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 z-10 touch-manipulation">
            <FiChevronRight size={14} className="text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 hidden sm:flex">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(idx);
                  setLoaded(false);
                }}
                aria-label={`View image ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "w-5 bg-padi-green" : "w-1.5 bg-white/80 hover:bg-white"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── CART QUANTITY CONTROL ─────────────────────────────────────────
const QtyControl = ({ qty, productId, onAdd, compact = false }) => {
  const dispatch = useDispatch();
  const size = compact ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  return (
    <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(decrementQty(productId));
        }}
        className={`${size} flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors`}>
        <FiMinus size={12} />
      </button>
      <span
        className={`${compact ? "w-7" : "w-8"} text-center font-bold text-navy text-sm`}>
        {qty}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(incrementQty(productId));
        }}
        className={`${size} flex items-center justify-center text-gray-500 hover:text-padi-green hover:bg-padi-green/10 transition-colors`}>
        <FiPlus size={12} />
      </button>
    </div>
  );
};

// ─── GRID CARD (default) ───────────────────────────────────────────
const GridCard = ({ product, onOpenDetail, cartItem }) => {
  const dispatch = useDispatch();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-padi-green/30 hover:shadow-xl hover:shadow-padi-green/10 transition-all duration-300 cursor-pointer flex flex-col">
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <ImageCarousel
          images={product.images}
          name={product.name}
          category={product.category}
        />
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <WishlistButton product={product} size="sm" />
        </div>

        {product.lowStockAlert && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              Low Stock
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
            <span className="bg-white text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <CategoryBadge category={product.category} />
        <h3 className="font-sora font-semibold text-navy text-sm leading-snug mt-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-bold text-padi-green text-base">
            ₦{product.price.toLocaleString()}
          </span>

          {product.inStock &&
            (cartItem ? (
              <QtyControl qty={cartItem.qty} productId={product._id} compact />
            ) : (
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className={`p-2 rounded-xl transition-all duration-300 shadow-sm touch-manipulation ${
                  justAdded
                    ? "bg-emerald-500 text-white scale-90"
                    : "bg-navy text-white hover:bg-padi-green hover:shadow-md hover:shadow-padi-green/30 hover:scale-105"
                }`}>
                {justAdded ? <FiCheck size={14} /> : <FiPlus size={14} />}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// ─── LIST CARD ─────────────────────────────────────────────────────
const ListCard = ({ product, onOpenDetail, cartItem }) => {
  const dispatch = useDispatch();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-padi-green/30 hover:shadow-lg hover:shadow-padi-green/10 transition-all duration-300 cursor-pointer flex gap-0">
      <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 flex-shrink-0 relative overflow-hidden bg-gray-50">
        <ImageCarousel
          images={product.images}
          name={product.name}
          category={product.category}
          compact
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
            <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CategoryBadge category={product.category} />
              <h3 className="font-sora font-semibold text-navy text-sm sm:text-base mt-1 sm:mt-1.5 line-clamp-2">
                {product.name}
              </h3>
            </div>
            <span className="font-bold text-padi-green text-sm sm:text-lg flex-shrink-0">
              ₦{product.price.toLocaleString()}
            </span>
          </div>
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiEye size={11} /> <span className="hidden sm:inline">Tap to view details</span>
          </span>
          {product.inStock &&
            (cartItem ? (
              <QtyControl qty={cartItem.qty} productId={product._id} compact />
            ) : (
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 touch-manipulation ${
                  justAdded
                    ? "bg-emerald-500 text-white"
                    : "bg-navy text-white hover:bg-padi-green hover:shadow-md hover:shadow-padi-green/30"
                }`}>
                {justAdded ? (
                  <>
                    <FiCheck size={11} className="sm:size-[13px]" /> <span className="hidden sm:inline">Added</span>
                  </>
                ) : (
                  <>
                    <FiPlus size={11} className="sm:size-[13px]" /> <span className="hidden sm:inline">Add</span>
                  </>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// ─── SHOWCASE CARD (large editorial) ──────────────────────────────
const ShowcaseCard = ({ product, onOpenDetail, cartItem }) => {
  const dispatch = useDispatch();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 hover:border-padi-green/40 hover:shadow-2xl hover:shadow-padi-green/10 transition-all duration-500 cursor-pointer">
      <div className="aspect-[4/3] sm:aspect-[4/3] relative overflow-hidden bg-gray-50">
        <ImageCarousel
          images={product.images}
          name={product.name}
          category={product.category}
        />

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <CategoryBadge category={product.category} />
        </div>

        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span className="bg-navy text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg">
            ₦{product.price.toLocaleString()}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4 z-10">
          <span className="text-white text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5">
            <FiZap size={12} className="sm:size-[14px] text-padi-green" /> Tap for full details
          </span>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-20">
            <span className="bg-white text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="font-sora font-bold text-navy text-base sm:text-lg leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed hidden sm:block">
            {product.description}
          </p>
        )}

        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium hidden sm:block">
              Price
            </p>
            <p className="font-bold text-padi-green text-lg sm:text-2xl">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          {product.inStock &&
            (cartItem ? (
              <QtyControl qty={cartItem.qty} productId={product._id} />
            ) : (
              <button
                onClick={handleAdd}
                aria-label="Add to cart"
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 touch-manipulation ${
                  justAdded
                    ? "bg-emerald-500 text-white scale-95"
                    : "bg-padi-green text-white hover:bg-padi-green-dark shadow-lg shadow-padi-green/30 hover:shadow-padi-green/50 hover:scale-105"
                }`}>
                {justAdded ? (
                  <>
                    <FiCheck size={13} className="sm:size-[16px]" /> Added
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={13} className="sm:size-[16px]" /> <span className="hidden sm:inline">Add to Order</span>
                  </>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// ─── EXPORTED WRAPPER ──────────────────────────────────────────────
const ProductCard = ({ product, onOpenDetail, view = "grid" }) => {
  if (!product) return null;

  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((i) => i._id === product._id);

  if (view === "list")
    return (
      <ListCard
        product={product}
        onOpenDetail={onOpenDetail}
        cartItem={cartItem}
      />
    );
  if (view === "showcase")
    return (
      <ShowcaseCard
        product={product}
        onOpenDetail={onOpenDetail}
        cartItem={cartItem}
      />
    );
  return (
    <GridCard
      product={product}
      onOpenDetail={onOpenDetail}
      cartItem={cartItem}
    />
  );
};

export default ProductCard;
export { CategoryBadge, CATEGORY_META, ImageCarousel, QtyControl };
