export function drawFigure(ctx, figure, position, cellSize, pixelCoords = null) {
  const rows = figure.length;
  const cols = figure[0].length;

  let offsetX, offsetY;

  if (pixelCoords) {
    // Центрировать фигуру вокруг координат пальца/мыши
    const figureWidth = cols * cellSize;
    const figureHeight = rows * cellSize;

    offsetX = pixelCoords.x - figureWidth / 2;
    offsetY = pixelCoords.y - figureHeight / 2;
  } else {
    offsetX = position.col * cellSize;
    offsetY = position.row * cellSize;
  }

  ctx.fillStyle = "#00ffff";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (figure[r][c]) {
        const x = offsetX + c * cellSize;
        const y = offsetY + r * cellSize;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
}
