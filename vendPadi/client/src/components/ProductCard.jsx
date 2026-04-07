import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import {
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";

const CategoryIcon = ({ category }) => {
  const icons = {
    food: "🍔",
    fashion: "👗",
    phones: "📱",
    cakes: "🎂",
    other: "📦",
  };
  return <span className="text-4xl">{icons[category] || icons.other}</span>;
};

const ProductCard = ({ product, onOpenDetail }) => {
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const hasMultipleImages = product.images && product.images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  return (
    <div className="relative w-full h-full group/img">
      <img
        src={images[current]}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {hasMany && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 z-10">
            <FiChevronLeft size={14} className="text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110 z-10">
            <FiChevronRight size={14} className="text-gray-700" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(idx);
                }}
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

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div
      onClick={() => onOpenDetail?.(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-padi-green/30 hover:shadow-xl hover:shadow-padi-green/10 transition-all duration-300 cursor-pointer flex flex-col">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <ImageCarousel
          images={product.images}
          name={product.name}
          category={product.category}
        />

        {/* Quick view pill */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 duration-200 z-10">
          <span className="flex items-center gap-1 bg-white/95 text-gray-700 text-xs font-medium px-2.5 py-1.5 rounded-full shadow-md">
            <FiEye size={11} /> Quick view
          </span>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-sora font-semibold text-navy text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="font-bold text-padi-green text-base whitespace-nowrap">
            ₦{product.price.toLocaleString()}
          </span>
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-xl transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-padi-green hover:bg-padi-green-dark text-white shadow-md hover:shadow-lg"
              }`}>
              {added ? (
                <FiCheck className="text-sm" />
              ) : (
                <FiShoppingCart className="text-sm" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── LIST CARD ─────────────────────────────────────────────────────
const ListCard = ({ product, onOpenDetail, cartItem }) => {
  const dispatch = useDispatch();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div
      onClick={() => onOpenDetail?.(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-padi-green/30 hover:shadow-lg hover:shadow-padi-green/10 transition-all duration-300 cursor-pointer flex gap-0">
      {/* Image */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 relative overflow-hidden bg-gray-50">
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

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CategoryBadge category={product.category} />
              <h3 className="font-sora font-semibold text-navy text-base mt-1.5 line-clamp-1">
                {product.name}
              </h3>
            </div>
            <span className="font-bold text-padi-green text-lg flex-shrink-0">
              ₦{product.price.toLocaleString()}
            </span>
          </div>
          {product.description && (
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <FiEye size={11} /> Tap to view details
          </span>
          {product.inStock &&
            (cartItem ? (
              <QtyControl qty={cartItem.qty} productId={product._id} compact />
            ) : (
              <button
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  justAdded
                    ? "bg-emerald-500 text-white"
                    : "bg-navy text-white hover:bg-padi-green hover:shadow-md hover:shadow-padi-green/30"
                }`}>
                {justAdded ? (
                  <>
                    <FiCheck size={13} /> Added
                  </>
                ) : (
                  <>
                    <FiPlus size={13} /> Add
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

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  const meta = CATEGORY_META[product.category] || CATEGORY_META.other;

  return (
    <div
      onClick={() => onOpenDetail?.(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-padi-green/40 hover:shadow-2xl hover:shadow-padi-green/10 transition-all duration-500 cursor-pointer">
      {/* Image tall */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        <ImageCarousel
          images={product.images}
          name={product.name}
          category={product.category}
        />

        {/* Category floating pill */}
        <div className="absolute top-3 left-3 z-10">
          <CategoryBadge category={product.category} />
        </div>

        {/* Price floating */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-navy text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
            ₦{product.price.toLocaleString()}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
          <span className="text-white text-sm font-medium flex items-center gap-1.5">
            <FiZap size={14} className="text-padi-green" /> Tap for full details
          </span>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-20">
            <span className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-sora font-bold text-navy text-lg leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              Price
            </p>
            <p className="font-bold text-padi-green text-2xl">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          {product.inStock &&
            (cartItem ? (
              <QtyControl qty={cartItem.qty} productId={product._id} />
            ) : (
              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  justAdded
                    ? "bg-emerald-500 text-white scale-95"
                    : "bg-padi-green text-white hover:bg-padi-green-dark shadow-lg shadow-padi-green/30 hover:shadow-padi-green/50 hover:scale-105"
                }`}>
                {justAdded ? (
                  <>
                    <FiCheck size={16} /> Added
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={16} /> Add to Order
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
