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
  const floatingCanvas = document.getElementById("floatingCanvas");
  const gameCanvas = document.getElementById("gameCanvas");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null; // { x, y } in pixels
  let isDragging = false;

  const field = createField(rows, cols);
  const { ctx, cellSize, drawField, resizeCanvas } = setupCanvas(gameCanvas, cols, rows);
  const floatingCtx = floatingCanvas.getContext("2d");


  function resizeFloatingCanvas() {
    floatingCanvas.width = window.innerWidth;
    floatingCanvas.height = window.innerHeight;
  }
  resizeFloatingCanvas();
  window.addEventListener("resize", () => {
    resizeFloatingCanvas();
    resizeCanvas();
    redraw();
  });

  function redraw() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawField();
    drawFixedBlocks(ctx, field, cellSize);

    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

    if (figure) {
      if (dragCoords && isDragging) {
        drawFigure(floatingCtx, figure, null, cellSize, dragCoords);
      } else {
        drawFigure(ctx, figure, figurePos, cellSize);
      }
    }
  }

  function fixAndSpawn() {
    if (!figure) return;

    if (dragCoords) {
      const rect = gameCanvas.getBoundingClientRect();
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

  // Drag handlers:
  function onDragStart(event) {
    if (!figure) return;
    isDragging = true;
    updateDragCoords(event);
    redraw();
  }

  function onDragMove(event) {
    if (!isDragging || !figure) return;
    updateDragCoords(event);
    redraw();
  }

  function onDragEnd(event) {
    if (!isDragging || !figure) return;
    isDragging = false;
    fixAndSpawn();
  }

  function updateDragCoords(event) {
    dragCoords = {
      x: event.clientX,
      y: event.clientY
    };
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
    figurePos.row = 0;
    figurePos.col = 2;
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
