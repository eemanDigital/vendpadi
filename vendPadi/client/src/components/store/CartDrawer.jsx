import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryInfo, clearCart } from "../../store/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiShoppingCart, FiMessageCircle, FiInfo, FiTrash2, FiChevronDown, FiCheck, FiArrowRight, FiTruck } from "react-icons/fi";
import toast from "react-hot-toast";
import CartItemRow from "./CartItemRow";

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

const CartDrawer = ({ isOpen, onClose, onOrder, deliveryZones }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  
  const hasDeliveryZones = deliveryZones?.enabled && deliveryZones?.zones?.length > 0;
  const [selectedZone, setSelectedZone] = useState(deliveryZones?.defaultZone || '');
  const [showZoneSelector, setShowZoneSelector] = useState(false);
  
  const selectedDeliveryZone = deliveryZones?.zones?.find(z => z.name === selectedZone);
  const deliveryFee = selectedDeliveryZone?.fee || 0;
  const totalWithDelivery = cartTotal + deliveryFee;

  const deliveryInfo = hasDeliveryZones && selectedZone ? {
    zone: selectedZone,
    fee: deliveryFee,
    estimatedDays: selectedDeliveryZone?.estimatedDays
  } : null;

  const handleSendOrder = async () => {
    if (deliveryInfo && deliveryInfo.zone) {
      dispatch(setDeliveryInfo(deliveryInfo));
    }
    onClose();
    if (onOrder) {
      onOrder(deliveryInfo);
    }
  };

  const activeZones = deliveryZones?.zones?.filter(z => z.isActive) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...fadeIn}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            {...drawerSlide}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <motion.div className="px-4 py-4 border-b border-gray-100 flex-shrink-0 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                    <FiShoppingCart className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">Your Order</h3>
                    <p className="text-xs text-gray-400">{cartCount} item{cartCount !== 1 ? "s" : ""} • ₦{cartTotal.toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-9 h-9 hover:bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiX size={20} className="text-gray-500" />
                </button>
              </div>
            </motion.div>

            {hasDeliveryZones && (
              <motion.div 
                className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex-shrink-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiTruck size={14} className="text-amber-600" />
                  <span className="text-xs font-medium text-amber-800">Delivery Zone</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowZoneSelector(!showZoneSelector)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-sm"
                  >
                    <span className={selectedZone ? 'text-navy font-medium' : 'text-gray-400'}>
                      {selectedZone || 'Select zone'}
                    </span>
                    <FiChevronDown className={`text-gray-400 transition-transform ${showZoneSelector ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showZoneSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-amber-200 rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto"
                      >
                        {activeZones.map((zone) => (
                          <button
                            key={zone.name}
                            onClick={() => { setSelectedZone(zone.name); setShowZoneSelector(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50 transition-colors ${selectedZone === zone.name ? 'bg-amber-50' : ''}`}
                          >
                            <div className="text-left">
                              <p className="font-medium text-sm text-navy">{zone.name}</p>
                              <p className="text-xs text-gray-500">{zone.estimatedDays}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">₦{zone.fee.toLocaleString()}</span>
                              {selectedZone === zone.name && <FiCheck size={14} className="text-amber-600" />}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {selectedZone && (
                  <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1">
                    <span>Delivery: <strong>₦{deliveryFee.toLocaleString()}</strong></span>
                    {selectedDeliveryZone?.estimatedDays && <span>• {selectedDeliveryZone.estimatedDays}</span>}
                  </p>
                )}
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingCart size={28} className="text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-400 text-base">Your order is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
                  <button onClick={onClose} className="mt-6 bg-navy text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItemRow key={item._id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <motion.div className="flex-shrink-0 border-t border-gray-100 p-4 space-y-3 bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-navy">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  {hasDeliveryZones && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery {selectedZone && `(${selectedZone})`}</span>
                      <span className={deliveryFee > 0 ? 'font-medium' : 'text-green-600 font-medium'}>
                        {selectedZone ? (deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : 'Free') : 'Select zone'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold text-navy">Total</span>
                    <span className="font-bold text-padi-green text-lg">₦{totalWithDelivery.toLocaleString()}</span>
                  </div>
                </div>

                {!hasDeliveryZones && (
                  <p className="text-xs text-gray-400 flex items-start gap-1.5 bg-blue-50 p-2 rounded-lg">
                    <FiInfo size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    Delivery fee will be confirmed by the vendor
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOrder}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <FiMessageCircle size={18} />
                  Send Order via WhatsApp
                </motion.button>

                <button
                  onClick={() => { dispatch(clearCart()); toast.success("Order cleared"); }}
                  className="w-full text-gray-400 hover:text-red-500 text-sm py-2 transition-colors"
                >
                  Clear Order
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;