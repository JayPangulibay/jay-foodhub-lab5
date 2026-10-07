# Jay FoodHub — Layout Specs

Extracted from Figma file `JSI1s78lnzSlxcBdbgf6zI` ("Untitled"), frame **Jay FoodHub mobile app presentation** (`2:3312`), version `2406101681202475404`, last modified 2026-10-03.

All values are exact from the Figma REST API node tree. `AL:` = auto-layout, `pad()` = padding (top, right, bottom, left).

---

## 1. Canvas & Frame Setup

| Property | Value |
|---|---|
| Presentation frame | `3408 × 1090`, auto-layout `HORIZONTAL`, gap `32`, padding `64 80 56 80`, fill `#f4f7fb`, clips |
| Screen presentation wrapper | `428 × 967`, auto-layout `VERTICAL`, gap `24`, `alignItems: CENTER` |
| **Screen (device)** | **`428 × 926`** — iPhone 15 Pro Max logical size |

Every screen: `radius 44`, `clipsContent: true`, `DROP_SHADOW 0 18 42 rgba(51,104,160,0.125)`

Screen order left→right, gap `32` between wrappers: Login, Home, Order Details, Track Order, Add Address, Activity, Savings.

---

## 2. Design Tokens

### Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#3368a0` | Headers, body text, primary fills, icons |
| `accent` | `#f28c28` | Prices, CTAs, active states, badges |
| `surface` | `#ffffff` | Cards, screen background |
| `background` | `#f4f7fb` | Page background, search field, input fill |
| `muted` | `#e3ecf5` | Icon chips, dividers, inactive chips, summary panel |

### Typography — all Inter

| Role | Size / Weight / Line-height | Color |
|---|---|---|
| Brand display | `30px` / `800` / `36.31` | `#ffffff` |
| Page title | `22px` / `400` / `26.63` | `#3368a0` |
| Section heading | `18px` / `400` / `21.78` | `#3368a0` |
| Screen title (header) | `18px` / `400` / `21.78` | `#3368a0` or `#ffffff` on blue |
| Promo title | `18px` / `800` / `20.7` | `#ffffff` |
| Banner title | `17px` / `800` / `20.57` | `#ffffff` |
| Item name (large) | `17px` / `400` / `20.57` | `#3368a0` |
| Status line | `15px` / `400` / `18.15` | `#3368a0` |
| Body | `14px` / `400` / `16.94` | `#3368a0` |
| Button label | `14px` / `400` / `16.94` | `#ffffff` |
| Price | `14px` / `800` / `16.94` | `#f28c28` |
| Price (card) | `18px` / `400` / `21.78` | `#f28c28` |
| Total | `16px` / `800` / `19.36` | `#f28c28` |
| Body small | `13px` / `400` / `15.73` | `#3368a0` |
| Body small bold | `13px` / `700` / `15.73` | `#3368a0` |
| Secondary | `12px` / `400` / `14.52` | `#3368a0` |
| Label | `11px` / `700` / `13.31` | `#3368a0` |
| Caption | `10px` / `400` / `12.1` | `#3368a0` |
| Micro | `9px` / `400` / `10.89` | `#3368a0` |
| Status bar time | `13px` / `700` / `15.73` | inherits header |

**Opacity convention** — muted text is primary at reduced alpha, not a different color:

| Alpha | Used for |
|---|---|
| `0.86` | Tagline |
| `0.88` | Input placeholder (on blue) |
| `0.82` | "Or continue with" |
| `0.78` | Banner/promo detail (on blue) |
| `0.70` | Dropdown placeholder |
| `0.62` | Form description, timeline description, "Your Savings" label |
| `0.60` | "Arriving in 12 min." |
| `0.58` | Add-address description |
| `0.55` | "Deliver to", courier role |
| `0.52` | Dish category, minimum order |
| `0.50` | Search prompt, add-address placeholder |
| `0.45` | Inactive nav label |
| `0.40` | Timestamp, pending dot |
| `0.38` | Inactive nav icon |

### Radii

