import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  ADD_ONS,
  DEFAULT_CART,
  DELIVERY_FEE,
  DISCOUNT_PER_VOUCHER,
  MENU,
  STAGES,
  type ActivityFilter,
  type OrderStage,
  type TabKey,
} from '../data/menu';
import {
  deleteOrderDB,
  getAddressesDB,
  getCartDB,
  getOrdersDB,
  getVouchersDB,
  initDB,
  saveCartDB,
  saveOrderDB,
  toggleVoucherDB,
  updateOrderStageDB,
  type OrderRow,
} from '../services/db';

export type Route =
  | { name: 'login' }
  | { name: 'home' }
  | { name: 'orderDetails'; dishId: string }
  | { name: 'orderHistory'; orderId: number }
  | { name: 'trackOrder' }
  | { name: 'addAddress' }
  | { name: 'activity' }
  | { name: 'savings' }
  | { name: 'orders' }
  | { name: 'more' };

/** Copy shown by the in-app order banner. */
export type Banner = { title: string; detail: string };

type CartLine = { dishId: string; qty: number };

/** The delivery form. `street`/`city` back the addresses table (LABORATORY 5). */
export type StateAddress = {
  name: string;
  phone: string;
  estate: string;
  email: string;
  building: string;
  street: string;
  city: string;
};

type State = {
  route: Route;
  /** Screens pushed on top of the tab root, for native-style back behaviour. */
  stack: Route[];
  tab: TabKey;
  /** §9 — active filter chip on the Activity timeline. */
  activityFilter: ActivityFilter;
  /** §10 — voucher ids the user has applied. */
  appliedVouchers: string[];
  cart: CartLine[];
  addOns: Record<string, boolean>;
  qty: number;
  stage: OrderStage;
  deliveryMode: 'doorstep' | 'station';
  station: string | null;
  setAsDefault: boolean;
  address: StateAddress;
  signedIn: boolean;
  /** Placed orders, newest first — read from SQLite on boot. */
  orders: OrderRow[];
  /** Transient order alert; null when nothing is showing. */
  banner: Banner | null;
};

/**
 * Boot-time patch read back from SQLite. Fields are left off entirely rather
 * than set to `undefined` so the reducer's spread never clobbers a value.
 */
type HydratePatch = {
  cart?: CartLine[];
  appliedVouchers?: string[];
  address?: Partial<StateAddress>;
  station?: string | null;
  deliveryMode?: State['deliveryMode'];
  setAsDefault?: boolean;
  stage?: OrderStage;
  orders?: OrderRow[];
};

type Action =
  | { type: 'navigate'; route: Route }
  | { type: 'back' }
  | { type: 'reset' }
  | { type: 'tab'; tab: TabKey }
  | { type: 'cartAdd'; dishId: string }
  | { type: 'cartSet'; dishId: string; qty: number }
  | { type: 'cartClear' }
  | { type: 'qty'; value: number }
  | { type: 'toggleAddOn'; id: string }
  | { type: 'stage'; value: OrderStage }
  | { type: 'deliveryMode'; value: State['deliveryMode'] }
  | { type: 'station'; value: string | null }
  | { type: 'defaultAddress'; value: boolean }
  | { type: 'address'; patch: Partial<StateAddress> }
  | { type: 'activityFilter'; value: ActivityFilter }
  | { type: 'toggleVoucher'; id: string }
  | { type: 'signIn' }
  /** PLACE_ORDER — clears the cart and pushes Track Order. */
  | { type: 'placeOrder' }
  /** A row landed in the `orders` table — prepend it to the history list. */
  | { type: 'orderPlaced'; order: OrderRow }
  /** DELETE_ORDER — drop one row from the history list. */
  | { type: 'orderDeleted'; id: number }
  /** Shows (or clears) the in-app order banner. */
  | { type: 'banner'; banner: Banner | null }
  /** One-shot boot patch: cart, vouchers, address and stage restored from SQLite. */
  | { type: 'hydrate'; patch: HydratePatch };

const TAB_ROUTES: Record<TabKey, Route['name']> = {
  home: 'home',
  orders: 'orders',
  savings: 'savings',
  activity: 'activity',
  more: 'more',
};

