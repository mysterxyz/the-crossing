import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const srcDir = path.join(
  process.env.USERPROFILE,
  '.cursor',
  'projects',
  'c-Users-standart',
  'assets',
)

const destDir = path.join(process.cwd(), 'src', 'assets')
fs.mkdirSync(destDir, { recursive: true })

const files = fs.readdirSync(srcDir)
const heroSrc = files.find((f) => f.includes('f629198c'))
const bgSrc = files.find((f) => f.includes('phon-50ec5add'))

if (!heroSrc || !bgSrc) {
  console.error('Missing source images', { files, heroSrc, bgSrc })
  process.exit(1)
}

const bgPath = path.join(srcDir, bgSrc)
const heroPath = path.join(srcDir, heroSrc)

await sharp(bgPath)
  .jpeg({ quality: 95 })
  .toFile(path.join(destDir, 'background.jpg'))

const bgMeta = await sharp(bgPath).metadata()
console.log('background', bgMeta.width, bgMeta.height)

const { data, info } = await sharp(heroPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const out = Buffer.from(data)

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b)
}

function avg(r, g, b) {
  return (r + g + b) / 3
}

function isCheckerOrPaper(r, g, b) {
  const c = chroma(r, g, b)
  const a = avg(r, g, b)
  if (c <= 20 && a >= 70) return true
  if (a >= 235 && c <= 28) return true
  return false
}

function isBodyPixel(r, g, b) {
  const c = chroma(r, g, b)
  const a = avg(r, g, b)
  if (isCheckerOrPaper(r, g, b)) return false
  if (c >= 18) return true
  if (a < 48) return true
  return false
}

const keep = new Uint8Array(width * height)
const stack = []

function trySeed(sx, sy) {
  const i = (sy * width + sx) * channels
  return isBodyPixel(out[i], out[i + 1], out[i + 2])
}

const seeds = [
  [Math.floor(width * 0.5), Math.floor(height * 0.28)],
  [Math.floor(width * 0.48), Math.floor(height * 0.35)],
  [Math.floor(width * 0.52), Math.floor(height * 0.42)],
]
for (const [sx, sy] of seeds) {
  if (trySeed(sx, sy)) stack.push(sy * width + sx)
}

if (stack.length === 0) {
  outer: for (let y = Math.floor(height * 0.15); y < Math.floor(height * 0.55); y++) {
    for (let x = Math.floor(width * 0.25); x < Math.floor(width * 0.75); x++) {
      if (trySeed(x, y)) {
        stack.push(y * width + x)
        break outer
      }
    }
  }
}

while (stack.length) {
  const idx = stack.pop()
  if (keep[idx]) continue
  const x = idx % width
  const y = (idx / width) | 0
  const i = idx * channels
  const r = out[i]
  const g = out[i + 1]
  const b = out[i + 2]
  if (!isBodyPixel(r, g, b) && chroma(r, g, b) < 12 && avg(r, g, b) > 55) continue
  keep[idx] = 1
  if (x > 0) stack.push(idx - 1)
  if (x + 1 < width) stack.push(idx + 1)
  if (y > 0) stack.push(idx - width)
  if (y + 1 < height) stack.push(idx + width)
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x
    const i = idx * channels
    if (!keep[idx]) {
      out[i + 3] = 0
    }
  }
}

const cropped = await sharp(out, { raw: { width, height, channels } })
  .trim({ threshold: 0 })
  .png()
  .toBuffer({ resolveWithObject: true })

await sharp(cropped.data).png().toFile(path.join(destDir, 'hero.png'))
console.log('hero png', cropped.info.width, cropped.info.height)

// Sample background bridge: look at a vertical column near left door
const bgRaw = await sharp(bgPath).raw().toBuffer({ resolveWithObject: true })
const bw = bgRaw.info.width
const bh = bgRaw.info.height
const bc = bgRaw.info.channels
const col = Math.floor(bw * 0.18)
const samplesY = []
for (let y = Math.floor(bh * 0.45); y < Math.floor(bh * 0.7); y += 2) {
  const i = (y * bw + col) * bc
  const r = bgRaw.data[i]
  const g = bgRaw.data[i + 1]
  const b = bgRaw.data[i + 2]
  samplesY.push({ y, r, g, b, avg: Math.round((r + g + b) / 3) })
}
console.log('bridge column samples (y ratio, avg)', samplesY.map((s) => ({
  y: s.y,
  yr: +(s.y / bh).toFixed(3),
  avg: s.avg,
  rgb: [s.r, s.g, s.b],
})))