| Radius | Applied to |
|---|---|
| `44px` | Screen frame |
| `24px` | Promo banner, savings banner, restaurant item card |
| `18px` | Arrival card, courier card, order summary, voucher |
| `14px` | Input field, search, primary button, dropdown, segmented control, dish photo |
| `999px` | All circular elements: avatars, icon chips, badges, filter chips, nav indicator, quantity pill |
| `6px` | Unchecked checkbox |
| `0 0 24 24` | Blue screen headers (rounded bottom only) |

### Shadows

| Name | Value | Applied to |
|---|---|---|
| `screen` | `0 18 42 rgba(51,104,160,0.125)` | All 7 screen frames |
| `card` | `0 7 20 rgba(51,104,160,0.078)` | Promo banner, restaurant item card, arrival card, savings banner |

Both shadows are tinted with the primary blue, not black.

### Spacing scale

`3 · 4 · 5 · 7 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 34 · 44`

---

## 3. Shared Components

### Status bar — `428 × 48`
`AL:HORIZONTAL`, `pad(13,26,0,26)`, `alignItems: CENTER`, `justifyContent: SPACE_BETWEEN`, `self: STRETCH`

- **Time** `28 × 16` — Inter `700 13px/15.73`, text `"9:41"`
- **Device status** `67 × 17`, `AL:HORIZONTAL` gap `5`, centered
  - `ios-signal` `17 × 17` → Vector `16 × 10`
  - `ios-wifi-signal` `17 × 17` → Vector `15 × 10`
  - `ios-battery-full` `23 × 17` → Vector `22 × 11`

Icon + text color follows the header: `#ffffff` on blue headers, `#3368a0` on white.

### Page header — `428 × 54`
`AL:HORIZONTAL`, `pad(0,20,0,20)`, `CENTER`, `SPACE_BETWEEN`, `self: STRETCH`

- Leading action `28 × 28` (centered, holds `arrow-left` `21 × 21` → Vector `12 × 12`, or a `21 × 21` spacer when there is no back button)
- Title — Inter `400 18px/21.78`
- Trailing action `28 × 28` (holds `more-horizontal` `21 × 21` → Vector `14 × 2`, or spacer)

### Bottom navigation — `428 × 78`
`AL:HORIZONTAL`, `pad(11,18,9,18)`, `SPACE_BETWEEN`, `self: STRETCH`, fill `#ffffff`

5 items, each `60px` wide, `AL:VERTICAL` gap `5`, `alignItems: CENTER`:

- Icon `20 × 20` (Lucide names, `Vector` inside)
- Label — Inter `500 10px/12.1`
- **Active** item: icon full opacity, label `400 10px/12.1` full opacity, plus `Active indicator` `18 × 3` fill `#3368a0` radius `999px`. Item height `45`.
- **Inactive**: icon `opacity 0.38`, label `opacity 0.45`, no indicator. Item height `37`.

| # | Icon (Lucide) | Label |
|---|---|---|
| 1 | `house` | Home |
| 2 | `receipt-text` | Orders |
| 3 | `badge-dollar-sign` | Savings |
| 4 | `bell` | Activity |
| 5 | `menu` | More |

Active state differs per screen: Home = 1, Activity = 4, Savings = 3.

---

## 4. Screen 1 — Splash / Login

Frame `428 × 926`, fill `#3368a0`.

**Login content** `428 × 878` — `AL:VERTICAL` gap `20`, `pad(44,38,34,38)`, `alignItems: CENTER`, `self: STRETCH`

**Brand** `352 × 148` — `AL:VERTICAL` gap `10`, centered, `self: STRETCH`
- **Logo** `76 × 76` — `AL:HORIZONTAL`, centered, radius `24px`
  - `shopping-bag` `42 × 42` → Vector `32 × 35`
  - `utensils` `20 × 20` → Vector `15 × 17`, `constraints: CENTER/CENTER`
- **Brand name** — Inter `800 30px/36.31`, `"Jay FoodHub"`
- **Tagline** — Inter `400 13px/15.73`, opacity `0.86`, `"Good Food, Right to Your Doorstep."`

