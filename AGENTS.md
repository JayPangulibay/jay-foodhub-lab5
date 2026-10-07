This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

Navigation is a hand-rolled stack in `src/state/AppContext.tsx`, **not** Expo Router. The `Route` union is the single source of truth; `src/App.tsx` maps a route name to a screen component. Screens live in `src/screens/`, shared UI in `src/components/`.

This deliberately diverges from the usual Expo Router convention because the prototype is a single 7-screen canvas presented as one flow. If you migrate to Expo Router, routes become files in `src/app/`, the `Route` union is replaced by route segments, and `AppContext` keeps only cross-screen state (cart, address, order stage).

## Persistence

`src/services/db.ts` owns every SQLite call, using the SDK 57 async API (`openDatabaseAsync`, `execAsync`, `runAsync`, `getAllAsync`, `getFirstAsync`). `initDB()` creates and seeds four tables — `cart`, `addresses`, `orders`, `vouchers` — and treats an empty `vouchers` table as "first launch" so a basket emptied by PLACE_ORDER stays empty on the next boot.

`src/state/AppContext.tsx` hydrates cart, vouchers, address and order stage on boot, then writes back through two effects (cart, stage) and a dispatch wrapper for `toggleVoucher` / `placeOrder`. All persistence is best-effort: every call is `.catch`-ed so the UI keeps its in-memory state if the database rejects — expo-sqlite's web target is still alpha.

Two things that will bite you:

- `metro.config.js` is **not optional**. It registers `wasm` as a Metro asset; without it `expo export --platform web` fails on `expo-sqlite/web/worker.ts` importing `wa-sqlite.wasm`. Serving the export additionally needs the `Cross-Origin-Embedder-Policy` / `Cross-Origin-Opener-Policy` headers for `SharedArrayBuffer`.
- `npx expo export:web` no longer works in SDK 57 ("can only be used with Webpack"). The command is `npx expo export --platform web`.

## The design source of truth

`LAYOUT-SPECS.md` holds exact values extracted from the Figma file `JSI1s78lnzSlxcBdbgf6zI`, node `2:3312`. Every dimension, colour, font size and opacity in the UI traces back to a row in that document. Read the relevant section before styling anything — do not eyeball values or invent spacing.

- `src/theme/index.ts` is the token layer. Screens consume tokens, never raw hex.
- Screens scale measurements with `useScale()` from `src/components/scale.ts`. The design is authored at 428pt; call `px()` rather than hardcoding.
- Muted text is `#3368A0` at reduced opacity. There is no second grey.
- Shadows are blue-tinted. On Android, `shadowColor` must be `#3368A0` or it renders black.
- The 44px screen radius and the 18px/42px screen shadow are presentation chrome for the artboard. In-app, screens are full-bleed with no radius.

## Assets

Images live in `src/assets/` and are required from `src/data/menu.ts`. Two gotchas that have already bitten this project:

1. The Figma exports are **JPEG data despite `.png` names**. Extensions were corrected to match the actual bytes. Verify magic bytes before trusting a new file's extension.
2. This project sits inside a OneDrive-synced folder, so files arrive as **cloud placeholders** (`ReparsePoint` attribute) with no local bytes. Metro cannot bundle those and fails with `Unable to resolve module`. Re-hydrate any new image before committing it:

```powershell
$b = [System.IO.File]::ReadAllBytes($p)
[System.IO.File]::WriteAllBytes("$env:TEMP\hydrate.tmp", $b)
Move-Item -LiteralPath "$env:TEMP\hydrate.tmp" -Destination $p -Force
```

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
