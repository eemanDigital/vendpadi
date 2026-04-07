export const buildWhatsAppOrderLink = (vendorPhone, storeName, cartItems) => {
  if (!cartItems.length) return null;

  const lines = cartItems.map(
    (item) => `• ${item.name} x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}`
  );

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message = [
    `Hello ${storeName}! I'd like to place an order:`,
    '',
    ...lines,
    '',
    `Total: ₦${total.toLocaleString()}`,
    '',
    'Please confirm availability and delivery details. Thank you!'
  ].join('\n');

  const cleanPhone = vendorPhone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