**Login form** `352 × 205` — `AL:VERTICAL` gap `12`, `self: STRETCH`
- **Input field** × 2 — `352 × 52`, `AL:HORIZONTAL` gap `11`, `pad(0,16,0,16)`, centered, fill `#3368a0`, radius `14px`
  - icon `18 × 18`: `user` → Vector `11 × 14`; `lock-keyhole` → Vector `14 × 15`
  - Placeholder — Inter `400 13px/15.73`, opacity `0.88`: `"Name"`, `"Password"`
- **Password help** `352 × 13` — `AL:HORIZONTAL`, `justifyContent: MAX`
  - `"Forgot Password?"` — Inter `600 11px/13.31`
- **Primary button** `352 × 52` — `AL:HORIZONTAL` `pad(0,22,0,22)`, centered, fill `#ffffff`, radius `14px`
  - `"Login"` — Inter `400 14px/16.94`, color `#3368a0`

**Social sign in** `352 × 67` — `AL:VERTICAL` gap `12`, centered
- `"Or continue with"` — Inter `500 11px/13.31`, opacity `0.82`
- **Social icons** `154 × 42` — `AL:HORIZONTAL` gap `14`
  - 3 × `42 × 42` circles, fill `#ffffff`, radius `999px`
    - `facebook` `18 × 18` → Vector `8 × 15`
    - `twitter` `18 × 18` → Vector `15 × 13`
    - `"G+"` — Inter `800 14px/16.94`, color `#3368a0`

**Sign up prompt** — Inter `500 13px/15.73`, `"Don't have an account? Sign up now."`

---

## 5. Screen 2 — Home / Popular Menu

Frame `428 × 926`, fill `#ffffff`.

**Home content** `428 × 800` — `AL:VERTICAL` gap `12`, `pad(8,20,10,20)`, `self: STRETCH`

**Delivery header** `388 × 40` — `AL:HORIZONTAL`, centered, `SPACE_BETWEEN`
- **Location** `139 × 38` — `AL:HORIZONTAL` gap `10`, centered
  - **Location icon** `38 × 38` — fill `#e3ecf5`, radius `999px`; `map-pin` `19 × 19` → Vector `13 × 16`
  - **Location copy** `91 × 32` — `AL:VERTICAL` gap `3`
    - `"Deliver to"` — Inter `500 10px/12.1`, opacity `0.55`
    - `"Your Location"` — Inter `400 14px/16.94`
- **Cart** `40 × 40` — fill `#f4f7fb`, radius `999px`; `shopping-cart` `20 × 20` → Vector `17 × 17`
  - **Cart badge** `17 × 17` — `constraints: RIGHT/TOP`, fill `#f28c28`, radius `999px`
    - `"2"` — Inter `800 9px/10.89`, `#ffffff`

**Search** `388 × 46` — `AL:HORIZONTAL` gap `9`, `pad(0,14,0,14)`, centered, fill `#f4f7fb`, radius `14px`
- `search` `18 × 18` → Vector `14 × 14`
- `"Search for food, drinks, or cuisines"` — Inter `400 11px/13.31`, opacity `0.50`

**Promo banner** `388 × 128` — `AL:HORIZONTAL`, `pad(14,10,14,18)`, centered, `self: STRETCH`, fill `#3368a0`, radius `24px`, shadow `card`
- **Promo copy** `244 × 96` — `AL:VERTICAL` gap `7`
  - `"Cravings?\nWe've got you!"` — Inter `800 18px/20.7`, `textAutoResize: HEIGHT`, `self: STRETCH`
  - `"Fresh favorites, delivered fast."` — Inter `400 10px/12.1`, opacity `0.78`
  - **Promo action** `28 × 28` — fill `#ffffff`, radius `999px`; `arrow-right` `15 × 15` → Vector `9 × 9`
- **Salad photo** — `ELLIPSE 116 × 116`, image fill, `scaleMode: FILL`

**Section heading** `388 × 22` — `AL:HORIZONTAL`, centered, `SPACE_BETWEEN`
- `"Popular Menu"` — Inter `400 18px/21.78`
- `"See All"` — Inter `700 11px/13.31`

