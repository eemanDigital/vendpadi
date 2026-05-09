import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import StockBadge from "./ui/StockBadge";
import WishlistButton from "./store/WishlistButton";
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
  const [loaded, setLoaded] = useState({});
  const [animating, setAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasMany = images && images.length > 1;
  const slidesRef = useRef({});
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const dotsRef = useRef(null);
  const kenBurns = useRef(null);
  const skeletonRef = useRef(null);

  useEffect(() => {
    if (!images?.length) return;
    const anyLoaded = Object.values(loaded).some(Boolean);
    if (anyLoaded && skeletonRef.current) {
      gsap.to(skeletonRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }
    if (loaded[current]) {
      const el = slidesRef.current[current];
      if (el) {
        gsap.set(el, { opacity: 1 });
      }
    }
  }, [loaded, current, images]);

  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        opacity: isHovered && hasMany ? 1 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [isHovered, hasMany]);

  useEffect(() => {
    if (dotsRef.current) {
      const dots = gsap.utils.toArray(dotsRef.current.children);
      gsap.to(dots, {
        width: (i) => i === current ? 22 : 6,
        backgroundColor: (i) => i === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
        duration: 0.35,
        ease: "back.out(3)",
        overwrite: "auto",
      });
    }
  }, [current]);

  useEffect(() => {
    const el = slidesRef.current[current];
    if (!el || !loaded[current]) return;

    kenBurns.current?.kill();
    kenBurns.current = gsap.timeline({ repeat: -1, yoyo: true })
      .to(el, { scale: 1.07, duration: 5, ease: "sine.inOut" });

    return () => kenBurns.current?.kill();
  }, [current, loaded]);

  useEffect(() => {
    return () => kenBurns.current?.kill();
  }, []);

  const goTo = (dir) => {
    if (animating || !hasMany) return;
    setAnimating(true);

    const next = (current + dir + images.length) % images.length;
    const currentEl = slidesRef.current[current];
    const nextEl = slidesRef.current[next];

    if (!currentEl || !nextEl) {
      setCurrent(next);
      setAnimating(false);
      return;
    }

    kenBurns.current?.kill();
    gsap.killTweensOf(currentEl);
    gsap.killTweensOf(nextEl);

    gsap.set(nextEl, {
      x: dir * 80,
      scale: 0.85,
      opacity: 0,
      rotation: dir * -6,
      filter: "blur(4px)",
    });
    gsap.set(nextEl, { zIndex: 2 });
    gsap.set(currentEl, { zIndex: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(nextEl, { filter: "blur(0px)" });
        setCurrent(next);
        setAnimating(false);
      }
    });

    tl.to(currentEl, {
      x: dir * -50,
      scale: 0.8,
      opacity: 0,
      rotation: dir * 5,
      filter: "blur(6px)",
      duration: 0.35,
      ease: "power2.in",
    }, 0);

    tl.to(nextEl, {
      x: 0,
      scale: 1,
      opacity: 1,
      rotation: 0,
      filter: "blur(0px)",
      duration: 0.5,
      ease: "back.out(1.7)",
    }, 0.12);

    tl.to(navRef.current?.children || [], {
      scale: 0.92,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    }, 0);
  };

  if (!images || images.length === 0) {
    const meta = CATEGORY_META[category] || CATEGORY_META.other;
    return (
      <div className={`w-full h-full flex items-center justify-center ${meta.bg}`}>
        <CategoryIcon category={category} size={48} className={meta.text} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={skeletonRef}
        className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 z-10"
      />
      {images.map((src, idx) => (
        <img
          key={src}
          ref={(el) => { if (el) slidesRef.current[idx] = el; }}
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded((prev) => ({ ...prev, [idx]: true }))}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: 0,
            zIndex: idx === current ? 2 : 1,
            pointerEvents: "none",
          }}
        />
      ))}
      <div
        ref={navRef}
        className="absolute inset-0 flex items-center justify-between px-2 z-20"
        style={{ opacity: 0, pointerEvents: isHovered && hasMany ? "auto" : "none" }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); goTo(-1); }}
          className="w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <FiChevronLeft size={16} className="text-gray-700" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goTo(1); }}
          className="w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <FiChevronRight size={16} className="text-gray-700" />
        </button>
      </div>
      {hasMany && (
        <div ref={dotsRef} className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, idx) => (
            <div
              key={idx}
              className="h-1.5 rounded-full"
              style={{
                backgroundColor: idx === 0 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                width: idx === 0 ? 22 : 6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GridCard = ({ product, onOpenDetail, index = 0 }) => {
  if (!product) return null;

  const cardRef = useRef(null);
  const imageWrapRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayTextRef = useRef(null);
  const badgeRef = useRef(null);
  const wishlistRef = useRef(null);
  const stockBarRef = useRef(null);
  const stockLabelRef = useRef(null);
  const hoverTl = useRef(null);
  const overlayTl = useRef(null);
  const initialized = useRef(false);

  const stockPercent = product.stock > 0 ? Math.min(100, (product.stock / (product.lowStockThreshold || 5) * 100)) : 0;
  const isLow = product.lowStockAlert;
  const isOut = !product.inStock;
  const isFlashSale = product.isFlashSaleActive;
  const flashSalePrice = product.flashSale?.discountPrice;
  const discountPct = product.discountPercentage;

  useEffect(() => {
    if (initialized.current || !cardRef.current) return;
    initialized.current = true;

    hoverTl.current = gsap.timeline({ paused: true })
      .to(cardRef.current, { y: -4, duration: 0.3, ease: "power2.out" }, 0)
      .to(imageWrapRef.current, { scale: 1.05, duration: 0.4, ease: "power2.out" }, 0);

    overlayTl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0)
      .to(overlayTextRef.current, { y: 0, opacity: 1, duration: 0.2, ease: "back.out(2)" }, 0.1);

    gsap.fromTo(
      badgeRef.current?.children || [],
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.1, ease: "power2.out" }
    );

    gsap.fromTo(
      wishlistRef.current?.children || [],
      { opacity: 0, x: 10 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.15, ease: "power2.out" }
    );

    if (stockBarRef.current) {
      gsap.fromTo(stockBarRef.current,
        { width: "0%" },
        { width: `${stockPercent}%`, duration: 0.5, delay: 0.3, ease: "power2.out" }
      );
    }

    if (stockLabelRef.current) {
      gsap.fromTo(stockLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.2 });
    }
  }, []);

  useEffect(() => {
    if (stockBarRef.current) {
      gsap.fromTo(stockBarRef.current,
        { width: "0%" },
        { width: `${stockPercent}%`, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [stockPercent]);

  const handleMouseEnter = () => {
    hoverTl.current?.play();
    overlayTl.current?.play();
  };

  const handleMouseLeave = () => {
    hoverTl.current?.reverse();
    overlayTl.current?.reverse();
  };

  const handleCardClick = () => {
    if (onOpenDetail) onOpenDetail(product);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 active:scale-[0.98] transition-all duration-300 cursor-pointer flex flex-col shadow-sm hover:shadow-xl"
    >
      <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div ref={imageWrapRef} className="w-full h-full">
          <ImageCarousel images={product.images} name={product.name} category={product.category} />
        </div>

        <div ref={badgeRef} className="absolute top-2 left-2 z-10 flex gap-1.5 flex-wrap">
          {isFlashSale && !isOut && (
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] px-2 py-1 rounded-lg font-bold shadow-lg flex items-center gap-1">
              <FiZap size={10} />
              {discountPct}% OFF
            </span>
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
        </div>

        <div ref={wishlistRef} className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
          <WishlistButton product={product} size="sm" />
          <CategoryBadge category={product.category} />
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-4"
          style={{ opacity: 0 }}
        >
          <span
            ref={overlayTextRef}
            className="bg-white/95 text-navy text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
            style={{ opacity: 0, y: 10 }}
          >
            <FiEye size={14} />
            View Details
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-sora font-bold text-navy text-xs sm:text-sm leading-tight line-clamp-2 mb-2 sm:mb-3">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex flex-col">
            {isFlashSale ? (
              <>
                <span className="font-bold text-base sm:text-lg text-red-500">
                  ₦{flashSalePrice?.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-bold text-base sm:text-lg text-padi-green">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock > 0 && (
            <StockBadge stock={product.stock} threshold={product.lowStockThreshold || 5} size="sm" />
          )}
        </div>

        {product.stock > 0 && (
          <div className="mt-auto hidden sm:block">
            <div ref={stockLabelRef} className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">Stock Level</span>
              <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-gray-700'}`}>
                {product.stock} units
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                ref={stockBarRef}
                className={`h-full rounded-full ${isLow ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ListCard = ({ product, onOpenDetail, index = 0 }) => {
  if (!product) return null;

  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const hoverTl = useRef(null);
  const initialized = useRef(false);

  const isLow = product.lowStockAlert;
  const isOut = !product.inStock;
  const isFlashSale = product.isFlashSaleActive;
  const flashSalePrice = product.flashSale?.discountPrice;

  useEffect(() => {
    if (initialized.current || !cardRef.current) return;
    initialized.current = true;

    hoverTl.current = gsap.timeline({ paused: true })
      .to(cardRef.current, { x: 4, duration: 0.3, ease: "power2.out" }, 0)
      .to(imageRef.current, { scale: 1.05, duration: 0.3, ease: "power2.out" }, 0);
  }, []);

  const handleMouseEnter = () => hoverTl.current?.play();
  const handleMouseLeave = () => hoverTl.current?.reverse();

  const handleCardClick = () => {
    if (onOpenDetail) onOpenDetail(product);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer flex"
    >
      <div
        ref={imageRef}
        className="w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <ImageCarousel images={product.images} name={product.name} category={product.category} />

        <div className="absolute top-1 right-1 z-10">
          <WishlistButton product={product} size="sm" />
        </div>

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
      </div>

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
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 bg-gray-50 px-1.5 sm:px-2 py-1 rounded-lg">
            <FiEye size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">View</span>
          </div>
        </div>
      </div>
    </div>
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
