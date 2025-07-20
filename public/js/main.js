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
  let figurePos = { row: 0, col: 0 };
  let dragCoords = null;

  const field = createField(rows, cols);
  const { ctx: gameCtx, cellSize, drawField, resizeCanvas } = setupCanvas(gameCanvas, cols, rows);
  const floatingCtx = floatingCanvas.getContext("2d");

  function redraw() {
    // Основное поле
    drawField();
    drawFixedBlocks(gameCtx, field, cellSize);

    // Очистка "верхнего" холста
    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

    // Рисуем фигуру либо на поле, либо на floatingCanvas
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
      const x = dragCoords.x - rect.left;
      const y = dragCoords.y - rect.top;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      figurePos = { row, col };
      dragCoords = null;
    }

    fixFigureToField(field, figure, figurePos);
    clearFullLines(field);
    figure = null;
    redraw();
  }

  // Установка событий управления
  setupMouseControls((isFinal, x, y) => {
    if (!figure) return;
    dragCoords = { x, y };
    redraw();
    if (isFinal) fixAndSpawn();
  });

  setupTouchControls((isFinal, x, y) => {
    if (!figure) return;
    dragCoords = { x, y };
    redraw();
    if (isFinal) fixAndSpawn();
  });

  // Создание фигуры
  spawnButton.addEventListener("click", () => {
    figure = [
      [1],
      [1],
      [1],
      [1],
    ];
    figurePos = { row: 0, col: 0 };
    dragCoords = null;
    redraw();
  });

  // Меню
  menuButton.addEventListener("click", () => {
    if (window.Telegram?.WebApp?.showPopup) {
      window.Telegram.WebApp.showPopup({
        title: "Меню",
        message: "Пауза, настройки, донат",
        buttons: [{ text: "Закрыть", type: "close" }]
      });
    }
  });

  // Адаптивность
  window.addEventListener("resize", () => {
    resizeCanvas();
    redraw();
  });

  resizeCanvas();
  redraw();
});