**Popular dishes** `388 × 342` — `AL:VERTICAL` gap `3`, `self: STRETCH`

**Menu item** `388 × 66` × 5 — `AL:HORIZONTAL` gap `12`, `pad(0,2,0,0)`, centered, `self: STRETCH`
- **Dish photo** — `RECTANGLE 58 × 58`, radius `14px`, image fill
- **Dish details** `~250 × 32` — `AL:VERTICAL` gap `4`
  - Dish name — Inter `400 13px/15.73`, `self: STRETCH`
  - Category — Inter `400 10px/12.1`, opacity `0.52`, `self: STRETCH`
- **Price** — Inter `800 14px/16.94`, `#f28c28`
- `chevron-right` `17 × 17` → Vector `4 × 9`

| # | Dish | Category | Price | imageRef |
|---|---|---|---|---|
| 1 | Original Salad | Fresh & healthy | `$8` | `41dbde62…` |
| 2 | Fresh Salad | Chef's choice | `$10` | `b2b4b608…` |
| 3 | Yummie Ice Cream | Sweet dessert | `$6` | `73bcd8da…` |
| 4 | Vegan Special | Plant powered | `$11` | `a0d23a85…` |
| 5 | Mixed Pasta | Italian favorite | `$13` | `e045f5d9…` |

---

## 6. Screen 3 — Order Details

Frame `428 × 926`, fill `#ffffff`. Page header title `"Order Details"`.

**Order details content** `428 × 824` — `AL:VERTICAL` gap `16`, `pad(8,20,24,20)`, `self: STRETCH`

**Restaurant item card** `388 × 232` — `AL:VERTICAL`, `self: STRETCH`, fill `#ffffff`, radius `24px`, shadow `card`
- **Item photo** `388 × 156` — image fill, `self: STRETCH` (imageRef `b47aa502…`)
- **Item information** `388 × 76` — `AL:HORIZONTAL` `pad(0,16,0,16)`, centered, `SPACE_BETWEEN`
  - **Item description** `111 × 41` — `AL:VERTICAL` gap `5`
    - `"Original Salad"` — Inter `400 17px/20.57`
    - **Rating** `71 × 15` — `AL:HORIZONTAL` gap `4`, centered; `star` `15 × 15`; `"4.7 (2.3k)"` Inter `700 11px/13.31`
  - **Price** `"$8"` — Inter `400 18px/21.78`, `#f28c28`

**Order items** `388 × 78` — `AL:VERTICAL` gap `10`
- **Section heading** `388 × 22` — `"Your order"` Inter `400 18px/21.78`
- **Order item** `388 × 46` — `AL:HORIZONTAL`, centered, `SPACE_BETWEEN`
  - **Item label** `89 × 31` — `AL:VERTICAL` gap `3`
    - `"Original Salad"` — Inter `700 13px/15.73`
    - `"Regular bowl"` — Inter `400 10px/12.1`, opacity `0.52`
  - **Quantity** `84 × 34` — `AL:HORIZONTAL` gap `12`, `pad(0,8,0,8)`, centered, fill `#f4f7fb`, radius `999px`
    - `minus` `14 × 14` → Vector `8 × 0`
    - `"1"` — Inter `400 12px/14.52`
    - **Increase** `24 × 24` — fill `#f28c28`, radius `999px`; `plus` `13 × 13`

**Add-ons** `388 × 75` — `AL:VERTICAL` gap `9`
- `"Add-ons"` — Inter `400 14px/16.94`
- **Add-on** `388 × 20` × 2 — `AL:HORIZONTAL`, centered, `SPACE_BETWEEN`
  - **Add-on label** — `AL:HORIZONTAL` gap `9`, centered
    - Selected: `Selection check` `20 × 20`, fill `#f28c28`, radius `999px`, `check` `12 × 12`
    - Unselected: `Selection box` `RECTANGLE 20 × 20`, radius `6px`, no fill
    - Name — Inter `400 12px/14.52`
  - Price — Inter `400 12px/14.52`, `#f28c28`

