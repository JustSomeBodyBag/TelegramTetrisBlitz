export function drawFigure(ctx, figure, figurePos, cellSize) {
  ctx.fillStyle = "#ff6347";
  for (let r = 0; r < figure.length; r++) {
    for (let c = 0; c < figure[r].length; c++) {
      if (figure[r][c]) {
        const x = (figurePos.col + c) * cellSize;
        const y = (figurePos.row + r) * cellSize;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }
}
