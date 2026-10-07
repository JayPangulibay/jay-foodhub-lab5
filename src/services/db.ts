/**
 * SQLite persistence layer — LABORATORY 5.
 *
 * SDK 57 async API only: `openDatabaseAsync`, `execAsync`, `runAsync`,
 * `getAllAsync`, `getFirstAsync`. The synchronous legacy API is gone in this
 * SDK, so every function here returns a promise.
 *
 * Persistence is best-effort: expo-sqlite's web target is still alpha, so the
 * app must keep running from in-memory state if any of this rejects. Callers
 * are expected to `.catch()` rather than let a write reject a render.
 */
import * as SQLite from 'expo-sqlite';
import { DEFAULT_CART, MENU, VOUCHERS } from '../data/menu';

export const DB_NAME = 'jayfoodhub.db';

/* ------------------------------------------------------------------ */
/* Row shapes — one per table                                          */
/* ------------------------------------------------------------------ */

export type CartRow = {
  id: string;
  name: string;
  price: number;
  qty: number;
  /** Selected add-on ids serialised as JSON. */
  addons: string;
};

export type AddressRow = {
  id: number;
  street: string;
  city: string;
  station: string;
  mode: string;
  isDefault: number;
  timestamp: string;
};

export type OrderRow = {
  id: number;
  total: number;
  items: string;
  stage: number;
  timestamp: string;
};

/**
 * One entry of the JSON blob stored in `orders.items`. `price` is only present
 * on rows written from LABORATORY 6 onward, so older rows still render (their
 * line totals fall back to the order total).
 */
export type OrderItem = { id: string; name: string; qty: number; price?: number };

/** Never lets a malformed `items` value break the Orders list. */
export function parseOrderItems(items: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(items);
    return Array.isArray(parsed) ? (parsed as OrderItem[]) : [];
  } catch {
    return [];
  }
}

export type VoucherRow = { id: string; applied: number };

/** What `saveCartDB` accepts — a cart line plus the selected add-on ids. */
export type CartLineInput = { dishId: string; qty: number; addons?: string[] };

/** What `addAddressDB` accepts. */
export type AddressInput = {
  street: string;
  city: string;
  station: string | null;
  mode: string;
  isDefault: boolean;
  timestamp: string;
};

/* ------------------------------------------------------------------ */
/* Connection                                                          */
/* ------------------------------------------------------------------ */

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Singleton — every caller shares one connection. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  return dbPromise;
}

/**
 * Serialises every write so statements issued in the same tick keep their call
 * order. PLACE_ORDER registers a stage UPDATE and an INSERT back to back; with
 * the old fire-and-forget calls the UPDATE could reach the previous order row
 * first and silently rewind it to "Preparing".
 *
 * Rejections are swallowed on the chain itself (the caller still receives them)
 * so one failed write never wedges the queue.
 */
let writeChain: Promise<unknown> = Promise.resolve();