| Add-on | State | Price |
|---|---|---|
| Extra Dressing | checked | `$1` |
| No Ice | unchecked | `$0` |

**Order summary** `388 × 137` — `AL:VERTICAL` gap `10`, `pad(16,16,16,16)`, fill `#e3ecf5`, radius `18px`
- 3 × **Summary row** `356 × 15` — `SPACE_BETWEEN`; label Inter `500 12px/14.52`, value Inter `400 12px/14.52`
- **Divider** `356 × 1` — fill `#e3ecf5`, `self: STRETCH`
- Final **Summary row** `356 × 19` — label `"Total"` Inter `400 14px/16.94`; value Inter `800 16px/19.36` `#f28c28`

| Row | Value |
|---|---|
| Subtotal | `$8` |
| Delivery charge | `$5` |
| Discount | `-$2` (`#f28c28`) |
| **Total** | **`$11`** |

**Primary button** `388 × 52` — `pad(0,22,0,22)`, centered, fill `#f28c28`, radius `14px`
- `"Place my order"` — Inter `400 14px/16.94`, `#ffffff`

---

## 7. Screen 4 — Track Order

Frame `428 × 926`, fill `#ffffff`. Title `"Track Order"`.

**Delivery map** `428 × 404` — `AL:HORIZONTAL`, `self: STRETCH`, fill `#f4f7fb`, clips
- 4 × **Road** — fill `#ffffff`, radius `999px`, rotated:
  - `478 × 85` @ `-0.1396 rad` (−8°)
  - `404 × 99` @ `0.2094 rad` (+12°)
  - `74 × 418` @ `0.1396 rad` (+8°)
  - `88 × 355` @ `-0.2094 rad` (−12°)
- 4 × **City block** — fill `#e3ecf5`, radius `10px`: `88 × 58`, `62 × 48`, `70 × 56`, `72 × 48`
- Page header (overlaid, same spec as §3)
- **Delivery route** — `VECTOR 276 × 172`
- **Restaurant pin** `42 × 42` — fill `#3368a0`, radius `999px`; `store` `20 × 20` → Vector `17 × 16`
- **Destination pin** `44 × 44` — fill `#f28c28`, radius `999px`; `home` `20 × 20` → Vector `15 × 16`
- **Arrival card** `388 × 88` — `AL:HORIZONTAL` `pad(0,16,0,16)`, centered, `SPACE_BETWEEN`, fill `#ffffff`, radius `18px`, shadow `card`
  - **Arrival copy** `167 × 38` — `AL:VERTICAL` gap `5`
    - `"Your food is on the way"` — Inter `400 15px/18.15`
    - `"Arriving in 12 min."` — Inter `500 12px/14.52`, opacity `0.60`
  - **Time badge** `46 × 46` — fill `#e3ecf5`, radius `999px`; `clock-3` `21 × 21` → Vector `18 × 18`

**Tracking details** `428 × 474` — `AL:VERTICAL` gap `22`, `pad(20,20,22,20)`, `self: STRETCH`

**Courier card** `388 × 86` — `AL:HORIZONTAL` gap `12`, `pad(14,14,14,14)`, centered, `self: STRETCH`, fill `#ffffff`, radius `18px`
- **Courier photo** — `ELLIPSE 58 × 58`, image fill (imageRef `b5f04d62…`)
- **Courier information** `186 × 53` — `AL:VERTICAL` gap `4`
  - `"Jay Hawkins"` — Inter `400 15px/18.15`
  - `"Your delivery partner"` — Inter `400 10px/12.1`, opacity `0.55`
  - **Rating** `61 × 15` — `star` `15 × 15` → Vector `13 × 12`; `"4.9 star"` Inter `700 11px/13.31`
- **Courier actions** `92 × 42` — `AL:HORIZONTAL` gap `8`
  - 2 × **Quick action** `42 × 42` — fill `#e3ecf5`, radius `999px`; `phone` / `message-circle` `18 × 18` → Vector `15 × 15`

