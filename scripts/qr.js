/**
 * Prints the Expo dev-server URL as a terminal QR code.
 * Matrix comes from `toqr` (an Expo dependency); verify with scripts/verify-qr.js.
 * Usage: node scripts/qr.js [url]
 */
const { toQR } = require('toqr');

const url = process.argv[2] || 'exp://localhost:8081';
const flat = toQR(url);
const size = Math.round(Math.sqrt(flat.length));
const at = (r, c) => flat[r * size + c] === 1;

const WHITE = '\x1b[47m  \x1b[0m';
const BLACK = '\x1b[40m  \x1b[0m';
const QUIET = 4;

let out = '\n';
out += `  Jay FoodHub - Expo dev server\n`;
out += `  ${url}\n`;
out += `  QR ${size}x${size} modules\n\n`;
for (let y = -QUIET; y < size + QUIET; y++) {
  for (let x = -QUIET; x < size + QUIET; x++) {
    const dark = y >= 0 && y < size && x >= 0 && x < size && at(y, x);
    out += dark ? BLACK : WHITE;
  }
  out += '\n';
}
out += '\n';
process.stdout.write(out);
