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
  const canvas = document.getElementById("gameCanvas");
  const menuButton = document.getElementById("menu-button");
  const spawnButton = document.getElementById("spawn-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null; // { x, y } — реальные пиксели

  const field = createField(rows, cols);
  const { ctx, cellSize, drawField } = setupCanvas(canvas, cols, rows, redraw);

  function redraw() {
    drawField();
    drawFixedBlocks(ctx, field, cellSize);

    if (figure) {
      if (dragCoords) {
        drawFigure(ctx, figure, null, cellSize, dragCoords);
      } else {
        drawFigure(ctx, figure, figurePos, cellSize);
      }
    }
  }

  function fixAndSpawn() {
    if (!figure) return;

    // Привязка dragCoords → row/col
    if (dragCoords) {
      const rect = canvas.getBoundingClientRect();
      const localX = dragCoords.x - rect.left;
      const localY = dragCoords.y - rect.top;

      const col = Math.round(localX / cellSize);
      const row = Math.round(localY / cellSize);

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
    canvas,
    cols,
    rows,
    cellSize,
    () => figure,
    (x, y, isFinal) => {
      dragCoords = { x, y };
      redraw();
      if (isFinal) fixAndSpawn();
    }
  );

  setupTouchControls(
    cols,
    rows,
    () => figure,
    (x, y, isFinal) => {
      dragCoords = { x, y };
      redraw();
      if (isFinal) fixAndSpawn();
    }
  );

  if (spawnButton) {
    spawnButton.addEventListener("click", () => {
      figure = [
        [1],
        [1],
        [1],
        [1],
      ];
      figurePos.row = 0;
      figurePos.col = 2;
      dragCoords = null;
      redraw();
    });
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "Меню",
          message: "Пауза, настройки, донат",
          buttons: [{ text: "Закрыть", type: "close" }],
        });
      }
    });
  }

  redraw();
});
