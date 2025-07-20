import { setupCanvas } from './canvasSetup.js';
import { drawFigure } from './figure.js';
import {
  createField,
  drawFixedBlocks,
  fixFigureToField,
  clearFullLines
} from './field.js';
import {
  setupMouseControls,
  setupTouchControls
} from './inputHandlers.js';


document.addEventListener("DOMContentLoaded", () => {
  // элементы DOM
  const floatingCanvas = document.getElementById("floatingCanvas");
  const gameCanvas = document.getElementById("gameCanvas");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null;
  let isDragging = false;

  const field = createField(rows, cols);
  const gameSetup = setupCanvas(gameCanvas, cols, rows);
  const { ctx: gameCtx, cellSize, drawField } = gameSetup;

  floatingCanvas.width = cellSize * cols;
  floatingCanvas.height = cellSize * rows;
  floatingCanvas.style.width = floatingCanvas.width + "px";
  floatingCanvas.style.height = floatingCanvas.height + "px";

  function redraw() {
    const floatingCtx = floatingCanvas.getContext("2d");
    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

    drawField();
    drawFixedBlocks(gameCtx, field, cellSize);

    if (figure) {
      if (dragCoords && isDragging) {
        drawFigure(
          floatingCtx,
          figure,
          null,
          cellSize,
          { x: dragCoords.x - cellSize / 2, y: dragCoords.y - cellSize / 2 }
        );
      } else {
        drawFigure(floatingCtx, figure, figurePos, cellSize);
      }
    }
  }

  function updateDragCoords(event) {
    const rect = floatingCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    dragCoords = { x, y };
  }

  function onDragStart(e) {
    if (!figure) return;
    isDragging = true;
    updateDragCoords(e);
    redraw();
  }

  function onDragMove(e) {
    if (!isDragging || !figure) return;
    updateDragCoords(e);
    redraw();
  }

  function onDragEnd(e) {
    if (!isDragging || !figure) return;
    isDragging = false;

    // фиксируем позицию фигуры по сетке
    let col = Math.round(dragCoords.x / cellSize - figure[0].length / 2);
    let row = Math.round(dragCoords.y / cellSize - figure.length / 2);

    figurePos.col = Math.max(0, Math.min(cols - figure[0].length, col));
    figurePos.row = Math.max(0, Math.min(rows - figure.length, row));

    fixFigureToField(field, figure, figurePos);
    clearFullLines(field);

    figure = null;
    dragCoords = null;
    redraw();
  }

  setupMouseControls(floatingCanvas, onDragStart, onDragMove, onDragEnd);
  setupTouchControls(floatingCanvas, onDragStart, onDragMove, onDragEnd);

  spawnButton.addEventListener("click", () => {
    figure = [
      [1],
      [1],
      [1],
      [1],
    ];
    figurePos = { row: 0, col: 2 };
    dragCoords = null;
    redraw();
  });

  menuButton.addEventListener("click", () => {
    if (window.Telegram?.WebApp?.showPopup) {
      window.Telegram.WebApp.showPopup({
        title: "Меню",
        message: "Пауза, настройки, донат",
        buttons: [{ text: "Закрыть", type: "close" }],
      });
    }
  });

  redraw();
});
