export function createField(rows, cols) {
  const field = [];
  for (let i = 0; i < rows; i++) {
    field.push(new Array(cols).fill(0));
  }
  return field;
}

export function drawFixedBlocks(ctx, field, cellSize) {
  ctx.fillStyle = "#0066cc";
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
      if (field[r][c]) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
}

export function fixFigureToField(field, figure, pos) {
  for (let r = 0; r < figure.length; r++) {
    for (let c = 0; c < figure[r].length; c++) {
      if (figure[r][c]) {
        const fr = pos.row + r;
        const fc = pos.col + c;
        if (field[fr] && field[fr][fc] !== undefined) {
          field[fr][fc] = 1;
        }
      }
    }
  }
}

export function clearFullLines(field) {
  for (let r = field.length - 1; r >= 0; r--) {
    if (field[r].every(cell => cell === 1)) {
      field.splice(r, 1);
      field.unshift(new Array(field[0].length).fill(0));
      r++; // проверить эту строку ещё раз после смещения
    }
  }
}
