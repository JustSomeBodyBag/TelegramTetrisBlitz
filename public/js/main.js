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
  const menuButton = document.getElementById("menu-button");
  const spawnButton = document.getElementById("spawn-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null; // pixel coords for dragging figure

  // Настраиваем канвасы
  const gameSetup = setupCanvas(gameCanvas, cols, rows);
  const floatingCtx = floatingCanvas.getContext("2d");

  // Устанавливаем floatingCanvas на весь экран
  function resizeFloatingCanvas() {
    floatingCanvas.width = window.innerWidth;
    floatingCanvas.height = window.innerHeight;
  }
  resizeFloatingCanvas();
  window.addEventListener("resize", () => {
    resizeFloatingCanvas();
    redraw();
  });

  // Отрисовка игрового поля и фигур на основном канвасе
  function redraw() {
    gameSetup.drawField();
    drawFixedBlocks(gameSetup.ctx, field, gameSetup.cellSize);

    // Очистим floatingCanvas
    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

    if (figure) {
      if (dragCoords) {
        // Рисуем фигуру в пиксельных координатах на floatingCanvas
        drawFigure(floatingCtx, figure, null, gameSetup.cellSize, dragCoords);
      } else {
        // Рисуем фигуру в фиксированной позиции на gameCanvas
        drawFigure(gameSetup.ctx, figure, figurePos, gameSetup.cellSize);
      }
    }
  }

  // Создаём игровое поле
  const field = createField(rows, cols);

  // Фиксируем фигуру на поле и очищаем полные линии
  function fixAndSpawn() {
    if (!figure) return;

    if (dragCoords) {
      // Привязка pixel coords к row/col
      const rect = gameCanvas.getBoundingClientRect();
      const localX = dragCoords.x - rect.left;
      const localY = dragCoords.y - rect.top;

      figurePos.col = Math.max(0, Math.min(cols - figure[0].length, Math.round(localX / gameSetup.cellSize)));
      figurePos.row = Math.max(0, Math.min(rows - figure.length, Math.round(localY / gameSetup.cellSize)));

      dragCoords = null;
    }

    fixFigureToField(field, figure, figurePos);
    clearFullLines(field);
    figure = null;
    redraw();
  }

  // Обновление позиции фигуры при движении или клике
  function onUpdate(isFinal, x, y) {
    if (!figure) return;

    if (isFinal) {
      dragCoords = { x, y };
      fixAndSpawn();
    } else {
      dragCoords = { x, y };
      redraw();
    }
  }

  // Настраиваем управление мышью и тачами на floatingCanvas
  setupMouseControls(floatingCanvas, onUpdate);
  setupTouchControls(onUpdate);

  // Спавн фигуры при клике по кнопке
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

  // Меню Telegram
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
