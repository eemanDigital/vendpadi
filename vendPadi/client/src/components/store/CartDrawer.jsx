import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeliveryInfo, clearCart } from "../../store/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiShoppingCart, FiMessageCircle, FiInfo, FiTrash2, FiChevronDown, FiCheck, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import CartItemRow from "./CartItemRow";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const easeOutExpo = [0.16, 1, 0.3, 1];

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            {...drawerSlide}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <motion.div 
              className="px-5 py-5 border-b border-gray-100 flex-shrink-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <motion.div 
                    className="w-11 h-11 bg-gradient-to-br from-navy to-navy/80 rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShoppingCart className="text-white" size={20} />
                  </motion.div>
                  <div>
                    <h3 className="font-sora font-bold text-navy text-lg">
                      Your Order
                    </h3>
                    <p className="text-xs text-gray-400">
                      {cartCount} item{cartCount !== 1 ? "s" : ""} - ₦{cartTotal.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-all text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </motion.button>
              </div>
            </motion.div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {cartItems.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-5"
                  >
                    <FiShoppingCart size={32} className="text-gray-300" />
                  </motion.div>
                  <motion.p 
                    className="font-sora font-semibold text-gray-400 text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Your order is empty
                  </motion.p>
                  <motion.p 
                    className="text-sm text-gray-400 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Add items to get started
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="mt-6 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
                  >
                    Browse Menu
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  className="divide-y divide-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CartItemRow item={item} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {cartItems.length > 0 && (
              <motion.div 
                className="flex-shrink-0 border-t border-gray-100 p-5 space-y-4 bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 space-y-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-navy">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  
                  {hasDeliveryZones ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Delivery Zone</span>
                        </div>
                        <div className="relative">
                          <motion.button
                            onClick={() => setShowZoneSelector(!showZoneSelector)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                          >
                            <span className={selectedZone ? 'text-navy font-medium' : 'text-gray-400'}>
                              {selectedZone || 'Select delivery zone'}
                            </span>
                            <motion.div
                              animate={{ rotate: showZoneSelector ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FiChevronDown className="text-gray-400" />
                            </motion.div>
                          </motion.button>
                          
                          <AnimatePresence>
                            {showZoneSelector && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                              >
                                {deliveryZones.zones.filter(z => z.isActive).map((zone) => (
                                  <motion.button
                                    key={zone.name}
                                    onClick={() => {
                                      setSelectedZone(zone.name);
                                      setShowZoneSelector(false);
                                    }}
                                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${selectedZone === zone.name ? 'bg-padi-green/5' : ''}`}
                                  >
                                    <div className="text-left">
                                      <p className="font-medium text-sm text-navy">{zone.name}</p>
                                      <p className="text-xs text-gray-500">{zone.estimatedDays}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm">₦{zone.fee.toLocaleString()}</span>
                                      {selectedZone === zone.name && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="text-padi-green"
                                        >
                                          <FiCheck size={16} />
                                        </motion.div>
                                      )}
                                    </div>
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span className={deliveryFee > 0 ? 'text-padi-green font-medium' : 'text-green-600 font-medium'}>
                          {deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="text-padi-green font-medium">
                        To be confirmed
                      </span>
                    </div>
                  )}
                  
                  <motion.div 
                    className="pt-3 border-t border-gray-200 flex justify-between items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="font-bold text-navy">Total</span>
                    <motion.span 
                      className="font-bold text-padi-green text-xl"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      ₦{totalWithDelivery.toLocaleString()}
                    </motion.span>
                  </motion.div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 8px 25px rgba(37, 211, 102, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendOrder}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all"
                >
                  <FiMessageCircle size={20} />
                  <span>Send Order via WhatsApp</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                  >
                    <FiArrowRight size={18} />
                  </motion.span>
                </motion.button>

                <motion.div 
                  className="flex items-start gap-2 text-xs text-gray-400 bg-blue-50/50 p-3 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <FiInfo size={14} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  <p>
                    Your order will be sent via WhatsApp. The vendor will
                    confirm availability and arrange delivery.
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    dispatch(clearCart());
                    toast.success("Order cleared");
                  }}
                  className="w-full text-gray-400 hover:text-red-500 font-medium text-sm flex items-center justify-center gap-1.5 py-2 transition-colors"
                >
                  <FiTrash2 size={14} /> Clear Order
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;