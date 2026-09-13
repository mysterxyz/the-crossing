export const SCENE = {
  imageWidth: 5244,
  imageHeight: 2697,
  startX: 0.123,
  endX: 0.845,
  bridgeY: 0.632,
  heroHeight: 0.068,
}

export function mapCoverPoint(nx, ny, viewW, viewH) {
  const scale = Math.max(
    viewW / SCENE.imageWidth,
    viewH / SCENE.imageHeight,
  )
  const drawW = SCENE.imageWidth * scale
  const drawH = SCENE.imageHeight * scale
  const offsetX = (viewW - drawW) / 2
  const offsetY = (viewH - drawH) / 2

  return {
    x: offsetX + nx * SCENE.imageWidth * scale,
    y: offsetY + ny * SCENE.imageHeight * scale,
    scale,
    drawW,
    drawH,
  }
}