const initial: State = {
  route: { name: 'login' },
  stack: [],
  tab: 'home',
  activityFilter: 'all',
  appliedVouchers: [],
  cart: [...DEFAULT_CART],
  addOns: { dressing: true, 'no-ice': false },
  qty: 1,
  stage: 'On the way',
  deliveryMode: 'doorstep',
  station: null,
  setAsDefault: true,
  address: { name: '', phone: '', estate: '', email: '', building: '', street: '', city: '' },
  signedIn: false,
  orders: [],
  banner: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'navigate': {
      // Tab roots replace the stack; pushed screens stack for back navigation.
      const isTabRoot = TAB_ROUTES[state.tab] === action.route.name;
      if (isTabRoot) {
        return { ...state, route: action.route, stack: [] };
      }
      return { ...state, route: action.route, stack: [...state.stack, action.route] };
    }
    case 'back': {
      if (!state.stack.length) return state;
      const stack = state.stack.slice(0, -1);
      return { ...state, stack, route: stack[stack.length - 1] ?? { name: 'home' } };
    }
    case 'reset':
      return { ...state, route: { name: 'home' }, stack: [], tab: 'home' };
    case 'tab': {
      const name = TAB_ROUTES[action.tab];
      return { ...state, tab: action.tab, route: { name } as Route, stack: [] };
    }
    case 'cartAdd': {
      const found = state.cart.find((l) => l.dishId === action.dishId);
      if (found) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            l.dishId === action.dishId ? { ...l, qty: Math.min(9, l.qty + 1) } : l
          ),
        };
      }
      return { ...state, cart: [...state.cart, { dishId: action.dishId, qty: 1 }] };
    }
    case 'cartSet': {
      if (action.qty <= 0) {
        return { ...state, cart: state.cart.filter((l) => l.dishId !== action.dishId) };
      }
      // Upsert, so the Order Details stepper can drive a line that is not in
      // the basket yet without a separate "add" dispatch.
      const qty = Math.min(9, action.qty);
      const exists = state.cart.some((l) => l.dishId === action.dishId);
      return {
        ...state,
        cart: exists
          ? state.cart.map((l) => (l.dishId === action.dishId ? { ...l, qty } : l))
          : [...state.cart, { dishId: action.dishId, qty }],
      };
    }
    case 'cartClear':
      return { ...state, cart: [] };
    case 'qty':
      return { ...state, qty: Math.max(1, Math.min(9, action.value)) };
    case 'toggleAddOn':
      return { ...state, addOns: { ...state.addOns, [action.id]: !state.addOns[action.id] } };
    case 'stage':
      return { ...state, stage: action.value };
    case 'deliveryMode':
      return { ...state, deliveryMode: action.value };
    case 'station':
      return { ...state, station: action.value };
    case 'defaultAddress':
      return { ...state, setAsDefault: action.value };
    case 'address':
      return { ...state, address: { ...state.address, ...action.patch } };
    case 'activityFilter':
      return { ...state, activityFilter: action.value };
    case 'toggleVoucher': {
      const on = state.appliedVouchers.includes(action.id);
      return {
        ...state,
        appliedVouchers: on
          ? state.appliedVouchers.filter((v) => v !== action.id)
          : [...state.appliedVouchers, action.id],
      };
    }
    case 'signIn':
      return { ...state, signedIn: true };
    case 'placeOrder': {
      // PLACE_ORDER = clear the cart table (mirrored below by the cart effect)
      // and push Track Order, restarting the four-step progress tracker.
      const route: Route = { name: 'trackOrder' };
      return { ...state, cart: [], stage: 'Preparing', route, stack: [...state.stack, route] };
    }
    case 'orderPlaced':
      // Newest first, matching `getOrdersDB`'s ORDER BY id DESC.
      return { ...state, orders: [action.order, ...state.orders] };
    case 'orderDeleted':
      return { ...state, orders: state.orders.filter((o) => o.id !== action.id) };
    case 'banner':
      return { ...state, banner: action.banner };
    case 'hydrate': {
      const { address, ...rest } = action.patch;
      return {
        ...state,
        ...rest,
        ...(address ? { address: { ...state.address, ...address } } : {}),
      };
    }
    default:
      return state;
  }
}

export type TotalsInput = {
  cart: CartLine[];
  addOns: Record<string, boolean>;
  appliedVouchers: string[];
};

export type Totals = {
  subtotal: number;
  addOnTotal: number;
  delivery: number;
  discount: number;
  total: number;
};

/**
 * LABORATORY 5 live summary.
 *   subtotal  = Σ (cart line qty × menu price)
 *   delivery  = flat DELIVERY_FEE
 *   discount  = appliedVouchers × DISCOUNT_PER_VOUCHER
 */
export function computeTotals({ cart, addOns, appliedVouchers }: TotalsInput): Totals {
  const subtotal = cart.reduce(
    (sum, line) => sum + line.qty * (MENU.find((d) => d.id === line.dishId)?.price ?? 0),
    0
  );
  const addOnTotal = ADD_ONS.filter((a) => addOns[a.id]).reduce((sum, a) => sum + a.price, 0);
  const delivery = DELIVERY_FEE;
  const discount = appliedVouchers.length * DISCOUNT_PER_VOUCHER;
  return {
    subtotal,
    addOnTotal,
    delivery,
    discount,
    total: Math.max(0, subtotal + addOnTotal + delivery - discount),
  };
}

