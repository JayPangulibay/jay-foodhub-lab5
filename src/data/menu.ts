/**
 * Menu + order data transcribed directly from the prototype's text nodes.
 * Node references point at LAYOUT-SPECS.md; values are 1:1 with the Figma file.
 */

/**
 * Every asset lives in src/assets so `require('../assets/…')` resolves from
 * src/data. The files were exported from Figma as JPEG despite the original
 * .png names, so the extensions are corrected to match the actual bytes.
 */
export const assets = {
  promoSalad: require('../assets/promo-salad.jpg'),
  orderHero: require('../assets/order-hero.jpg'),
  courier: require('../assets/courier.jpg'),
} as const;

export type Dish = {
  id: string;
  name: string;
  note: string;
  price: number;
  image: number;
};

/** §5 — five popular dishes, in prototype order. */
export const MENU: Dish[] = [
  { id: 'salad', name: 'Original Salad', note: 'Fresh & healthy', price: 8, image: require('../assets/dish-salad.jpg') },
  { id: 'fresh-salad', name: 'Fresh Salad', note: "Chef's choice", price: 10, image: require('../assets/dish-fresh-salad.jpg') },
  { id: 'ice-cream', name: 'Yummie Ice Cream', note: 'Sweet dessert', price: 6, image: require('../assets/dish-ice-cream.jpg') },
  { id: 'vegan', name: 'Vegan Special', note: 'Plant powered', price: 11, image: require('../assets/dish-vegan.jpg') },
  { id: 'pasta', name: 'Mixed Pasta', note: 'Italian favorite', price: 13, image: require('../assets/dish-pasta.jpg') },
];

/**
 * The basket the prototype opens with. SQLite seeds these two lines on first
 * launch (see services/db.ts) so a fresh install and a rehydrated one show the
 * same cart.
 */
export const DEFAULT_CART: { dishId: string; qty: number }[] = [
  { dishId: MENU[0].id, qty: 1 },
  { dishId: MENU[1].id, qty: 1 },
];

export type AddOn = { id: string; label: string; price: number };

/** §6 — Extra Dressing is checked by default, No Ice unchecked. */
export const ADD_ONS: AddOn[] = [
  { id: 'dressing', label: 'Extra Dressing', price: 1 },
  { id: 'no-ice', label: 'No Ice', price: 0 },
];

/**
 * LABORATORY 5 live-summary rules. §6 of the prototype renders a static
 * "Delivery charge $5 / Discount $2"; the persistence task supersedes both with
 * a flat $29 delivery charge and $15 off per applied voucher, so the summary
 * reacts to the cart and to the vouchers toggled on the Savings screen.
 * LAYOUT-SPECS.md §6 still records the original prototype values.
 */
export const DELIVERY_FEE = 29;
export const DISCOUNT_PER_VOUCHER = 15;

/** §7 — Track Order shows three completed steps and a pending delivery. */
export type OrderStage = 'Preparing' | 'Picked up' | 'On the way' | 'Delivered';

export const STAGES: OrderStage[] = ['Preparing', 'Picked up', 'On the way', 'Delivered'];

/**
 * Renders an order row's ISO timestamp for the Orders list and the receipt.
 * Locale-aware so the date reads correctly on any device; an unparseable
 * value collapses to an empty string rather than "Invalid Date".
 */
export function formatOrderStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** §7 — courier card copy. */
export const COURIER = {
  name: 'Jay Hawkins',
  role: 'Your delivery partner',
  rating: '4.9 star',
  headline: 'Your food is on the way',
  eta: 'Arriving in 12 min.',
};

/** §5 — delivery header location row. */
export const LOCATION = {
  label: 'Deliver to',
  value: 'Your Location',
};

/**
 * Pickup dropdown options. LABORATORY 5 names these three explicitly; the
 * prototype's own dropdown copy was never captured (LAYOUT-SPECS §8 records
 * only the closed control).
 */
export const STATIONS = ['Mati Hub', 'City Hall Hub', 'Market Hub'];