**Order progress** `388 × 88` — `AL:VERTICAL` gap `16`, `self: STRETCH`
- `"Order progress"` — Inter `400 17px/20.57`
- **Progress tracker** `388 × 51` — `AL:HORIZONTAL`, `SPACE_BETWEEN`
  - **Progress step** `76 × 51` × 4 — `AL:VERTICAL` gap `9`, centered
    - **Step marker** `30 × 30` — radius `999px`
      - Done: fill `#f28c28`, `check` `15 × 15`
      - Pending: fill `#e3ecf5`, `Pending` `ELLIPSE 8 × 8` fill `#3368a0` opacity `0.40`
    - **Step label** — `textAlign: CENTER`, `self: STRETCH`
      - Done: Inter `700 10px/12.1`
      - Pending: Inter `500 10px/12.1`, opacity `0.50`
- **Progress line** `310 × 3` — fill `#e3ecf5`, radius `999px`
  - **Completed progress** `220 × 3` — fill `#f28c28`, radius `999px`

| Step | State | Label |
|---|---|---|
| 1 | done | Preparing |
| 2 | done | Picked up |
| 3 | done | On the way |
| 4 | pending | Delivered |

Completed line is `220 / 310` ≈ 71% — matches 3 of 4 steps.

---

## 8. Screen 5 — Add Address

Frame `428 × 926`, fill `#ffffff`.

**Address header** `428 × 126` — `AL:VERTICAL`, `self: STRETCH`, fill `#3368a0`, radius `0 0 24 24`
- Status bar (white icons)
- Page header, title `"Add Address"` (white); leading action is a spacer, trailing holds `more-horizontal`

**Address form** `428 × 800` — `AL:VERTICAL`, `pad(26,20,26,20)`, `justifyContent: SPACE_BETWEEN`, `self: STRETCH`

**Address information** `388 × 494` — `AL:VERTICAL` gap `18`, `self: STRETCH`

**Form introduction** `388 × 49` — `AL:VERTICAL` gap `7`
- `"Delivery details"` — Inter `400 22px/26.63`, `self: STRETCH`
- `"Please fill in your delivery information"` — Inter `400 12px/14.52`, opacity `0.58`, `self: STRETCH`

**Delivery fields** `388 × 241` — `AL:VERTICAL` gap `11`
- 4 × **Input field** `388 × 52` — `AL:HORIZONTAL` gap `11`, `pad(0,16,0,16)`, centered, fill `#f4f7fb`, radius `14px`
  - icon `18 × 18`, placeholder Inter `400 13px/15.73` opacity `0.62`

| Icon (Lucide) | Placeholder | Vector |
|---|---|---|
| `phone` | Phone no | `15 × 15` |
| `map-pin` | Estate | `12 × 15` |
| `mail` | email | `15 × 12` |
| `building-2` | Industrial Area | `15 × 14` |

**Delivery mode** `388 × 48` — `AL:HORIZONTAL` gap `10`, `self: STRETCH`
- **Pickup station** `191 × 48` — centered, radius `14px`, no fill; label Inter `700 11px/13.31` `#3368a0`
- **Doorstep delivery** `188 × 48` — centered, fill `#3368a0`, radius `14px`; label Inter `700 11px/13.31` `#ffffff`

Segmented control — active segment is filled `#3368a0`, inactive has no fill.

**Station dropdown** `388 × 52` — `AL:HORIZONTAL` `pad(0,16,0,16)`, centered, `SPACE_BETWEEN`, fill `#f4f7fb`, radius `14px`
- `map-pinned` `18 × 18` → Vector `15 × 15`; `"Choose Your Station"` Inter `500 12px/14.52` opacity `0.70`
- `chevron-down` `18 × 18` → Vector `9 × 5`

**Default address** `388 × 32` — `AL:HORIZONTAL`, centered, `SPACE_BETWEEN`
- **Default address copy** `171 × 32` — `AL:VERTICAL` gap `4`
  - `"Set as default address"` — Inter `700 13px/15.73`
  - `"Use this address for your next order"` — Inter `400 10px/12.1`, opacity `0.50`
