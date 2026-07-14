// Ultra-lightweight image dimension parser — no deps, no sharp
// Reads just enough bytes from JPEG/PNG/WebP/GIF headers

const JPEG_SOI = 0xffd8
const APP0_MARKER = 0xffe0
const APP1_MARKER = 0xffe1  // EXIF
const SOF_MARKERS = new Set([0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc9, 0xffca, 0xffcb, 0xffcd, 0xffce, 0xffcf])
const PNG_HEADER = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const WEBP_HEADER = Buffer.from('WEBP')
const GIF_HEADER_87A = Buffer.from('GIF87a')
const GIF_HEADER_89A = Buffer.from('GIF89a')

export function getImageDimensions(buf, mimeType) {
  if (mimeType === 'image/png') return parsePNG(buf)
  if (mimeType === 'image/jpeg') return parseJPEG(buf)
  if (mimeType === 'image/webp') return parseWebP(buf)
  if (mimeType === 'image/gif') return parseGIF(buf)
  return { width: 0, height: 0 }
}

function parsePNG(buf) {
  if (buf.length < 24) return { width: 0, height: 0 }
  // IHDR chunk starts at offset 16 (8 PNG signature + 4 chunk length + 4 'IHDR')
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  }
}

function parseJPEG(buf) {
  if (buf.length < 4) return { width: 0, height: 0 }
  let offset = 2
  while (offset < buf.length - 1) {
    if (buf[offset] !== 0xff) break
    const marker = buf.readUInt16BE(offset)
    offset += 2

    if (marker === JPEG_SOI) continue

    // Start of Frame markers
    if (SOF_MARKERS.has(marker)) {
      if (offset + 5 > buf.length) break
      return {
        height: buf.readUInt16BE(offset + 3),
        width: buf.readUInt16BE(offset + 5),
      }
    }

    // Other marker segments: skip past segment length
    if (marker === APP0_MARKER || marker === APP1_MARKER || (marker >= 0xffe0 && marker <= 0xffef)) {
      if (offset + 1 > buf.length) break
      const segLen = buf.readUInt16BE(offset)
      offset += segLen
    } else if ((marker >= 0xffdb && marker <= 0xffdf) || marker === 0xffdd) {
      if (offset + 1 > buf.length) break
      const segLen = buf.readUInt16BE(offset)
      offset += segLen
    } else if ((marker >= 0xffe0 && marker <= 0xffef) || marker === 0xfffe) {
      if (offset + 1 > buf.length) break
      const segLen = buf.readUInt16BE(offset)
      offset += segLen
    } else if (marker >= 0xff02 && marker <= 0xffbf) {
      // Tables and other markers with segment length
      if (offset + 1 > buf.length) break
      const segLen = buf.readUInt16BE(offset)
      offset += segLen
    } else {
      offset += 1
    }
  }
  return { width: 0, height: 0 }
}

function parseWebP(buf) {
  if (buf.length < 30) return { width: 0, height: 0 }
  const riffTag = buf.toString('ascii', 0, 4)
  const webpTag = buf.toString('ascii', 8, 12)
  if (riffTag !== 'RIFF' || webpTag !== 'WEBP') return { width: 0, height: 0 }

  const format = buf.toString('ascii', 12, 16)
  if (format === 'VP8 ' && buf.length >= 26) {
    const w = buf.readUInt16LE(24) & 0x3fff
    const h = buf.readUInt16LE(26) & 0x3fff
    return { width: w, height: h }
  }
  if (format === 'VP8L' && buf.length >= 25) {
    const bits = buf.readUInt32LE(21)
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    }
  }
  if (format === 'VP8X' && buf.length >= 30) {
    // VP8X extended: width=3 bytes at offset 24, height=3 bytes at offset 27
    return {
      width: buf.readUIntLE(24, 3) + 1,
      height: buf.readUIntLE(27, 3) + 1,
    }
  }
  return { width: 0, height: 0 }
}

function parseGIF(buf) {
  if (buf.length < 10) return { width: 0, height: 0 }
  return {
    width: buf.readUInt16LE(6),
    height: buf.readUInt16LE(8),
  }
}
