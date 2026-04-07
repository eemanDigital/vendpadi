import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  removeItem,
  incrementQty,
  decrementQty,
  clearCart,
} from "../store/cartSlice";
import { storeAPI } from "../api/axiosInstance";
import { buildWhatsAppOrderLink } from "../utils/whatsapp";
import ProductCard, {
  CategoryBadge,
  CATEGORY_META,
  ImageCarousel,
  QtyControl,
} from "../components/ProductCard";
import toast from "react-hot-toast";
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiMessageCircle,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiPackage,
  FiGrid,
  FiList,
  FiMaximize2,
  FiSearch,
  FiShare2,
  FiZap,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

// ─── PRODUCT DETAIL MODAL ──────────────────────────────────────────
const ProductDetailModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const cartItem = cartItems.find((i) => i._id === product._id);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Image area */}
        <div className="relative aspect-square sm:aspect-[4/3] flex-shrink-0 bg-gray-50 overflow-hidden">
          <ImageCarousel
            images={product.images}
            name={product.name}
            category={product.category}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/95 hover:bg-white text-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20">
            <FiX size={16} />
          </button>

          {/* Category */}
          <div className="absolute top-4 left-4 z-20">
            <CategoryBadge category={product.category} />
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-20">
              <span className="bg-white text-gray-700 px-5 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-sora font-bold text-2xl text-navy leading-tight">
                {product.name}
              </h2>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Price
              </p>
              <p className="font-bold text-3xl text-padi-green">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </div>

          {product.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>
          )}

          {/* Stock badge */}
          <div
            className={`mt-4 flex items-center gap-2 text-sm font-medium ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
            <span
              className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`}
            />
            {product.inStock
              ? "In stock — ready to order"
              : "Currently out of stock"}
          </div>
        </div>

        {/* Footer CTA */}
        {product.inStock && (
          <div className="p-5 border-t border-gray-100 bg-white">
            {cartItem ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">In your order</p>
                  <p className="font-bold text-navy">
                    ₦{(product.price * cartItem.qty).toLocaleString()}
                  </p>
                </div>
                <QtyControl qty={cartItem.qty} productId={product._id} />
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                  justAdded
                    ? "bg-emerald-500 text-white"
                    : "bg-navy hover:bg-padi-green text-white shadow-lg hover:shadow-padi-green/30"
                }`}>
                {justAdded ? (
                  <>
                    <FiCheck size={18} /> Added to Order
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={18} /> Add to Order
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CART ITEM ROW ─────────────────────────────────────────────────
const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();
  const meta = CATEGORY_META[item.category] || CATEGORY_META.other;

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0">
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-xl ${meta.bg}`}>
            {meta.icon}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-navy text-sm truncate">{item.name}</p>
        <p className="text-padi-green font-bold text-sm mt-0.5">
          ₦{item.price.toLocaleString()} each
        </p>
        {/* Qty stepper */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => dispatch(decrementQty(item._id))}
              className="w-7 h-7 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors">
              <FiMinus size={11} />
            </button>
            <span className="w-8 text-center font-bold text-navy text-sm">
              {item.qty}
            </span>
            <button
              onClick={() => dispatch(incrementQty(item._id))}
              className="w-7 h-7 flex items-center justify-center hover:bg-padi-green/20 hover:text-padi-green transition-colors">
              <FiPlus size={11} />
            </button>
          </div>
          <button
            onClick={() => dispatch(removeItem(item._id))}
            className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-navy text-sm">
          ₦{(item.price * item.qty).toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">×{item.qty}</p>
      </div>
    </div>
  );
};

