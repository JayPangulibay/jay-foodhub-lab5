/**
 * Renders the Expo dev-server URL as a scannable PNG.
 *
 * The QR matrix comes from `toqr` (already present as an Expo dependency);
 * we only add PNG encoding. Use scripts/verify-qr.js to confirm the output
 * actually decodes.
 *
 * Usage: node scripts/qr-png.js <url> <out.png> [scale]
 */
const zlib = require('node:zlib');
const fs = require('node:fs');
const { toQR } = require('toqr');

const url = process.argv[2] || 'exp://localhost:8081';
const out = process.argv[3] || 'qr.png';
const scale = Number(process.argv[4] || 8);

// toQR returns a flat array of 0/1 in row-major order.
const flat = toQR(url);
const size = Math.round(Math.sqrt(flat.length));
if (size * size !== flat.length) {
  throw new Error(`toQR returned ${flat.length} modules, not a perfect square`);
}
const at = (r, c) => flat[r * size + c] === 1;

const QUIET = 4;
const dim = (size + QUIET * 2) * scale;

// Brand colours from src/theme/index.ts
const DARK = [0x33, 0x68, 0xa0];
const LIGHT = [0xff, 0xff, 0xff];

const raw = Buffer.alloc((dim * 3 + 1) * dim);
let p = 0;
for (let y = 0; y < dim; y++) {
  raw[p++] = 0; // filter: none
  const my = Math.floor(y / scale) - QUIET;
  for (let x = 0; x < dim; x++) {
    const mx = Math.floor(x / scale) - QUIET;
    const inside = my >= 0 && my < size && mx >= 0 && mx < size;
    const c = inside && at(my, mx) ? DARK : LIGHT;
    raw[p++] = c[0];
    raw[p++] = c[1];
    raw[p++] = c[2];
  }
}

let table = null;
function crc32(buf) {
  if (!table) {
    table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(dim, 0);
ihdr.writeUInt32BE(dim, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // truecolour
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync(out, png);
process.stdout.write(
  `wrote ${out}\n  url   : ${url}\n  matrix: ${size}x${size} modules\n  image : ${dim}x${dim} px, ${png.length} bytes\n`
);