- **Switch** `44 × 24` — `AL:HORIZONTAL` `pad(3,3,3,3)`, centered, `justifyContent: MAX`, fill `#3368a0`, radius `999px`
  - **Thumb** `ELLIPSE 18 × 18`, fill `#ffffff`

**Submit action** `388 × 58` — `AL:HORIZONTAL` `pad(6,0,0,0)`, `self: STRETCH`
- **Primary button** `388 × 52` — fill `#f28c28`, radius `14px`; `"Submit"` Inter `400 14px/16.94` `#ffffff`

---

## 9. Screen 6 — Activity

Frame `428 × 926`, fill `#ffffff`. Bottom nav active = Activity (4).

**Activity header** `428 × 122` — `AL:VERTICAL`, `self: STRETCH`, fill `#3368a0`, radius `0 0 24 24`
- Status bar (white) + Page header, title `"Activity"`, both leading and trailing are spacers

**Activity content** `428 × 726` — `AL:VERTICAL` gap `16`, `pad(18,20,8,20)`, `self: STRETCH`

**Activity filters** `388 × 34` — `AL:HORIZONTAL`, `SPACE_BETWEEN`

| Chip | Width | Fill | Label |
|---|---|---|---|
| All | `45 × 34` | `#f28c28` | `#ffffff` |
| Orders | `68 × 34` | `#e3ecf5` | `#3368a0` |
| Reviews | `76 × 34` | `#e3ecf5` | `#3368a0` |
| Promos | `72 × 34` | `#e3ecf5` | `#3368a0` |

All: `pad(0,16,0,16)`, centered, radius `999px`, label Inter `400 11px/13.31`.

**Activity timeline** `388 × 492` — `AL:VERTICAL`, `self: STRETCH`
- **Timeline line** `RECTANGLE 2 × 426` — fill `#e3ecf5`

**Timeline event** `388 × 82` × 6 — `AL:HORIZONTAL` gap `12`, `self: STRETCH`
- **Event marker** `38 × 38` — radius `999px`; fill `#e3ecf5`, or `#f28c28` for the delivered event
  - Lucide icon `17 × 17` → Vector ~`14 × 14`
- **Event content** `338 × 50` — `AL:VERTICAL` gap `4`, `pad(1,0,0,0)`
  - Title — Inter `400 13px/15.73`, `self: STRETCH`
  - Description — Inter `400 10px/13.5`, opacity `0.62`, `self: STRETCH`
  - Timestamp — Inter `400 9px/10.89`, opacity `0.40`, `self: STRETCH`

| Icon | Title | Description | Timestamp | Marker |
|---|---|---|---|---|
| `badge-check` | Order Confirmed | Your Original Salad order was confirmed. | Today · 9:42 AM | muted |
| `bike` | Out for Delivery | Jay Hawkins is bringing your order. | Today · 10:06 AM | muted |
| `check` | Order Delivered | Your order arrived at your doorstep. | Today · 10:18 AM | **`#f28c28`** |
| `badge-percent` | Promo Applied | $2 discount added to your basket. | Yesterday · 7:35 PM | muted |
| `star` | Review Received | Thanks for rating Original Salad 5 stars. | Sep 29 · 1:12 PM | muted |
| `receipt-text` | Order Placed | Mixed Pasta order #JF-2048 was placed. | Sep 28 · 6:20 PM | muted |

---

## 10. Screen 7 — Savings

Frame `428 × 926`, fill `#ffffff`. Bottom nav active = Savings (3).

**Savings header** `428 × 122` — same construction as Activity header, title `"Savings"`

**Savings content** `428 × 726` — `AL:VERTICAL` gap `14`, `pad(18,20,12,20)`, `self: STRETCH`

**Savings banner** `388 × 104` — `AL:HORIZONTAL` `pad(0,18,0,18)`, centered, `SPACE_BETWEEN`, `self: STRETCH`, fill `#3368a0`, radius `24px`, shadow `card`
- **Banner copy** `248 × 41` — `AL:VERTICAL` gap `6`
  - `"Save More with Jay FoodHub"` — Inter `800 17px/20.57`, `self: STRETCH`
  - `"Unlock a better deal on every delicious order."` — Inter `400 10px/14`, opacity `0.78`, `self: STRETCH`