/** §6 — the Order Details card headline. */
export const RESTAURANT = {
  name: 'Original Salad',
  rating: '4.7 (2.3k)',
  variant: 'Regular bowl',
};

/** §9 — six timeline events, newest last in the prototype's reading order. */
export type ActivityTone = 'muted' | 'accent';

export type ActivityEvent = {
  id: string;
  icon: 'badge-check' | 'bike' | 'check' | 'badge-percent' | 'star' | 'receipt';
  title: string;
  detail: string;
  time: string;
  tone: ActivityTone;
  /** Which filter chip surfaces this event. */
  filter: 'orders' | 'reviews' | 'promos';
};

export const ACTIVITY: ActivityEvent[] = [
  { id: 'a1', icon: 'badge-check', title: 'Order Confirmed', detail: 'Your Original Salad order was confirmed.', time: 'Today · 9:42 AM', tone: 'muted', filter: 'orders' },
  { id: 'a2', icon: 'bike', title: 'Out for Delivery', detail: 'Jay Hawkins is bringing your order.', time: 'Today · 10:06 AM', tone: 'muted', filter: 'orders' },
  { id: 'a3', icon: 'check', title: 'Order Delivered', detail: 'Your order arrived at your doorstep.', time: 'Today · 10:18 AM', tone: 'accent', filter: 'orders' },
  { id: 'a4', icon: 'badge-percent', title: 'Promo Applied', detail: '$2 discount added to your basket.', time: 'Yesterday · 7:35 PM', tone: 'muted', filter: 'promos' },
  { id: 'a5', icon: 'star', title: 'Review Received', detail: 'Thanks for rating Original Salad 5 stars.', time: 'Sep 29 · 1:12 PM', tone: 'muted', filter: 'reviews' },
  { id: 'a6', icon: 'receipt', title: 'Order Placed', detail: 'Mixed Pasta order #JF-2048 was placed.', time: 'Sep 28 · 6:20 PM', tone: 'muted', filter: 'orders' },
];

/** §3 — the five bottom-navigation tabs, in prototype order. */
export type TabKey = 'home' | 'orders' | 'savings' | 'activity' | 'more';

/** §9 — four filter chips; widths are measured from the prototype. */
export type ActivityFilter = 'all' | 'orders' | 'reviews' | 'promos';

export const ACTIVITY_FILTERS: { key: ActivityFilter; label: string; width: number }[] = [
  { key: 'all', label: 'All', width: 45 },
  { key: 'orders', label: 'Orders', width: 68 },
  { key: 'reviews', label: 'Reviews', width: 76 },
  { key: 'promos', label: 'Promos', width: 72 },
];

/** §10 — four vouchers with their minimum-order thresholds. */
export type Voucher = {
  id: string;
  icon: 'ticket-percent' | 'bike' | 'badge-percent' | 'tags';
  title: string;
  minimum: string;
};

export const VOUCHERS: Voucher[] = [
  { id: 'v1', icon: 'ticket-percent', title: '$2 Off', minimum: 'Minimum order $10' },
  { id: 'v2', icon: 'bike', title: 'Free Delivery', minimum: 'Minimum order $15' },
  { id: 'v3', icon: 'badge-percent', title: '10% Off', minimum: 'Minimum order $20' },
  { id: 'v4', icon: 'tags', title: '$3 Off', minimum: 'Minimum order $18' },
];

/** §10 — savings summary panel. */
export const SAVINGS_TOTAL = 'Total Savings $12.50';

/**
 * The $12.50 already banked (§10). The Savings screen renders this plus
 * `appliedVouchers × DISCOUNT_PER_VOUCHER`, so the panel starts Figma-exact at
 * $12.50 and runs upward as vouchers are applied.
 */
export const SAVINGS_BASE = 12.5;
export const SAVINGS_BANNER = {
  title: 'Save More with Jay FoodHub',
  detail: 'Unlock a better deal on every delicious order.',
};

/** §2 — promo banner copy. */
export const PROMO = {
  title: "Cravings?\nWe've got you!",
  detail: 'Fresh favorites, delivered fast.',
};