const Ctx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  subtotal: number;
  addOnTotal: number;
  delivery: number;
  discount: number;
  total: number;
  cartCount: number;
} | null>(null);

/** Persistence failures are non-fatal — the UI keeps its in-memory state. */
function report(where: string) {
  return (error: unknown) => console.warn(`[db] ${where} failed — continuing in memory`, error);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, reducerDispatch] = useReducer(reducer, initial);
  /** Flips true only once the boot read has settled; gates every write. */
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);

  // Latest state for the dispatch wrapper (events fire after effects run).
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Single dispatch entry point. Two actions need a database write that cannot
   * live in an effect; everything else persists through the effects below.
   */
  const dispatch = useCallback((action: Action) => {
    if (action.type === 'toggleVoucher') {
      toggleVoucherDB(action.id).catch(report('toggleVoucher'));
    } else if (action.type === 'placeOrder') {
      const snapshot = stateRef.current;
      const items = snapshot.cart.map((line) => {
        const dish = MENU.find((d) => d.id === line.dishId);
        return {
          id: line.dishId,
          name: dish?.name ?? line.dishId,
          qty: line.qty,
          price: dish?.price ?? 0,
        };
      });
      const { total } = computeTotals(snapshot);
      const payload = JSON.stringify(items);

      // Stage 0 = "Preparing", which the reducer sets in the same tick.
      saveOrderDB(total, payload, 0)
        .then((row) => reducerDispatch({ type: 'orderPlaced', order: { ...row, total, items: payload, stage: 0 } }))
        .catch(report('saveOrder'));

      // Simple in-app notification — just the banner, no push/permission setup.
      reducerDispatch({
        type: 'banner',
        banner: { title: 'Order placed', detail: `Your $${total} order is confirmed.` },
      });
    } else if (action.type === 'orderDeleted') {
      deleteOrderDB(action.id).catch(report('deleteOrder'));
    }
    reducerDispatch(action);
  }, []);

  /* ---------------- Boot: open the DB and hydrate state ---------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initDB();
        const [cartRows, voucherRows, addressRows, orderRows] = await Promise.all([
          getCartDB(),
          getVouchersDB(),
          getAddressesDB(),
          getOrdersDB(),
        ]);
        if (cancelled) return;

        const patch: HydratePatch = {
          cart: cartRows
            .filter((row) => MENU.some((d) => d.id === row.id))
            .map((row) => ({ dishId: row.id, qty: row.qty })),
          appliedVouchers: voucherRows.filter((row) => row.applied === 1).map((row) => row.id),
        };

        const address = addressRows[0];
        if (address) {
          patch.address = { street: address.street, city: address.city };
          patch.station = address.station || null;
          patch.deliveryMode = address.mode === 'station' ? 'station' : 'doorstep';
          patch.setAsDefault = address.isDefault === 1;
        }

        const order = orderRows[0];
        const stage = order ? STAGES[order.stage] : undefined;
        if (stage) patch.stage = stage;
        patch.orders = orderRows;

        reducerDispatch({ type: 'hydrate', patch });
      } catch (error) {
        report('hydrate')(error);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- Writes: cart, then order stage ---------------- */
  useEffect(() => {
    if (!hydrated) return;
    const addons = Object.keys(state.addOns).filter((id) => state.addOns[id]);
    saveCartDB(state.cart.map((line) => ({ ...line, addons }))).catch(report('saveCart'));
  }, [hydrated, state.cart, state.addOns]);

  useEffect(() => {
    if (!hydrated) return;
    // Every Track Order stage tap lands on the newest order row. If no order
    // has been placed yet the UPDATE matches zero rows, which is fine.
    updateOrderStageDB(STAGES.indexOf(state.stage)).catch(report('updateStage'));
  }, [hydrated, state.stage]);

  const totals = useMemo(() => computeTotals(state), [state]);
  const cartCount = useMemo(() => state.cart.reduce((n, l) => n + l.qty, 0), [state.cart]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      cartCount,
      subtotal: totals.subtotal,
      addOnTotal: totals.addOnTotal,
      delivery: totals.delivery,
      discount: totals.discount,
      total: totals.total,
    }),
    [state, dispatch, cartCount, totals]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

/** Convenience accessor for screens that only need the auth flag. */
export function useAuth() {
  const { state } = useApp();
  return { signedIn: state.signedIn };
}

export function useNavigate() {
  const { dispatch } = useApp();
  return useCallback(
    (route: Route) => dispatch({ type: 'navigate', route }),
    [dispatch]
  );
}

/** Native-feeling back: pops the stack, or exits the app from a tab root. */
export function useBack() {
  const { dispatch } = useApp();
  return useCallback(() => dispatch({ type: 'back' }), [dispatch]);
}
