const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rows = 8;
const cols = 8;
const cellSize = 40;

// Пример фигур (без вращения), координаты относительно (0,0) фигуры
const figures = [
  [ {x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:3,y:0} ],       // I - 4 клетки горизонтально
  [ {x:0,y:0}, {x:0,y:1}, {x:1,y:0}, {x:1,y:1} ],       // O - квадрат 2x2
  [ {x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:2,y:1} ],       // L - 3 по горизонтали + 1 снизу справа
];

// Активная фигура и позиция
let activeFigure = figures[0];
let figurePos = { row: 0, col: 0 };

let isDragging = false;

// Ограничение по диапазону
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Получить размер фигуры (ширина и высота в клетках)
function getFigureSize(shape) {
  let maxX = 0;
  let maxY = 0;
  shape.forEach(({ x, y }) => {
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });
  return { width: maxX + 1, height: maxY + 1 };
}

// Преобразовать координаты мыши/тача в индексы клеток
function getCellFromCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  return { row, col };
}

// Рисуем сетку и фигуру
function drawGrid() {
  // Фон
  ctx.fillStyle = "#18222d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Сетка
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

  // Рисуем фигуру
  ctx.fillStyle = "#00bfff";
  activeFigure.forEach(({ x, y }) => {
    const drawX = (figurePos.col + x) * cellSize;
    const drawY = (figurePos.row + y) * cellSize;
    ctx.fillRect(drawX, drawY, cellSize, cellSize);
    ctx.strokeStyle = "#005577";
    ctx.strokeRect(drawX, drawY, cellSize, cellSize);
  });
}

function render() {
  drawGrid();
}

render();

// Получаем размер фигуры один раз
const figureSize = getFigureSize(activeFigure);

// Обработка мыши
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  const { row, col } = getCellFromCoords(e.clientX, e.clientY);
  figurePos = {
    row: clamp(row, 0, rows - figureSize.height),
    col: clamp(col, 0, cols - figureSize.width)
  };
  render();
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const { row, col } = getCellFromCoords(e.clientX, e.clientY);
  figurePos = {
    row: clamp(row, 0, rows - figureSize.height),
    col: clamp(col, 0, cols - figureSize.width)
  };
  render();
});

canvas.addEventListener("mouseup", (e) => {
  isDragging = false;
});

// Обработка тача (для мобильных)
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDragging = true;
  const touch = e.touches[0];
  const { row, col } = getCellFromCoords(touch.clientX, touch.clientY);
  figurePos = {
    row: clamp(row, 0, rows - figureSize.height),
    col: clamp(col, 0, cols - figureSize.width)
  };
  render();
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDragging) return;
  const touch = e.touches[0];
  const { row, col } = getCellFromCoords(touch.clientX, touch.clientY);
  figurePos = {
    row: clamp(row, 0, rows - figureSize.height),
    col: clamp(col, 0, cols - figureSize.width)
  };
  render();
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  isDragging = false;
});
