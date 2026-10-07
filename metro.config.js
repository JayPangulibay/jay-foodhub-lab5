// Metro configuration for Jay FoodHub.
//
// Required by expo-sqlite's web build: `web/worker.ts` imports its wa-sqlite
// engine as `./wa-sqlite/wa-sqlite.wasm`, which Metro only resolves once `wasm`
// is registered as an asset. See the "Web setup" section of
// https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
//
// Serving the exported site also needs the Cross-Origin-Embedder-Policy and
// Cross-Origin-Opener-Policy headers described on that page, otherwise the
// SharedArrayBuffer that wa-sqlite uses is unavailable at runtime.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

module.exports = config;
