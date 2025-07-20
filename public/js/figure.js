export function drawFigure(ctx, figure, position, cellSize, pixelPos = null) {
  ctx.fillStyle = "#00bfff";

  for (let r = 0; r < figure.length; r++) {
    for (let c = 0; c < figure[r].length; c++) {
      if (figure[r][c]) {
        let x, y;
        if (pixelPos) {
          x = pixelPos.x + c * cellSize;
          y = pixelPos.y + r * cellSize;
        } else {
          x = (position.col + c) * cellSize;
          y = (position.row + r) * cellSize;
        }
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
}
