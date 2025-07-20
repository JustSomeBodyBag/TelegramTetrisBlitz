export function drawFigure(ctx, figure, position, cellSize, dragCoords) {
  ctx.fillStyle = "#00bfff";

  if (dragCoords) {
    const offsetX = dragCoords.x - (figure[0].length * cellSize) / 2;
    const offsetY = dragCoords.y - (figure.length * cellSize) / 2;

    for (let row = 0; row < figure.length; row++) {
      for (let col = 0; col < figure[row].length; col++) {
        if (figure[row][col]) {
          ctx.fillRect(
            offsetX + col * cellSize,
            offsetY + row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  } else if (position) {
    for (let row = 0; row < figure.length; row++) {
      for (let col = 0; col < figure[row].length; col++) {
        if (figure[row][col]) {
          ctx.fillRect(
            (position.col + col) * cellSize,
            (position.row + row) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  }
}
