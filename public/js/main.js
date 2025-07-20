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
  const floatingCanvas = document.getElementById("floatingCanvas");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  const field = createField(rows, cols);
  const { ctx, cellSize, drawField } = setupCanvas(canvas, cols, rows, redraw);
  const floatingCtx = floatingCanvas.getContext("2d");

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null;

  function redrawFloating() {
    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);
    if (figure && dragCoords) {
      drawFigure(floatingCtx, figure, null, cellSize, dragCoords);
    }
  }

  function redraw() {
    drawField();
    drawFixedBlocks(ctx, field, cellSize);
    if (figure && !dragCoords) {
      drawFigure(ctx, figure, figurePos, cellSize);
    }
    redrawFloating();
  }

  function fixAndSpawn() {
    if (!figure) return;

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
    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);
    redraw();
  }

  function updateDrag(isFinal, x, y) {
    if (!figure) return;
    dragCoords = { x, y };
    if (isFinal) {
      fixAndSpawn();
    } else {
      redraw();
    }
  }

  setupMouseControls(updateDrag);
  setupTouchControls(updateDrag);

  if (spawnButton) {
    spawnButton.addEventListener("click", () => {
      figure = [
        [1],
        [1],
        [1],
        [1],
      ];
      figurePos = { row: 0, col: 2 };

      const menuRect = menuButton.getBoundingClientRect();
      dragCoords = {
        x: menuRect.left + menuRect.width / 2,
        y: menuRect.top + menuRect.height / 2
      };

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
