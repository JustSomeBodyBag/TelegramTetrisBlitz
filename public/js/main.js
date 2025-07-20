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

  // Important: floatingCanvas size should cover viewport:
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
    drawField();
    drawFixedBlocks(ctx, field, cellSize);

    if (figure) {
      if (dragCoords && isDragging) {
        drawFigure(ctx, figure, null, cellSize, dragCoords);
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

  // Callbacks for drag events:

  function onDragStart(event) {
    if (!figure) return;
    isDragging = true;
    floatingCanvas.style.pointerEvents = "auto";

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
    floatingCanvas.style.pointerEvents = "none";

    fixAndSpawn();
  }

  function updateDragCoords(event) {
    dragCoords = {
      x: event.clientX,
      y: event.clientY
    };
  }

  // Setup controls on floatingCanvas (which covers entire viewport)
  setupMouseControls(floatingCanvas, onDragStart, onDragMove, onDragEnd);
  setupTouchControls(floatingCanvas, onDragStart, onDragMove, onDragEnd);

  // Spawn button
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

  // Menu button
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
