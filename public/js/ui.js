document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const rows = 8;
  const cols = 8;
  const cellSize = canvas.width / cols;

  // Фигуры — массив координат (x,y) относительно базовой клетки
  const FIGURES = [
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }], // I
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }], // L
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], // квадрат
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }]  // Z
  ];

  // Переменные состояния
  let activeFigure = FIGURES[0];
  let figurePos = { row: 2, col: 2 };
  let isDragging = false;

  // Отрисовка сетки
  function drawGrid() {
    // Заливка фона
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Линии сетки
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 1;

    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(cols * cellSize, i * cellSize);
      ctx.stroke();
    }

    for (let j = 0; j <= cols; j++) {
      ctx.beginPath();
      ctx.moveTo(j * cellSize, 0);
      ctx.lineTo(j * cellSize, rows * cellSize);
      ctx.stroke();
    }
  }

  // Отрисовка фигуры
  function drawFigure(baseRow, baseCol, shape, color = "#00ffcc") {
    ctx.fillStyle = color;
    shape.forEach(({ x, y }) => {
      const row = baseRow + y;
      const col = baseCol + x;

      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    });
  }

  // Очистка холста
  function clearCanvas() {
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Рендер всего
  function render() {
    clearCanvas();
    drawGrid();
    drawFigure(figurePos.row, figurePos.col, activeFigure);
  }

  // Получить клетку из координат мыши/тача
  function getCellFromCoords(x, y) {
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((x - rect.left) / cellSize);
    const row = Math.floor((y - rect.top) / cellSize);
    return { row, col };
  }

  // Ограничение по границам
  function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }

  // Обработчики мыши
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    const { row, col } = getCellFromCoords(e.clientX, e.clientY);
    figurePos = {
      row: clamp(row, 0, rows - 4),
      col: clamp(col, 0, cols - 4)
    };
    render();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const { row, col } = getCellFromCoords(e.clientX, e.clientY);
    figurePos = {
      row: clamp(row, 0, rows - 4),
      col: clamp(col, 0, cols - 4)
    };
    render();
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Обработчики тача
  canvas.addEventListener("touchstart", (e) => {
    isDragging = true;
    const touch = e.touches[0];
    const { row, col } = getCellFromCoords(touch.clientX, touch.clientY);
    figurePos = {
      row: clamp(row, 0, rows - 4),
      col: clamp(col, 0, cols - 4)
    };
    render();
  });

  canvas.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const { row, col } = getCellFromCoords(touch.clientX, touch.clientY);
    figurePos = {
      row: clamp(row, 0, rows - 4),
      col: clamp(col, 0, cols - 4)
    };
    render();
  });

  canvas.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Первая отрисовка
  render();
});
