/**
 * Client-side image compression before upload
 * Compresses if file > MAX_BYTES. Auto-crops to MAX_RATIO if too wide/tall.
 */
const MAX_BYTES = 2 * 1024 * 1024  // 2MB — compress if bigger
const MAX_DIM = 2048               // max width/height
const MAX_RATIO = 2 / 1            // crop if wider than 2:1 (e.g. 2:1 → keep, 3:1 → crop)

export async function compressImage(file) {
  // Never touch GIFs (animation)
  if (file.type === 'image/gif') return file

  // Always crop aspect ratio first, then compress if needed
  const img = await loadImage(file)
  const cropped = cropToRatio(img, MAX_RATIO)
  const downscaled = downscale(cropped, MAX_DIM)

  // Skip compression if no crop, no downscale, and already small
  if (cropped.sx === 0 && cropped.sy === 0 && cropped.sw === img.width && cropped.sh === img.height
      && downscaled.dw === cropped.sw && downscaled.dh === cropped.sh
      && file.size <= MAX_BYTES) {
    return file
  }

  return renderToFile(downscaled, file)
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.src = url
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => reject(new Error('Failed to load image'))
  })
}

function cropToRatio(img, maxRatio) {
  const ratio = img.width / img.height
  let sx = 0, sy = 0, sw = img.width, sh = img.height
  if (ratio > maxRatio) {
    sw = Math.round(img.height * maxRatio)
    sx = Math.round((img.width - sw) / 2)
  } else if (ratio < 1 / maxRatio) {
    sh = Math.round(img.width * maxRatio)
    sy = Math.round((img.height - sh) / 2)
  }
  return { img, sx, sy, sw, sh }
}

function downscale({ img, sx, sy, sw, sh }, maxDim) {
  let dw = sw, dh = sh
  if (dw > maxDim || dh > maxDim) {
    const scale = Math.min(maxDim / dw, maxDim / dh)
    dw = Math.round(dw * scale)
    dh = Math.round(dh * scale)
  }
  return { img, sx, sy, sw, sh, dw, dh }
}

function renderToFile({ img, sx, sy, sw, sh, dw, dh }, originalFile) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = dw
    canvas.height = dh
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)

    const type = ['image/png', 'image/avif'].includes(originalFile.type) ? 'image/webp' : 'image/jpeg'
    const quality = originalFile.size > 5 * 1024 * 1024 ? 0.6 : 0.8

    canvas.toBlob((blob) => {
      if (!blob) return resolve(originalFile)
      resolve(new File([blob], originalFile.name.replace(/\.[^.]+$/, '.webp'), { type }))
    }, type, quality)
  })
}
