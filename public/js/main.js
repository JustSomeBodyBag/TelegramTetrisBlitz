import { setupCanvas } from './canvasSetup.js';
import { drawFigure } from './figure.js';
import { FIGURES } from './figures.js';
import {
  createField,
  drawFixedBlocks,
  fixFigureToField,
  clearFullLines
} from './field.js';
import {
  onDragStart,
  onDragMove,
  onDragEnd,
  initializeDragHandlers,
  redrawScene
} from './dragHandler.js';

document.addEventListener("DOMContentLoaded", () => {
  const floatingCanvas = document.getElementById("floatingCanvas");
  const gameCanvas = document.getElementById("gameCanvas");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  const field = createField(rows, cols);
  const { ctx: gameCtx, cellSize, drawField } = setupCanvas(gameCanvas, cols, rows);

  floatingCanvas.width = window.innerWidth;
  floatingCanvas.height = window.innerHeight;
  floatingCanvas.style.width = floatingCanvas.width + "px";
  floatingCanvas.style.height = floatingCanvas.height + "px";

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null;

  initializeDragHandlers({
    floatingCanvas,
    gameCanvas,
    field,
    figureRef: () => figure,
    setFigure: (f) => (figure = f),
    figurePosRef: () => figurePos,
    setFigurePos: (pos) => (figurePos = pos),
    cellSize,
    cols,
    rows,
    redraw: redrawScene
  });

  function getRandomFigure() {
    const index = Math.floor(Math.random() * FIGURES.length);
    return FIGURES[index];
  }

  function redraw() {
    redrawScene({
      floatingCanvas,
      gameCanvas,
      gameCtx,
      field,
      figure,
      figurePos,
      dragCoords,
      cellSize,
      drawField
    });
  }

  spawnButton.addEventListener("click", () => {
    figure = getRandomFigure();
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
