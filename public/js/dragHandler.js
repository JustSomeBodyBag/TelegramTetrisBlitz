import { fixFigureToField, clearFullLines, doesFigureFit } from './field.js';
import { redrawScene } from './redraw.js';

let floatingCanvas, gameCanvas, field, cellSize, cols, rows;
let figuresRef, setFigures, figuresPosRef, setFiguresPos, redraw;
let drawField;

let dragIndex = null;
let dragCoords = null;
let dragOffset = { x: 0, y: 0 };
let isDragging = false;

let lastTouchPos = null;    // Позиция пальца при прошлом событии
let startTouchPos = null;   // Стартовая позиция пальца (clientX/clientY)
let startDragPos = null;    // Начальная позиция фигуры

let baseSensitivity = 1.0;  // Минимальная чувствительность
let sensitivityBoost = 0.15; // Коэффициент усиления чувствительности

// Функции для обновления счёта — будут переданы из main.js
let updateScore = () => {};
let updateScoreBoard = () => {};
let onFigurePlaced = null; // Функция вызывается после успешного размещения фигуры
let checkGameOver = () => {};

export function setTouchSensitivity(value) {
  baseSensitivity = value;
}

export function initializeDragHandlers(params) {
  ({
    floatingCanvas,
    gameCanvas,
    field,
    figuresRef,
    setFigures,
    figuresPosRef,
    setFiguresPos,
    cellSize,
    cols,
    rows,
    redraw,
    drawField,
    updateScore,
    updateScoreBoard,
    onFigurePlaced,
    checkGameOver
  } = params);

  updateScore(10);
  updateScoreBoard();

  floatingCanvas.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  floatingCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onDragStart(e.touches[0]);
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    onDragMove(e.touches[0], { isTouch: true });
  }, { passive: false });

  window.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    onDragEnd(e);
  });
}

export function onDragStart(e) {
  const figures = figuresRef();
  const figuresPos = figuresPosRef();

  const rect = floatingCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  dragIndex = null;

  const containerSize = cellSize * 4;

  for (let i = figures.length - 1; i >= 0; i--) {
    const pos = figuresPos[i];

    if (
      mouseX >= pos.x &&
      mouseX <= pos.x + containerSize &&
      mouseY >= pos.y &&
      mouseY <= pos.y + containerSize
    ) {
      dragIndex = i;
      dragOffset.x = mouseX - pos.x;
      dragOffset.y = mouseY - pos.y;
      break;
    }
  }

  if (dragIndex !== null) {
    isDragging = true;
    dragCoords = { ...figuresPos[dragIndex] };
    startDragPos = { ...dragCoords };
    startTouchPos = { x: e.clientX, y: e.clientY };
    lastTouchPos = { x: e.clientX, y: e.clientY };
  } else {
    startDragPos = null;
    startTouchPos = null;
    lastTouchPos = null;
  }

  redrawCurrent();
}

export function onDragMove(e, options = {}) {
  const { isTouch = false } = options;

  if (!isDragging || dragIndex === null) return;

  const rect = floatingCanvas.getBoundingClientRect();

  if (isTouch && startTouchPos && startDragPos) {
    const dx = e.clientX - startTouchPos.x;
    const dy = e.clientY - startTouchPos.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const sensitivity = 1 + Math.sqrt(distance) * 0.03;

    const adjDx = dx * sensitivity;
    const adjDy = dy * sensitivity;

    dragCoords = {
      x: startDragPos.x + adjDx - dragOffset.x,
      y: startDragPos.y + adjDy - dragOffset.y
    };
  } else {
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    dragCoords = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y
    };
  }

  lastTouchPos = { x: e.clientX, y: e.clientY };

  redrawCurrent();
}

export function onDragEnd(e) {
  if (!isDragging || dragIndex === null) return;
  isDragging = false;

  const figures = figuresRef();
  const figuresPos = figuresPosRef();
  const figure = figures[dragIndex];

  const floatingRect = floatingCanvas.getBoundingClientRect();
  const gameRect = gameCanvas.getBoundingClientRect();

  const scale = 0.7;
  const figWidth = figure.shape[0].length * cellSize * scale;
  const figHeight = figure.shape.length * cellSize * scale;

  const relativeX = dragCoords.x + floatingRect.left - gameRect.left;
  const relativeY = dragCoords.y + floatingRect.top - gameRect.top;

  const deadZone = 15;
  if (
    relativeX < -deadZone ||
    relativeY < -deadZone ||
    relativeX + figWidth > gameRect.width + deadZone ||
    relativeY + figHeight > gameRect.height + deadZone
  ) {
    // Вернуть фигуру на исходную позицию, если вышли за игровое поле
    dragCoords = { ...figuresPos[dragIndex] };
    redrawCurrent();
    dragIndex = null;
    lastTouchPos = null;
    startTouchPos = null;
    startDragPos = null;
    return;
  }

  let col = Math.round(relativeX / cellSize);
  let row = Math.round(relativeY / cellSize);

  col = Math.max(0, Math.min(cols - figure.shape[0].length, col));
  row = Math.max(0, Math.min(rows - figure.shape.length, row));

  const newPos = { row, col };

  if (doesFigureFit(field, figure.shape, newPos)) {
    // Фигура подходит — фиксируем её на поле
    fixFigureToField(field, figure.shape, newPos);

    // Очищаем полные линии и считаем очки
    const cleared = clearFullLines(field);
    const linesCleared = cleared.totalCleared || 0;

    const area = figure.shape.flat().filter(v => v === 1).length;

    const placementScore = area;
    const clearScore = linesCleared * 10;

    const gained = placementScore + clearScore;

    updateScore(gained);
    updateScoreBoard();

    // Удаляем фигуру из списка доступных
    const newFigures = figures.slice();
    const newFiguresPos = figuresPos.slice();

    newFigures.splice(dragIndex, 1);
    newFiguresPos.splice(dragIndex, 1);

    setFigures(newFigures);
    setFiguresPos(newFiguresPos);

    // Callback после успешного размещения фигуры
    if (typeof onFigurePlaced === "function") {
      onFigurePlaced();
    }

    // Сброс координат и индексов drag
    dragCoords = null;
    dragIndex = null;
    lastTouchPos = null;
    startTouchPos = null;
    startDragPos = null;
  } else {
    // Если фигуру поставить нельзя — вернуть на исходную позицию с корректировкой
    dragCoords = {
      x: figuresPos[dragIndex].x + cellSize * 2 - (figure.shape[0].length * cellSize) / 2,
      y: figuresPos[dragIndex].y + cellSize * 2 - (figure.shape.length * cellSize) / 2
    };
  }

  // Перерисовать текущий статус
  redrawCurrent();
}

function redrawCurrent() {
  redrawScene({
    floatingCanvas,
    gameCanvas,
    gameCtx: gameCanvas.getContext("2d"),
    field,
    figures: figuresRef(),
    figuresPos: figuresPosRef(),
    dragCoords,
    dragIndex,
    cellSize,
    drawField
  });
}
