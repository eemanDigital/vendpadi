import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiCheck, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { CategoryBadge, ImageCarousel, QtyControl, CATEGORY_META } from "../ProductCard";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const [justAdded, setJustAdded] = useState(false);
  const modalRef = useRef(null);

  const cartItem = cartItems.find((i) => i._id === product._id);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleAdd = () => {
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    toast.success(`Added ${product.name} to order`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        {...fadeIn}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}>
        <motion.div
          ref={modalRef}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={springTransition}
          className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}>
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="font-sora font-bold text-navy text-lg truncate">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge category={product.category} />
                {product.inStock && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    In Stock
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0">
              <FiX size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100">
              <ImageCarousel
                images={product.images}
                name={product.name}
                category={product.category}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 space-y-5">
              <div className="bg-gradient-to-br from-navy/5 to-padi-green/5 rounded-2xl p-4 border border-navy/10">
                <p className="text-xs text-gray-500 mb-1">Price</p>
                <p className="font-bold text-padi-green text-3xl">
                  NGN{product.price.toLocaleString()}
                </p>
              </div>

              {product.description && (
                <div>
                  <h4 className="font-sora font-semibold text-navy text-sm mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Category</p>
                  <p className="text-sm font-semibold text-navy capitalize">
                    {product.category}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">SKU</p>
                  <p className="text-sm font-mono text-navy">
                    #{product._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {product.inStock && (
            <div className="p-5 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
              {cartItem ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">In your order</p>
                    <p className="font-bold text-navy text-xl">
                      NGN{(product.price * cartItem.qty).toLocaleString()}
                    </p>
                  </div>
                  <QtyControl
                    qty={cartItem.qty}
                    productId={product._id}
                    size="lg"
                  />
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                    justAdded
                      ? "bg-emerald-500 text-white"
                      : "bg-navy hover:bg-navy/90 text-white shadow-lg shadow-navy/20"
                  }`}>
                  {justAdded ? (
                    <>
                      <FiCheck size={18} />
                      Added to Order
                    </>
                  ) : (
                    <>
                      <FiShoppingCart size={18} />
                      Add to Order - NGN{product.price.toLocaleString()}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
