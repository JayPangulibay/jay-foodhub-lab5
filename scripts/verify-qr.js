/**
 * Decodes a QR PNG with an independent library (jsQR) to prove the code in
 * scripts/qr-png.js is actually scannable, rather than trusting our own encoder.
 * Usage: node scripts/verify-qr.js <png> [expectedPayload]
 */
const fs = require('node:fs');
const path = require('node:path');

const VERIFY_DIR = 'C:\\Users\\User\\AppData\\Local\\Temp\\opencode\\qrverify';
const { PNG } = require(path.join(VERIFY_DIR, 'node_modules', 'pngjs'));
const jsQR = require(path.join(VERIFY_DIR, 'node_modules', 'jsqr'));

const file = process.argv[2];
const expected = process.argv[3];

const png = PNG.sync.read(fs.readFileSync(file));

const result = jsQR(
  new Uint8ClampedArray(png.data),
  png.width,
  png.height
);

if (!result) {
  console.log('decode      : FAILED — no QR found in ' + file);
  console.log('             : ' + png.width + 'x' + png.height + ' px');
  process.exitCode = 1;
} else {
  console.log('decode      : OK');
  console.log('  image     : ' + png.width + 'x' + png.height + ' px');
  console.log('  payload   : ' + result.data);
  if (expected !== undefined) {
    if (result.data === expected) {
      console.log('  match     : OK — payload equals the dev-server URL');
    } else {
      console.log('  match     : MISMATCH — expected ' + expected);
      process.exitCode = 1;
    }
  }
}
