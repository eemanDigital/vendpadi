import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { storeAPI } from "../api/axiosInstance";
import { buildWhatsAppOrderLink } from "../utils/whatsapp";
import toast from "react-hot-toast";
import { FiPackage, FiHome, FiChevronRight, FiShare2 } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

import StoreHeader from "../components/store/StoreHeader";
import StoreHero from "../components/store/StoreHero";
import StoreToolbar from "../components/store/StoreToolbar";
import StoreProducts from "../components/store/StoreProducts";
import StoreBottomBar from "../components/store/StoreBottomBar";
import StoreSkeleton from "../components/store/StoreSkeleton";
import ProductDetailModal from "../components/store/ProductDetailModal";
import CartDrawer from "../components/store/CartDrawer";
import WhatsAppQRModal from "../components/WhatsAppQRModal";

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const whatsappLink = useMemo(() => {
    if (!store?.vendor) return "";
    return buildWhatsAppOrderLink(
      store.vendor.phone,
      store.vendor.businessName,
      cartItems,
    );
  }, [store, cartItems]);

  const cartTotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.price * i.qty, 0),
    [cartItems],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + i.qty, 0),
    [cartItems],
  );

  const filtered = useMemo(() => {
    if (!store?.products || !search) return store?.products || [];
    const query = search.toLowerCase();
    return store.products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
  }, [store, search]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
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
      // Non-blocking
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
      toast.success("Store link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (loading) {
    return <StoreSkeleton />;
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
        <motion.div {...scaleIn} className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage size={40} className="text-gray-400" />
          </div>
          <h1 className="font-sora font-bold text-3xl text-navy mb-3">
            Store Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            This store doesn't exist or has been removed.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="bg-navy text-white px-8 py-4 rounded-2xl font-semibold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20">
            <span className="flex items-center gap-2">
              <FiHome size={18} />
              Return Home
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const { vendor } = store;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <StoreHeader
        vendor={vendor}
        onBack={() => navigate(-1)}
        onShare={handleShare}
        copied={copied}
      />

      <StoreHero vendor={vendor} />

      <StoreToolbar
        search={search}
        setSearch={setSearch}
        view={view}
        setView={setView}
      />

      <StoreProducts
        products={filtered || []}
        view={view}
        search={search}
        setSearch={setSearch}
        onOpenDetail={setSelectedProduct}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSlug={store?.vendor?.slug}
      />

      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onOrder={handleOrder}
      />

      <StoreBottomBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setShowCart(true)}
        onOrderClick={handleOrder}
        onQRClick={() => setShowQRModal(true)}
      />

      <WhatsAppQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        whatsappLink={whatsappLink}
        storeName={store?.vendor?.businessName}
      />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            {...scaleIn}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-4 z-30 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center hover:shadow-2xl transition-all">
            <FiChevronRight className="text-navy rotate-[-90deg]" size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Storefront;
