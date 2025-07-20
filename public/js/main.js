import { setupCanvas } from "./canvasSetup.js";
import { drawFigure } from "./figure.js";
import {
  createField,
  drawFixedBlocks,
  fixFigureToField,
  clearFullLines
} from "./field.js";
import {
  setupMouseControls,
  setupTouchControls
} from "./inputHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameCanvas = document.getElementById("gameCanvas");
  const floatingCanvas = document.getElementById("floatingCanvas");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null;

  const field = createField(rows, cols);
  const {
    ctx: gameCtx,
    cellSize,
    drawField,
    resizeCanvas,
  } = setupCanvas(gameCanvas, cols, rows);
  const floatingCtx = floatingCanvas.getContext("2d");

  function redraw() {
    drawField();
    drawFixedBlocks(gameCtx, field, cellSize);

    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

    if (figure) {
      if (dragCoords) {
        drawFigure(floatingCtx, figure, null, cellSize, dragCoords);
      } else {
        drawFigure(gameCtx, figure, figurePos, cellSize);
      }
    }
  }

  function fixAndSpawn() {
    if (!figure) return;

    if (dragCoords) {
      const rect = gameCanvas.getBoundingClientRect();
      const localX = dragCoords.x - rect.left;
      const localY = dragCoords.y - rect.top;

      const col = Math.floor(localX / cellSize);
      const row = Math.floor(localY / cellSize);

      figurePos.col = Math.max(0, Math.min(cols - figure[0].length, col));
      figurePos.row = Math.max(0, Math.min(rows - figure.length, row));

      dragCoords = null;
    }

    fixFigureToField(field, figure, figurePos);
    clearFullLines(field);
    figure = null;
    redraw();
  }

  setupMouseControls(
    gameCanvas,
    cols,
    rows,
    cellSize,
    () => figure,
    () => figurePos,
    (isFinal = false, x, y) => {
      if (x && y) dragCoords = { x, y };
      else dragCoords = null;
      redraw();
      if (isFinal) fixAndSpawn();
    }
  );

  setupTouchControls(
    cols,
    rows,
    () => figure,
    () => figurePos,
    (isFinal = false, x, y) => {
      if (x && y) dragCoords = { x, y };
      else dragCoords = null;
      redraw();
      if (isFinal) fixAndSpawn();
    }
  );

  spawnButton?.addEventListener("click", () => {
    figure = [[1], [1], [1], [1]];
    figurePos = { row: 0, col: 2 };
    dragCoords = null;
    redraw();
  });

  menuButton?.addEventListener("click", () => {
    if (window.Telegram?.WebApp?.showPopup) {
      window.Telegram.WebApp.showPopup({
        title: "Меню",
        message: "Пауза, настройки, донат",
        buttons: [{ text: "Закрыть", type: "close" }],
      });
    }
  });

  resizeCanvas();
  redraw();
});
