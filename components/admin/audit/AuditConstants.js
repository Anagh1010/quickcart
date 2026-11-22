export const ACTION_LABELS = {
    'product.listed':              { label: 'Products Browsed',  icon: '🛍',  color: 'bg-blue-100 text-blue-800' },
    'product.added':               { label: 'Product Added',     icon: '📦',  color: 'bg-emerald-100 text-emerald-800' },
    'cart.viewed':                 { label: 'Cart Viewed',       icon: '🛒',  color: 'bg-amber-100 text-amber-800' },
    'cart.updated':                { label: 'Cart Updated',      icon: '✏️',  color: 'bg-orange-100 text-orange-800' },
    'order.created':               { label: 'Order Placed',      icon: '🧾',  color: 'bg-purple-100 text-purple-800' },
    'order.viewed':                { label: 'Orders Viewed',     icon: '📋',  color: 'bg-indigo-100 text-indigo-800' },
    'coupon.validated':            { label: 'Coupon Used',       icon: '🎟',  color: 'bg-pink-100 text-pink-800' },
    'user.session_started':        { label: 'User Login',        icon: '👤',  color: 'bg-teal-100 text-teal-800' },
    'seller.analytics_viewed':     { label: 'Analytics Viewed',  icon: '📊',  color: 'bg-stone-100 text-stone-800' },
    'product.created':             { label: 'Product Created',   icon: '📦',  color: 'bg-emerald-100 text-emerald-800' },
    'product.updated':             { label: 'Product Updated',   icon: '✏️',  color: 'bg-blue-100 text-blue-800' },
    'product.deleted':             { label: 'Product Deleted',   icon: '🗑️',  color: 'bg-rose-100 text-rose-800' },
    'inventory.adjusted':          { label: 'Stock Adjusted',    icon: '📊',  color: 'bg-amber-100 text-amber-800' },
    'coupon.created':              { label: 'Coupon Created',    icon: '🎟',  color: 'bg-pink-100 text-pink-800' },
    'coupon.deleted':              { label: 'Coupon Deleted',    icon: '🎟',  color: 'bg-rose-100 text-rose-800' },
    'payment.verified':            { label: 'Payment Verified',  icon: '✓',   color: 'bg-emerald-100 text-emerald-800' },
    'payment.verification_failed': { label: 'Payment Failed',    icon: '!',   color: 'bg-rose-100 text-rose-800' },
    'user.role_changed':           { label: 'Role Changed',      icon: '🔐',  color: 'bg-purple-100 text-purple-800' },
    'review.created':              { label: 'Review Created',    icon: '⭐',  color: 'bg-amber-100 text-amber-800' },
    'address.created':             { label: 'Address Saved',     icon: '📍',  color: 'bg-teal-100 text-teal-800' },
};

export const ALL_ACTIONS = Object.keys(ACTION_LABELS);
export const ALL_RESOURCES = ['product', 'cart', 'order', 'coupon', 'user', 'seller', 'review', 'address'];
export const ALL_CATEGORIES = ['audit', 'security', 'analytics'];
export const ALL_OUTCOMES = ['success', 'denied', 'failed'];
