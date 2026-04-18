export const buildWhatsAppOrderLink = (vendorPhone, storeName, cartItems, deliveryInfo = null) => {
  if (!cartItems.length) return null;

  const lines = cartItems.map(
    (item) => `• ${item.name} x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}`
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = deliveryInfo?.fee || 0;
  const total = subtotal + deliveryFee;

  const messageParts = [
    `Hello ${storeName}! I'd like to place an order:`,
    '',
    ...lines,
    '',
  ];

  if (deliveryFee > 0) {
    messageParts.push(`Subtotal: ₦${subtotal.toLocaleString()}`);
    messageParts.push(`Delivery (${deliveryInfo.zone}): ₦${deliveryFee.toLocaleString()}`);
    messageParts.push('');
    messageParts.push(`Total: ₦${total.toLocaleString()}`);
  } else if (deliveryInfo?.zone) {
    messageParts.push(`Delivery: ${deliveryInfo.zone}`);
    messageParts.push('');
    messageParts.push(`Total: ₦${total.toLocaleString()}`);
  } else {
    messageParts.push(`Total: ₦${total.toLocaleString()}`);
  }

  messageParts.push('');
  messageParts.push('Please confirm availability and delivery. Thank you!');

  const message = messageParts.join('\n');

  const cleanPhone = vendorPhone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
