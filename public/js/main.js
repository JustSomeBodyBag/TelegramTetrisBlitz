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
  const floatingCanvas = document.getElementById("floatingCanvas"); // новый canvas
  const menuButton = document.getElementById("menu-button");
  const spawnButton = document.getElementById("spawn-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null; // {x, y} в координатах floatingCanvas (пиксели)

  const field = createField(rows, cols);

  // Настраиваем игровой canvas
  const { ctx: gameCtx, cellSize, drawField } = setupCanvas(gameCanvas, cols, rows);

  // Настраиваем floating canvas (для перетаскиваемой фигуры)
  const floatingCtx = floatingCanvas.getContext("2d");
  floatingCanvas.width = 320;
  floatingCanvas.height = 320;
  // floatingCanvas стили уже в CSS: pointer-events:none; position:fixed; z-index:1000;

  function clearFloating() {
    floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);
  }

  function redraw() {
    // Игровое поле
    drawField();
    drawFixedBlocks(gameCtx, field, cellSize);

    // Фигура
    clearFloating();

    if (figure) {
      if (dragCoords) {
        // Рисуем фигуру на floatingCanvas в координатах dragCoords (пиксели)
        drawFigure(floatingCtx, figure, null, cellSize, dragCoords);
      } else {
        // Рисуем фигуру возле меню (спавн)
        const menuRect = menuButton.getBoundingClientRect();
        const floatingRect = floatingCanvas.getBoundingClientRect();

        // Координаты фигуры в пикселях относительно floatingCanvas
        const spawnX = menuRect.left + menuRect.width / 2 - floatingRect.left - (figure[0].length * cellSize) / 2;
        const spawnY = menuRect.top + menuRect.height / 2 - floatingRect.top - (figure.length * cellSize) / 2;

        drawFigure(floatingCtx, figure, null, cellSize, { x: spawnX, y: spawnY });
      }
    }
  }

  function fixAndSpawn() {
    if (!figure) return;

    if (dragCoords) {
      // Переводим координаты с floatingCanvas (пиксели) в игровое поле (ячейки)
      const floatingRect = floatingCanvas.getBoundingClientRect();
      const gameRect = gameCanvas.getBoundingClientRect();

      // Чтобы координаты были относительно игрового канваса
      const relativeX = dragCoords.x + floatingRect.left - gameRect.left;
      const relativeY = dragCoords.y + floatingRect.top - gameRect.top;

      let col = Math.round(relativeX / cellSize);
      let row = Math.round(relativeY / cellSize);

      col = Math.max(0, Math.min(cols - figure[0].length, col));
      row = Math.max(0, Math.min(rows - figure.length, row));

      figurePos = { row, col };
      dragCoords = null;
    } else {
      // Если не было перетаскивания, фигуру не ставим
      return;
    }

    fixFigureToField(field, figure, figurePos);
    clearFullLines(field);
    figure = null;
    redraw();
  }

  // Подключаем контролы к floatingCanvas
  setupMouseControls(
    floatingCanvas,
    cols,
    rows,
    cellSize,
    () => figure,
    () => figurePos,
    (isFinal, x, y) => {
      // x, y — координаты клиента (clientX/Y)
      if (!figure) return;

      const rect = floatingCanvas.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;

      if (isFinal) {
        dragCoords = { x: localX, y: localY };
        fixAndSpawn();
      } else {
        dragCoords = { x: localX, y: localY };
      }
      redraw();
    }
  );

  setupTouchControls(
    floatingCanvas,
    cols,
    rows,
    cellSize,
    () => figure,
    () => figurePos,
    (isFinal, x, y) => {
      if (!figure) return;

      const rect = floatingCanvas.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;

      if (isFinal) {
        dragCoords = { x: localX, y: localY };
        fixAndSpawn();
      } else {
        dragCoords = { x: localX, y: localY };
      }
      redraw();
    }
  );

  // Спавн фигуры рядом с меню (на floatingCanvas)
  if (spawnButton) {
    spawnButton.addEventListener("click", () => {
      if (figure) return; // если уже есть, не создавать

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
