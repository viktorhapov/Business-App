import { deflateSync } from 'node:zlib'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'public', 'icons')
await mkdir(out, { recursive: true })

const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c >>> 0
}

function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const name = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([length, name, data, checksum])
}

function distanceToSegment(x, y, [x1, y1, x2, y2]) {
  const dx = x2 - x1
  const dy = y2 - y1
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))
}

function createIcon(size) {
  const rowBytes = size * 4 + 1
  const pixels = Buffer.alloc(rowBytes * size)
  const scale = size / 512
  const marks = [[168, 346, 230, 217], [251, 346, 313, 217], [334, 346, 383, 244]]
  for (let y = 0; y < size; y++) {
    const row = y * rowBytes
    pixels[row] = 0
    for (let x = 0; x < size; x++) {
      const px = (x + 0.5) / scale
      const py = (y + 0.5) / scale
      const dark = marks.some(mark => distanceToSegment(px, py, mark) < 19)
      const offset = row + 1 + x * 4
      pixels[offset] = dark ? 20 : 143
      pixels[offset + 1] = dark ? 35 : 181
      pixels[offset + 2] = dark ? 58 : 255
      pixels[offset + 3] = 255
    }
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header[8] = 8
  header[9] = 6
  header[10] = 0
  header[11] = 0
  header[12] = 0
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const [name, size] of [['app-icon-192.png', 192], ['app-icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  await writeFile(path.join(out, name), createIcon(size))
  process.stdout.write(`Created public/icons/${name}\n`)
}