function write<T>(run: () => Promise<T>): Promise<T> {
  const queued = writeChain.then(run, run);
  writeChain = queued.catch(() => {});
  return queued;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS cart (
  id TEXT PRIMARY KEY,
  name TEXT,
  price REAL,
  qty INTEGER,
  addons TEXT
);
CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  street TEXT,
  city TEXT,
  station TEXT,
  mode TEXT,
  isDefault INTEGER,
  timestamp TEXT
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total REAL,
  items TEXT,
  stage INTEGER,
  timestamp TEXT
);
CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  applied INTEGER
);
`;

/**
 * Creates the four tables and seeds a first launch:
 *  - the four §10 vouchers (so Savings has rows to read), and
 *  - the two cart lines the prototype opens with.
 *
 * "First launch" is detected by asking whether the vouchers table is empty
 * *before* seeding it — no extra bookkeeping table needed. A cart that was
 * emptied by PLACE_ORDER therefore stays empty on the next boot.
 *
 * Must settle before anything else touches the database.
 */
export async function initDB(): Promise<void> {
  const db = await getDb();
  await db.execAsync(SCHEMA);

  const count = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM vouchers');
  const firstLaunch = !count || count.n === 0;

  for (const voucher of VOUCHERS) {
    await db.runAsync('INSERT OR IGNORE INTO vouchers (id, applied) VALUES (?, 0)', voucher.id);
  }

  if (firstLaunch) {
    for (const line of DEFAULT_CART) {
      const dish = MENU.find((d) => d.id === line.dishId);
      if (!dish) continue;
      await db.runAsync(
        'INSERT OR REPLACE INTO cart (id, name, price, qty, addons) VALUES (?, ?, ?, ?, ?)',
        dish.id,
        dish.name,
        dish.price,
        line.qty,
        '[]'
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/* cart                                                                */
/* ------------------------------------------------------------------ */

export async function getCartDB(): Promise<CartRow[]> {
  const db = await getDb();
  return db.getAllAsync<CartRow>('SELECT * FROM cart');
}

/**
 * Rewrites the cart wholesale. The table is a snapshot of in-memory state, so
 * DELETE-then-INSERT is the simplest correct sync; `name`/`price` are denormalised
 * from the menu so an order row can be rebuilt without joining.
 */
export function saveCartDB(cart: CartLineInput[]): Promise<void> {
  return write(async () => {
    const db = await getDb();
    await db.execAsync('DELETE FROM cart');
    for (const line of cart) {
      const dish = MENU.find((d) => d.id === line.dishId);
      if (!dish) continue;
      await db.runAsync(
        'INSERT INTO cart (id, name, price, qty, addons) VALUES (?, ?, ?, ?, ?)',
        dish.id,
        dish.name,
        dish.price,
        line.qty,
        JSON.stringify(line.addons ?? [])
      );
    }
  });
}

/* ------------------------------------------------------------------ */
/* addresses                                                           */
/* ------------------------------------------------------------------ */

/** Newest first, so `[0]` is the most recently saved address. */
export async function getAddressesDB(): Promise<AddressRow[]> {
  const db = await getDb();
  return db.getAllAsync<AddressRow>('SELECT * FROM addresses ORDER BY id DESC');
}

export function addAddressDB(address: AddressInput): Promise<void> {
  return write(async () => {
    const db = await getDb();
    if (address.isDefault) {
      await db.runAsync('UPDATE addresses SET isDefault = 0');
    }
    await db.runAsync(
      'INSERT INTO addresses (street, city, station, mode, isDefault, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
      address.street,
      address.city,
      address.station ?? '',
      address.mode,
      address.isDefault ? 1 : 0,
      address.timestamp
    );
  });
}

/* ------------------------------------------------------------------ */
/* orders                                                              */
/* ------------------------------------------------------------------ */

/** Newest first, so `[0]` is the order currently being tracked. */
export async function getOrdersDB(): Promise<OrderRow[]> {
  const db = await getDb();
  return db.getAllAsync<OrderRow>('SELECT * FROM orders ORDER BY id DESC');
}

/** PLACE_ORDER — one row per placed order. `stage` is an index into STAGES.
 *
 * Resolves with the row's id *and* timestamp so the caller can push exactly
 * what was written into state; without them the Orders list would not refresh
 * until the next boot, or would disagree with the table on the date shown. */
export function saveOrderDB(
  total: number,
  items: string,
  stage = 0
): Promise<{ id: number; timestamp: string }> {
  return write(async () => {
    const db = await getDb();
    const timestamp = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO orders (total, items, stage, timestamp) VALUES (?, ?, ?, ?)',
      total,
      items,
      stage,
      timestamp
    );
    return { id: result.lastInsertRowId, timestamp };
  });
}

/** ADVANCE_STAGE — writes the new stage onto the most recent order. */
export function updateOrderStageDB(stage: number): Promise<void> {
  return write(async () => {
    const db = await getDb();
    await db.runAsync('UPDATE orders SET stage = ? WHERE id = (SELECT MAX(id) FROM orders)', stage);
  });
}

/** DELETE_ORDER — removes a single row from the history. */
export function deleteOrderDB(id: number): Promise<void> {
  return write(async () => {
    const db = await getDb();
    await db.runAsync('DELETE FROM orders WHERE id = ?', id);
  });
}

/* ------------------------------------------------------------------ */
/* vouchers                                                            */
/* ------------------------------------------------------------------ */

export async function getVouchersDB(): Promise<VoucherRow[]> {
  const db = await getDb();
  return db.getAllAsync<VoucherRow>('SELECT * FROM vouchers');
}

/**
 * TOGGLE_VOUCHER — flips 0/1. `initDB` seeds every §10 voucher, so the
 * ON CONFLICT branch is the one that runs; the INSERT branch only matters if a
 * row is somehow missing.
 */
export function toggleVoucherDB(id: string): Promise<void> {
  return write(async () => {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO vouchers (id, applied) VALUES (?, 1) ON CONFLICT(id) DO UPDATE SET applied = 1 - applied',
      id
    );
  });
}