// ─── CART DRAWER ───────────────────────────────────────────────────
const CartDrawer = ({ isOpen, onClose, onOrder, store }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const itemCount = cartItems.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                <FiShoppingCart className="text-white" size={18} />
              </div>
              <div>
                <h3 className="font-sora font-bold text-navy text-lg">
                  Your Order
                </h3>
                <p className="text-xs text-gray-400">
                  {cartCount} item{cartCount !== 1 ? "s" : ""} • {itemCount}{" "}
                  product{itemCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors">
              <FiX size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
                <FiShoppingCart size={28} className="text-gray-300" />
              </div>
              <p className="font-sora font-semibold text-gray-400">
                Your order is empty
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Add items from the store
              </p>
              <button
                onClick={onClose}
                className="mt-5 text-padi-green font-semibold text-sm hover:underline">
                Browse products
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cartItems.map((item) => (
                <CartItemRow key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 p-5 space-y-3 bg-white">
            {/* Order summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({cartCount} items)</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span className="text-padi-green font-medium">
                  TBD by vendor
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-navy">
                <span>Total</span>
                <span className="text-padi-green text-lg">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={onOrder}
              className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <FiMessageCircle size={20} />
              Send Order via WhatsApp
            </button>

            {/* Hint */}
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <FiInfo size={12} className="mt-0.5 flex-shrink-0" />
              <p>
                WhatsApp will open with your order pre-filled. The vendor will
                confirm and arrange delivery.
              </p>
            </div>

            {/* Clear */}
            <button
              onClick={() => dispatch(clearCart())}
              className="w-full text-gray-400 hover:text-red-500 font-medium text-sm flex items-center justify-center gap-1.5 py-2 transition-colors">
              <FiTrash2 size={14} /> Clear order
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ─── VIEW TOGGLE ───────────────────────────────────────────────────
const ViewToggle = ({ view, setView }) => {
  const views = [
    { key: "grid", icon: <FiGrid size={15} />, label: "Grid" },
    { key: "list", icon: <FiList size={15} />, label: "List" },
    { key: "showcase", icon: <FiMaximize2 size={15} />, label: "Showcase" },
  ];
  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => setView(v.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            view === v.key
              ? "bg-white text-navy shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}>
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─── STOREFRONT PAGE ───────────────────────────────────────────────
const Storefront = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await storeAPI.getStore(slug);
        setStore(data);
      } catch {
        toast.error("Store not found");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [slug]);

  const handleOrder = useCallback(async () => {
    if (!cartItems.length || !store) return;
    try {
      await storeAPI.createOrder(slug, {
        items: cartItems.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        totalAmount: cartTotal,
      });
    } catch {
      // non-blocking
    }
    const waLink = buildWhatsAppOrderLink(
      store.vendor.phone,
      store.vendor.businessName,
      cartItems,
    );
    if (waLink) {
      window.open(waLink, "_blank");
      dispatch(clearCart());
      setShowCart(false);
      toast.success("WhatsApp opened with your order!");
    }
  }, [cartItems, store, cartTotal, slug, dispatch]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Store link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-padi-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-sm">Loading store…</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-xs">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
            🔍
          </div>
          <h1 className="font-sora font-bold text-2xl text-navy mb-2">
            Store Not Found
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            This store doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-padi-green transition-colors">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { vendor, products } = store;
  const meta = CATEGORY_META[vendor.category] || CATEGORY_META.other;

  // Filter by search
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase()),
  );

  // Grid class by view
  const gridClass = {
    grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
    list: "flex flex-col gap-3",
    showcase: "grid grid-cols-1 sm:grid-cols-2 gap-5",
  }[view];

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* ── TOP NAV ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
            <FiArrowLeft size={18} className="text-gray-600" />
          </button>

          {/* Logo */}
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">{meta.icon}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-sora font-bold text-navy text-sm truncate leading-tight">
              {vendor.businessName}
            </p>
            <CategoryBadge category={vendor.category} />
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
            {copied ? (
              <FiCheck size={16} className="text-padi-green" />
            ) : (
              <FiShare2 size={16} className="text-gray-500" />
            )}
          </button>
        </div>
      </header>

      {/* ── VENDOR HERO BANNER ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start gap-5">
            {/* Logo large */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 flex-shrink-0 shadow-md flex items-center justify-center bg-gray-50">
              {vendor.logo ? (
                <img
                  src={vendor.logo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">{meta.icon}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-sora font-bold text-2xl text-navy leading-tight">
                {vendor.businessName}
              </h1>
              <div className="mt-1.5">
                <CategoryBadge category={vendor.category} />
              </div>
              {vendor.description && (
                <p className="text-sm text-gray-500 mt-2.5 leading-relaxed line-clamp-3">
                  {vendor.description}
                </p>
              )}

              {/* Stats strip */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-padi-green animate-pulse" />
                  <span>Store is open</span>
                </div>
                <span className="text-gray-200">|</span>
                <span className="text-xs text-gray-500">
                  {products.length} products
                </span>
                <span className="text-gray-200">|</span>
                <span className="text-xs text-gray-500">
                  Orders via WhatsApp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR: Search + View Toggle ── */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
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
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-40">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-sora font-bold text-navy text-lg">
              {search ? `Results for "${search}"` : "All Products"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length} of {products.length} products
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage size={32} className="text-gray-300" />
            </div>
            <h3 className="font-sora font-semibold text-navy text-lg mb-1">
              {search ? "No results found" : "No Products Yet"}
            </h3>
            <p className="text-gray-400 text-sm">
              {search
                ? `Try a different search term`
                : "This store hasn't added any products."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-padi-green font-semibold text-sm hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className={gridClass}>
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpenDetail={setSelectedProduct}
                view={view}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── PRODUCT DETAIL MODAL ── */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* ── CART DRAWER ── */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onOrder={handleOrder}
        store={store}
      />

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Cart summary / empty state */}
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 flex-1 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-2xl transition-colors text-left">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${cartCount > 0 ? "bg-navy" : "bg-gray-200"}`}>
                <FiShoppingCart
                  size={17}
                  className={cartCount > 0 ? "text-white" : "text-gray-400"}
                />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-padi-green text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </div>
            <div>
              {cartCount > 0 ? (
                <>
                  <p className="font-semibold text-navy text-sm">
                    {cartCount} item{cartCount !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-xs text-gray-400">Tap to review order</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-400 text-sm">
                    No items selected
                  </p>
                  <p className="text-xs text-gray-300">Tap products to add</p>
                </>
              )}
            </div>
          </button>

          {/* Order CTA */}
          <button
            onClick={cartCount > 0 ? handleOrder : undefined}
            disabled={cartCount === 0}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 flex-shrink-0 ${
              cartCount > 0
                ? "bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-lg shadow-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}>
            <FiMessageCircle size={17} />
            <span className="hidden sm:inline">Order via</span> WhatsApp
            {cartCount > 0 && (
              <span className="bg-white/25 px-2 py-0.5 rounded-lg text-xs font-bold">
                ₦{cartTotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Storefront;
