/**
 * Design tokens extracted 1:1 from the Figma file.
 * Every value here maps to a named token / GLOBAL_VARS entry in the prototype.
 */

/* ---------- Color ---------- */
export const color = {
  brand: '#3368A0', // fill_e4f920a1 — primary blue
  accent: '#F28C28', // fill_4f505426 — orange CTA / price
  surface: '#FFFFFF', // fill_658ab2fa
  canvas: '#F4F7FB', // fill_457d1734 — soft page background
  muted: '#E3ECF5', // fill_01354e97 — borders, chips, inactive tracks
  frame: '#E3ECF5', // presentation artboard background
} as const;

/* ---------- Typography ---------- */
export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
} as const;

/**
 * Type ramp lifted straight from the prototype's textStyle objects.
 * `size` is in px which equals dp at @1x design scale.
 */
export const text = {
  brandMark: { fontFamily: font.extraBold, fontSize: 30 },
  display: { fontFamily: font.regular, fontSize: 22 },
  title: { fontFamily: font.regular, fontSize: 18 },
  promo: { fontFamily: font.extraBold, fontSize: 18, lineHeight: 21 },
  itemName: { fontFamily: font.regular, fontSize: 17 },
  cardTitle: { fontFamily: font.regular, fontSize: 15 },
  price: { fontFamily: font.regular, fontSize: 18 },
  priceStrong: { fontFamily: font.extraBold, fontSize: 16 },
  body: { fontFamily: font.regular, fontSize: 14 },
  bodyStrong: { fontFamily: font.extraBold, fontSize: 14 },
  label: { fontFamily: font.regular, fontSize: 13 },
  labelStrong: { fontFamily: font.bold, fontSize: 13 },
  meta: { fontFamily: font.medium, fontSize: 12 },
  metaSoft: { fontFamily: font.regular, fontSize: 12 },
  strong: { fontFamily: font.bold, fontSize: 11 },
  link: { fontFamily: font.semiBold, fontSize: 11 },
  caption: { fontFamily: font.regular, fontSize: 10 },
  captionStrong: { fontFamily: font.bold, fontSize: 10, textAlign: 'center' as const },
  badge: { fontFamily: font.extraBold, fontSize: 9 },
} as const;

/* ---------- Radius ---------- */
export const radius = {
  screen: 44,
  card: 24,
  panel: 18,
  control: 14,
  chip: 10,
  pill: 999,
} as const;

/* ---------- Elevation ---------- */
export const shadow = {
  screen: {
    shadowColor: color.brand,
    shadowOpacity: 0.13,
    shadowRadius: 21, // 42px blur -> radius is half in RN
    shadowOffset: { width: 0, height: 9 }, // 18px -> half offset
    elevation: 9,
  },
  card: {
    shadowColor: color.brand,
    shadowOpacity: 0.08,
    shadowRadius: 10, // 20px blur
    shadowOffset: { width: 0, height: 3.5 }, // 7px
    elevation: 3,
  },
} as const;

/* ---------- Layout ---------- */
export const layout = {
  screenWidth: 428,
  screenHeight: 926,
  gutter: 20,
  statusBarHeight: 48,
  headerHeight: 54,
  tabBarHeight: 78,
  controlHeight: 52,
  /** The five iOS glyphs live at 17px in every screen. */
  iconSm: 17,
  iconMd: 20,
  iconLg: 21,
} as const;
