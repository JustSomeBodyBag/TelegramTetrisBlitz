document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const rows = 8;
  const cols = 8;
  const cellSize = 40;

  // Игровое поле: 0 — пусто, 1 — занято
  const field = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Текущая фигура (пример: палка 4x1)
  const figure = [
    [1],
    [1],
    [1],
    [1],
  ];

  let figurePos = { row: 0, col: 0 };
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  function drawField() {
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 1;

    // Отрисовка фиксированных клеток
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (field[r][c]) {
          ctx.fillStyle = "#00bfff";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
        ctx.beginPath();
        ctx.rect(c * cellSize, r * cellSize, cellSize, cellSize);
        ctx.stroke();
      }
    }
  }

  function drawFigure(pos) {
    ctx.fillStyle = "#ff6347"; // цвет фигуры
    for (let r = 0; r < figure.length; r++) {
      for (let c = 0; c < figure[r].length; c++) {
        if (figure[r][c]) {
          const x = (pos.col + c) * cellSize;
          const y = (pos.row + r) * cellSize;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  function fixFigure(fig, pos) {
    for (let r = 0; r < fig.length; r++) {
      for (let c = 0; c < fig[r].length; c++) {
        if (fig[r][c]) {
          const fr = pos.row + r;
          const fc = pos.col + c;
          if (fr >= 0 && fr < rows && fc >= 0 && fc < cols) {
            field[fr][fc] = 1;
          }
        }
      }
    }
  }

  function clearFullLines() {
    let linesCleared = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if (field[r].every(cell => cell === 1)) {
        field.splice(r, 1);
        field.unshift(Array(cols).fill(0));
        linesCleared++;
        r++;
      }
    }
    return linesCleared;
  }

  function redraw() {
    drawField();
    drawFigure(figurePos);
  }

  // Инициалный рендер
  redraw();

  // Обработка drag & drop (desktop + mobile)
  function getCellFromCoords(x, y) {
    return {
      col: Math.floor(x / cellSize),
      row: Math.floor(y / cellSize),
    };
  }

  canvas.addEventListener("mousedown", startDrag);
  canvas.addEventListener("touchstart", startDrag);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragOffset.x = clientX - (figurePos.col * cellSize);
    dragOffset.y = clientY - (figurePos.row * cellSize);

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("touchmove", onDrag);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
  }

  function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let col = Math.round((clientX - rect.left - dragOffset.x) / cellSize);
    let row = Math.round((clientY - rect.top - dragOffset.y) / cellSize);

    // Ограничения по границам поля
    col = Math.min(Math.max(col, 0), cols - figure[0].length);
    row = Math.min(Math.max(row, 0), rows - figure.length);

    figurePos = { row, col };
    redraw();
  }

  function endDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    // Фиксируем фигуру на поле
    fixFigure(figure, figurePos);
    const cleared = clearFullLines();
    if (cleared) {
      console.log(`Очистили ${cleared} линий`);
    }

    // Сброс фигуры в начальную позицию (например, верхний левый угол)
    figurePos = { row: 0, col: 0 };

    redraw();

    isDragging = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("touchend", endDrag);
  }
});
