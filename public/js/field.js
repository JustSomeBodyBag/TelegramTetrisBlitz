export function createField(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

export function drawFixedBlocks(ctx, field, cellSize) {
  ctx.fillStyle = "#3498db";
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
      if (field[r][c]) {
        const x = c * cellSize;
        const y = r * cellSize;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }
}

export function fixFigureToField(field, figure, figurePos) {
  for (let r = 0; r < figure.length; r++) {
    for (let c = 0; c < figure[r].length; c++) {
      if (figure[r][c]) {
        const fr = figurePos.row + r;
        const fc = figurePos.col + c;
        field[fr][fc] = 1;
      }
    }
  }
}

export function clearFullRows(field) {
  for (let r = 0; r < field.length; r++) {
    if (field[r].every(cell => cell === 1)) {
      for (let c = 0; c < field[r].length; c++) {
        field[r][c] = 0;
      }
    }
  }
}
