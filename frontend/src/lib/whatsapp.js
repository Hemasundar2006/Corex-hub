/**
 * Helper utilities to generate pre-filled WhatsApp click-to-chat links
 */

export const cleanPhoneForWhatsApp = (rawPhone) => {
  if (!rawPhone) return '919876543210';
  // Remove all non-digit characters
  let digits = rawPhone.replace(/\D/g, '');
  // If 10 digits (standard Indian mobile without country code), prepend 91
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return digits;
};

/**
 * Generate click-to-chat WhatsApp URL for a product order
 */
export const getProductWhatsAppUrl = (product, phone = '+919876543210') => {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const categoryName = product.category?.name || 'Electronics';
  const currency = '₹';
  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/products?id=${product._id}` : '';

  const message = `Hello IoT Garage! 👋

I would like to place an order for:
📦 *Product:* ${product.name}
💰 *Price:* ${currency}${product.price}
🏷️ *Category:* ${categoryName}
${pageUrl ? `🔗 *Link:* ${pageUrl}\n` : ''}
Please confirm stock availability and payment / delivery details! Thank you.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate click-to-chat WhatsApp URL for a combo promotion offer
 */
export const getPromotionWhatsAppUrl = (promotion, phone = '+919876543210') => {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const currency = '₹';
  const savings = promotion.originalPrice && promotion.originalPrice > promotion.price
    ? ` (Save ${currency}${promotion.originalPrice - promotion.price})`
    : '';

  const itemsList = promotion.items && promotion.items.length > 0
    ? `\n📋 *Included Items:*\n${promotion.items.map((i) => ` • ${i}`).join('\n')}\n`
    : '';

  const message = `Hello IoT Garage! 👋

I would like to order this Combo Offer:
🎁 *Combo Pack:* ${promotion.title}
💰 *Special Price:* ${currency}${promotion.price}${savings}${itemsList}
Please confirm availability and dispatch timeframe! Thank you.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate click-to-chat WhatsApp URL for direct inquiries or student project consultation
 */
export const getGeneralWhatsAppUrl = (phone = '+919876543210', customText = '') => {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const defaultMsg = `Hello IoT Garage! 👋\nI have an inquiry regarding electronics components and project supplies. Could you please assist me?`;
  const message = customText || defaultMsg;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate click-to-chat WhatsApp URL for a full shopping cart with customer address details
 */
export const getCartWhatsAppUrl = (cartItems = [], customerDetails = {}, phone = '+919876543210') => {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const currency = '₹';

  let totalQty = 0;
  let subtotal = 0;

  const itemsLines = cartItems.map((item, idx) => {
    const qty = item.quantity || 1;
    const itemTotal = item.price * qty;
    totalQty += qty;
    subtotal += itemTotal;
    const typeLabel = item.isCombo ? ' [Combo Bundle]' : '';
    return `${idx + 1}. *${item.name}*${typeLabel}\n   Qty: ${qty} × ${currency}${item.price} = *${currency}${itemTotal.toLocaleString('en-IN')}*`;
  }).join('\n\n');

  const customerBlock = `📍 *Customer & Delivery Details:*
• *Full Name:* ${customerDetails.fullName || 'Not specified'}
• *WhatsApp Phone:* ${customerDetails.phone || 'Not specified'}
• *Delivery Address:* ${customerDetails.address || 'Not specified'}
• *City / State:* ${customerDetails.city || 'Not specified'}
• *Pincode:* ${customerDetails.pincode || 'Not specified'}${customerDetails.notes ? `\n• *Order / Lab Notes:* ${customerDetails.notes}` : ''}`;

  const message = `Hello IoT Garage! 👋

I would like to place an order for the following components:

${itemsLines}

━━━━━━━━━━━━━━━━━━━━
📊 *Total Items:* ${totalQty}
💰 *Total Amount:* ${currency}${subtotal.toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━

${customerBlock}

Please confirm stock availability and share payment / shipping tracking details! Thank you.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
