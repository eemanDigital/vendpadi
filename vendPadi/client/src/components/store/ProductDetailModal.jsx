import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiCheck, FiShoppingCart, FiShare2, FiStar, FiMessageSquare, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { CategoryBadge, ImageCarousel } from "../ProductCard";
import QtyControl from "../ui/QtyControl";
import RatingStars from "../ui/RatingStars";
import ReviewForm from "./ReviewForm";
import { trackingAPI } from "../../api/axiosInstance";

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

const ProductDetailModal = ({ product, onClose, storeSlug, vendorId }) => {
  if (!product) return null;

  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const [justAdded, setJustAdded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const modalRef = useRef(null);

  const cartItem = cartItems.find((i) => i._id === product._id);

  const productLink = useMemo(() => {
    return `${window.location.origin}/store/${storeSlug || 'store'}?product=${product._id}`;
  }, [storeSlug, product._id]);

  const fetchReviews = async () => {
    if (!product?._id) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews/product/${product._id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (showReviews) {
      fetchReviews();
    }
  }, [showReviews, product?._id]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (product && product._id && storeSlug) {
      trackingAPI.trackProductView(storeSlug, product._id).catch(() => {});
    }
  }, [product?._id, storeSlug]);

  const handleAdd = () => {
    dispatch(addItem(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    toast.success(`Added ${product.name} to order`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  const shareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - NGN${product.price.toLocaleString()}`,
      url: productLink,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        setShowQR(true);
      }
    } else {
      setShowQR(true);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("product-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${product.name.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    fetchReviews();
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

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
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <CategoryBadge category={product.category} />
                {product.inStock && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    In Stock{product.stock > 0 ? ` (${product.stock})` : ''}
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

              {/* Reviews Section */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="w-full flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <FiMessageSquare size={16} className="text-gray-400" />
                      <span className="font-medium text-navy text-sm">Reviews</span>
                      <span className="text-xs text-gray-400">({reviews.length})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reviews.length > 0 && (
                      <RatingStars rating={averageRating} size={14} />
                    )}
                    <FiChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${showReviews ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {showReviews && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-3"
                  >
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="w-full py-2.5 px-4 bg-padi-green/10 hover:bg-padi-green/20 text-padi-green rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FiStar size={14} />
                      Write a Review
                    </button>

                    {showReviewForm && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <ReviewForm
                          productId={product._id}
                          vendorId={product.vendorId}
                          onSuccess={handleReviewSubmit}
                        />
                      </div>
                    )}

                    {reviewsLoading ? (
                      <div className="text-center py-4 text-gray-400 text-sm">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <p className="text-center py-4 text-gray-400 text-sm">No reviews yet. Be the first!</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {reviews.map((review) => (
                          <div key={review._id} className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="font-medium text-navy text-sm">{review.customerName}</p>
                                <p className="text-xs text-gray-400">
                                  {new Date(review.createdAt).toLocaleDateString('en-NG', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <RatingStars rating={review.rating} size={12} />
                            </div>
                            {review.comment && (
                              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
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
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={shareProduct}
                    className="w-14 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors flex-shrink-0">
                    <FiShare2 size={20} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdd}
                    className={`flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
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
                </div>
              )}
            </div>
          )}

          {showQR && (
            <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
              <div className="bg-white rounded-3xl w-full max-w-xs overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-padi-green to-[#128C7E] px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-white font-semibold">Share Product</span>
                  </div>
                  <button onClick={() => setShowQR(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                    <FiX className="text-white" size={16} />
                  </button>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <p className="font-semibold text-navy text-center mb-3">{product?.name}</p>
                  <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                    {productLink ? (
                      <QRCode
                        id="product-qr"
                        value={productLink}
                        size={160}
                        level="H"
                        bgColor="#f9fafb"
                        fgColor="#1a1a2e"
                      />
                    ) : (
                      <div className="w-[160px] h-[160px] flex items-center justify-center text-gray-400 text-sm">
                        No link available
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mb-4">Scan to view product</p>
                  <button
                    onClick={downloadQR}
                    className="w-full py-3 bg-navy hover:bg-navy/90 text-white rounded-xl font-medium text-sm transition-colors">
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
