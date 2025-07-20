export function getGameCanvasBounds(floatingCanvas, gameCanvas) {
  const floatRect = floatingCanvas.getBoundingClientRect();
  const gameRect = gameCanvas.getBoundingClientRect();

  return {
    left: gameRect.left - floatRect.left,
    top: gameRect.top - floatRect.top,
    right: gameRect.right - floatRect.left,
    bottom: gameRect.bottom - floatRect.top,
    width: gameRect.width,
    height: gameRect.height
  };
}

export function isFigureInDeadZone(figureBounds, gameBounds, threshold = 15) {
  if (figureBounds.left < gameBounds.left - threshold) return true;
  if (figureBounds.right > gameBounds.right + threshold) return true;
  if (figureBounds.top < gameBounds.top - threshold) return true;
  if (figureBounds.bottom > gameBounds.bottom + threshold) return true;
  return false;
}
