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

  const field = createField(rows, cols);

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  let dragCoords = null;

  const { ctx: gameCtx, cellSize, drawField } = setupCanvas(gameCanvas, cols, rows, redrawGame);
  const { ctx: floatCtx } = setupCanvas(floatingCanvas, cols, rows, redrawFloating);

  function redrawGame() {
    drawField();
    drawFixedBlocks(gameCtx, field, cellSize);

    if (figure && !dragCoords) {
      drawFigure(gameCtx, figure, figurePos, cellSize);
    }
  }

  function redrawFloating() {
    floatCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);
    if (figure && dragCoords) {
      drawFigure(floatCtx, figure, null, cellSize, dragCoords);
    }
  }

  function fixAndSpawn(clientX, clientY) {
    if (!figure || !dragCoords) return;

    const rect = gameCanvas.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    const col = Math.floor(localX / cellSize);
    const row = Math.floor(localY / cellSize);

    figurePos = {
      row: Math.max(0, Math.min(rows - figure.length, row)),
      col: Math.max(0, Math.min(cols - figure[0].length, col)),
    };

    fixFigureToField(field, figure, figurePos);
    clearFullLines(field);

    figure = null;
    dragCoords = null;
    redrawGame();
    redrawFloating();
  }

  function handleMove(isFinal, clientX, clientY) {
    if (!figure) return;
    dragCoords = { x: clientX, y: clientY };
    redrawFloating();

    if (isFinal) {
      fixAndSpawn(clientX, clientY);
    }
  }

  setupMouseControls(handleMove);
  setupTouchControls(handleMove);

  spawnButton.addEventListener("click", () => {
    figure = [
      [1],
      [1],
      [1],
      [1],
    ];
    figurePos = { row: 0, col: 2 };
    dragCoords = {
      x: menuButton.getBoundingClientRect().left + 20,
      y: menuButton.getBoundingClientRect().top + 20,
    };
    redrawFloating();
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

  redrawGame();
});
