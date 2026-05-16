import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}
function makePng(w, h, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  const rowSize = 1 + w * 3;
  const raw = Buffer.alloc(h * rowSize);
  for (let y = 0; y < h; y++) {
    raw[y * rowSize] = 0;
    for (let x = 0; x < w; x++) {
      raw[y * rowSize + 1 + x * 3] = r;
      raw[y * rowSize + 2 + x * 3] = g;
      raw[y * rowSize + 3 + x * 3] = b;
    }
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdrData),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// テーマカラー #1a1a2e にロゴ文字なしのシンプルアイコン
const [r, g, b] = [0x1a, 0x1a, 0x2e];

mkdirSync("public", { recursive: true });
writeFileSync("public/pwa-192x192.png", makePng(192, 192, r, g, b));
writeFileSync("public/pwa-512x512.png", makePng(512, 512, r, g, b));
writeFileSync("public/apple-touch-icon.png", makePng(180, 180, r, g, b));

// ICO = 16x16 PNG wrapped in ICO container
const png16 = makePng(16, 16, r, g, b);
const icoHeader = Buffer.alloc(6 + 16);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // type = ICO
icoHeader.writeUInt16LE(1, 4); // count
icoHeader[6] = 0; // width (0 = 256, but PNG inside ICO can encode actual size)
icoHeader[7] = 0; // height
icoHeader[8] = 0; // colorCount
icoHeader[9] = 0; // reserved
icoHeader.writeUInt16LE(1, 10); // planes
icoHeader.writeUInt16LE(32, 12); // bitCount
icoHeader.writeUInt32LE(png16.length, 14); // size
icoHeader.writeUInt32LE(22, 18); // offset (6 + 16)
writeFileSync("public/favicon.ico", Buffer.concat([icoHeader, png16]));

console.log("Icons generated in public/");
