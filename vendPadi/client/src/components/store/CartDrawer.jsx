import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiShoppingCart, FiMessageCircle, FiInfo, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import CartItemRow from "./CartItemRow";

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

const drawerSlide = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
};

const CartDrawer = ({ isOpen, onClose, onOrder }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...fadeIn}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            {...drawerSlide}
            transition={springTransition}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="px-5 py-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-navy to-navy/80 rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
                    <FiShoppingCart className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-navy text-lg">
                      Your Order
                    </h3>
                    <p className="text-xs text-gray-400">
                      {cartCount} item{cartCount !== 1 ? "s" : ""} - NGN
                      {cartTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                  <FiX size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-5">
                    <FiShoppingCart size={32} className="text-gray-300" />
                  </div>
                  <p className="font-sora font-semibold text-gray-400 text-lg">
                    Your order is empty
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add delicious items to get started
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="mt-6 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors">
                    Browse Menu
                  </motion.button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <CartItemRow key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-100 p-5 space-y-4 bg-white">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-navy">
                      NGN{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="text-padi-green font-medium">
                      To be confirmed
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-navy">Total</span>
                    <span className="font-bold text-padi-green text-xl">
                      NGN{cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onOrder}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all">
                  <FiMessageCircle size={20} />
                  Send Order via WhatsApp
                </motion.button>

                <div className="flex items-start gap-2 text-xs text-gray-400 bg-blue-50/50 p-3 rounded-xl">
                  <FiInfo size={14} className="mt-0.5 flex-shrink-0" />
                  <p>
                    Your order will be sent via WhatsApp. The vendor will
                    confirm availability and arrange delivery.
                  </p>
                </div>

                <button
                  onClick={() => {
                    dispatch(clearCart());
                    toast.success("Order cleared");
                  }}
                  className="w-full text-gray-400 hover:text-red-500 font-medium text-sm flex items-center justify-center gap-1.5 py-2 transition-colors">
                  <FiTrash2 size={14} /> Clear Order
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
