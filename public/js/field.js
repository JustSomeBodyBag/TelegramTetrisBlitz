export function createField(rows, cols) {
  const field = [];
  for (let i = 0; i < rows; i++) {
    field.push(new Array(cols).fill(0));
  }
  return field;
}

export function drawFixedBlocks(ctx, field, cellSize) {
  ctx.fillStyle = "#0066cc";
  ctx.strokeStyle = "#003366";
  ctx.lineWidth = 1;

  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
      if (field[r][c]) {
        const x = c * cellSize;
        const y = r * cellSize;

        // Заливка блока
        ctx.fillRect(x, y, cellSize, cellSize);

        // Внутренние границы
        ctx.strokeRect(x, y, cellSize, cellSize);
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
  const rows = field.length;
  const cols = field[0].length;

  let clearedRows = 0;
  let clearedCols = 0;

  // Очищаем полные строки
  for (let r = 0; r < rows; r++) {
    if (field[r].every(cell => cell === 1)) {
      for (let c = 0; c < cols; c++) {
        field[r][c] = 0;
      }
      clearedRows++;
    }
  }

  // Очищаем полные столбцы
  for (let c = 0; c < cols; c++) {
    let fullCol = true;
    for (let r = 0; r < rows; r++) {
      if (field[r][c] !== 1) {
        fullCol = false;
        break;
      }
    }
    if (fullCol) {
      for (let r = 0; r < rows; r++) {
        field[r][c] = 0;
      }
      clearedCols++;
    }
  }

  return { totalCleared: clearedRows + clearedCols };
}


export function doesFigureFit(field, shape, position) {
  const { row: posRow, col: posCol } = position;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) { // если в этой клетке фигуры есть блок (например, 1)
        const fieldRow = posRow + r;
        const fieldCol = posCol + c;

        // Проверяем выход за границы поля
        if (fieldRow < 0 || fieldRow >= field.length || fieldCol < 0 || fieldCol >= field[0].length) {
          return false;
        }

        // Проверяем, занята ли уже клетка поля
        if (field[fieldRow][fieldCol]) {
          return false;
        }
      }
    }
  }
  return true;
}