- **Banner icon** `52 × 52` — fill `#ffffff`, radius `999px`; `tag` `25 × 25` → Vector `21 × 21`

**Section heading** `388 × 22` — `"Available Vouchers"` Inter `400 18px/21.78`

**Voucher list** `388 × 331` — `AL:VERTICAL` gap `9`, `self: STRETCH`

**Voucher** `388 × 76` × 4 — `AL:HORIZONTAL` gap `12`, `pad(0,12,0,12)`, centered, `self: STRETCH`, fill `#ffffff`, radius `18px`
- **Icon chip** `42 × 42` — fill `#e3ecf5`, radius `999px`; Lucide `19 × 19` → Vector ~`16 × 14`
- **Voucher details** `238 × 33` — `AL:VERTICAL` gap `4`
  - Title — Inter `400 14px/16.94`, `self: STRETCH`
  - Minimum order — Inter `400 10px/12.1`, opacity `0.52`, `self: STRETCH`
- **Apply button** `60 × 34` — `pad(0,15,0,15)`, centered, fill `#f28c28`, radius `999px`
  - `"Apply"` — Inter `800 10px/12.1`, `#ffffff`

| Icon | Title | Minimum order |
|---|---|---|
| `ticket-percent` | `$2 Off` | Minimum order $10 |
| `bike` | Free Delivery | Minimum order $15 |
| `badge-percent` | 10% Off | Minimum order $20 |
| `tags` | `$3 Off` | Minimum order $18 |

**Your savings** `388 × 92` — `AL:HORIZONTAL` gap `13`, `pad(0,16,0,16)`, centered, `self: STRETCH`, fill `#e3ecf5`, radius `18px`
- **Savings icon** `48 × 48` — fill `#ffffff`, radius `999px`; `piggy-bank` `24 × 24` → Vector `20 × 17`
- **Savings total** `295 × 40` — `AL:VERTICAL` gap `5`
  - `"Your Savings"` — Inter `600 11px/13.31`, opacity `0.62`
  - `"Total Savings $12.50"` — Inter `400 18px/21.78`

---

## 11. Image Assets

8 image fills, all `scaleMode: FILL`. Download via
`GET /v1/images/:file_key?ids=…&format=png` with `X-Figma-Token`.

| Node ID | Asset | Used in |
|---|---|---|
| `2:3379` | Salad photo | Home — promo banner (circular crop) |
| `2:3385` | Dish 1 | Home — Original Salad |
| `2:3392` | Dish 2 | Home — Fresh Salad |
| `2:3399` | Dish 3 | Home — Yummie Ice Cream |
| `2:3406` | Dish 4 | Home — Vegan Special |
| `2:3413` | Dish 5 | Home — Mixed Pasta |
| `2:3453` | Item photo | Order Details — restaurant card |
| `2:3539` | Courier photo | Track Order — courier avatar (circular) |

Icons are **not** images — they are inline `VECTOR` nodes (Lucide), so they must be redrawn as SVG paths, not downloaded.

---

## 12. Implementation Notes

- Every screen is a fixed `428 × 926` with `radius 44` and `clipsContent` — that's presentation chrome, not app UI. In-app, use a full-bleed screen with no radius.
- Status bar is baked into each screen as a normal frame. In React Native / Expo, replace with the OS status bar and keep the same `48px` reserved height so content offsets stay correct.
- Blue headers (`Add Address`, `Activity`, `Savings`) have `radius: 0 0 24 24` — rounded on the bottom two corners only.
- Muted text is always `#3368a0` at reduced opacity. Never introduce a second gray.
- Shadows are blue-tinted. On Android, `shadowColor` must be set to `#3368a0` or it renders black.
- `self: STRETCH` + `textAutoResize: HEIGHT` on headings means the text wraps to the container width — don't hardcode widths.
- Lucide icon names are preserved verbatim in the layer names, so you can match icon-for-icon against the Lucide set.
