import {
  fixFigureToField,
  clearFullLines,
  drawFixedBlocks,
  doesFigureFit
} from './field.js';

import { drawFigure } from './figure.js';

let floatingCanvas, gameCanvas, field, cellSize, cols, rows;
let figureRef, setFigure, figurePosRef, setFigurePos, redraw;

let dragStartPos = null;
let dragStartMouse = null;
let dragCoords = null;
let isDragging = false;

export function initializeDragHandlers(params) {
  ({
    floatingCanvas,
    gameCanvas,
    field,
    figureRef,
    setFigure,
    figurePosRef,
    setFigurePos,
    cellSize,
    cols,
    rows,
    redraw
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
    onDragMove(e.touches[0]);
  }, { passive: false });

  window.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    onDragEnd(e);
  });
}

export function onDragStart(e) {
  const figure = figureRef();
  if (!figure) return;

  isDragging = true;

  const rect = floatingCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  dragStartMouse = { x: mouseX, y: mouseY };

  const figurePos = figurePosRef();
  dragStartPos = {
    x: figurePos.col * cellSize,
    y: figurePos.row * cellSize
  };

  dragCoords = { ...dragStartPos };
  redrawSceneInternal();
}

export function onDragMove(e) {
  if (!isDragging) return;

  const rect = floatingCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const dx = mouseX - dragStartMouse.x;
  const dy = mouseY - dragStartMouse.y;

  dragCoords = {
    x: dragStartPos.x + dx,
    y: dragStartPos.y + dy
  };

  redrawSceneInternal();
}

export function onDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  const figure = figureRef();
  if (!figure) return;

  const floatingRect = floatingCanvas.getBoundingClientRect();
  const gameRect = gameCanvas.getBoundingClientRect();

  const deadZone = 15;
  const figureWidth = figure.shape[0].length * cellSize;
  const figureHeight = figure.shape.length * cellSize;

  const relativeX = dragCoords.x + floatingRect.left - gameRect.left;
  const relativeY = dragCoords.y + floatingRect.top - gameRect.top;

  if (
    relativeX < -deadZone ||
    relativeY < -deadZone ||
    relativeX + figureWidth > gameRect.width + deadZone ||
    relativeY + figureHeight > gameRect.height + deadZone
  ) {
    dragCoords = { ...dragStartPos };
    redrawSceneInternal();
    return;
  }

  let col = Math.round(relativeX / cellSize);
  let row = Math.round(relativeY / cellSize);

  col = Math.max(0, Math.min(cols - figure.shape[0].length, col));
  row = Math.max(0, Math.min(rows - figure.shape.length, row));

  const newPos = { row, col };

  if (doesFigureFit(field, figure.shape, newPos)) {
    setFigurePos(newPos);
    fixFigureToField(field, figure.shape, newPos);
    clearFullLines(field);
    setFigure(null);
    dragCoords = null;
  } else {
  // Вернуть на старт
    dragCoords = { ...dragStartPos };
  }

  redrawSceneInternal();
}

function redrawSceneInternal() {
  const gameCtx = gameCanvas.getContext("2d");
  const floatingCtx = floatingCanvas.getContext("2d");

  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  redraw({
    floatingCanvas,
    gameCanvas,
    gameCtx,
    field,
    figure: figureRef(),
    figurePos: figurePosRef(),
    dragCoords,
    cellSize,
    drawField: () => {
      gameCtx.fillStyle = "#18222d";
      gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

      gameCtx.strokeStyle = "#444";
      gameCtx.lineWidth = 1;

      for (let x = 0; x <= cols; x++) {
        gameCtx.beginPath();
        gameCtx.moveTo(x * cellSize, 0);
        gameCtx.lineTo(x * cellSize, rows * cellSize);
        gameCtx.stroke();
      }

      for (let y = 0; y <= rows; y++) {
        gameCtx.beginPath();
        gameCtx.moveTo(0, y * cellSize);
        gameCtx.lineTo(cols * cellSize, y * cellSize);
        gameCtx.stroke();
      }
    }
  });

  floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

  const figure = figureRef();

  if (figure) {
    if (dragCoords) {
      drawFigure(floatingCtx, figure, null, cellSize, {
        x: dragCoords.x,
        y: dragCoords.y
      });
    } else {
      drawFigure(floatingCtx, figure, figurePosRef(), cellSize);
    }
  }
}

export function redrawScene({
  floatingCanvas,
  gameCanvas,
  gameCtx,
  field,
  figure,
  figurePos,
  dragCoords,
  cellSize,
  drawField
}) {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  const floatingCtx = floatingCanvas.getContext("2d");
  floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

  drawField();

  drawFixedBlocks(gameCtx, field, cellSize);

  if (figure) {
    if (dragCoords) {
      drawFigure(floatingCtx, figure, null, cellSize, {
        x: dragCoords.x,
        y: dragCoords.y
      });
    } else {
      drawFigure(floatingCtx, figure, figurePos, cellSize);
    }
  }
}