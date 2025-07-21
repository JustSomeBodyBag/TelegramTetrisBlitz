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
    drawField
  } = params);

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

  for (let i = figures.length - 1; i >= 0; i--) {
    const fig = figures[i];
    const pos = figuresPos[i];
    const scale = 0.7; // начальный масштаб фигур

    const figWidth = fig.shape[0].length * cellSize * scale;
    const figHeight = fig.shape.length * cellSize * scale;

    const containerSize = cellSize * 4;
    const offsetX = (containerSize - figWidth) / 2;
    const offsetY = (containerSize - figHeight) / 2;

    if (
      mouseX >= pos.x + offsetX &&
      mouseX <= pos.x + offsetX + figWidth &&
      mouseY >= pos.y + offsetY &&
      mouseY <= pos.y + offsetY + figHeight
    ) {
      dragIndex = i;
      dragOffset.x = mouseX - (pos.x + offsetX);
      dragOffset.y = mouseY - (pos.y + offsetY);
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
    // Смещение пальца от стартовой точки
    const dx = e.clientX - startTouchPos.x;
    const dy = e.clientY - startTouchPos.y;

    // Расстояние от стартовой точки
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Плавная чувствительность, с мягким коэффициентом
    const sensitivity = 1 + Math.sqrt(distance) * 0.03;

    // Смещение фигуры с учётом чувствительности
    const adjDx = dx * sensitivity;
    const adjDy = dy * sensitivity;

    dragCoords = {
      x: startDragPos.x + adjDx - dragOffset.x,
      y: startDragPos.y + adjDy - dragOffset.y
    };
  } else {
    // Для мыши просто обычное смещение
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

  const scale = 1.0;
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
    fixFigureToField(field, figure.shape, newPos);
    clearFullLines(field);

    const newFigures = figures.slice();
    const newFiguresPos = figuresPos.slice();

    newFigures.splice(dragIndex, 1);
    newFiguresPos.splice(dragIndex, 1);

    setFigures(newFigures);
    setFiguresPos(newFiguresPos);

    dragCoords = null;
    dragIndex = null;
    lastTouchPos = null;
    startTouchPos = null;
    startDragPos = null;
  } else {
    dragCoords = { ...figuresPos[dragIndex] };
  }

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
