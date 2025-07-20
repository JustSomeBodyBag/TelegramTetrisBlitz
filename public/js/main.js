import { setupCanvas } from "./canvasSetup.js";
import { drawFigure } from "./figure.js";
import {
  createField,
  drawFixedBlocks,
  fixFigureToField,
  clearFullRows
} from "./field.js";
import {
  setupMouseControls,
  setupTouchControls
} from "./inputHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const joystickZone = document.getElementById("joystick-zone");
  const menuButton = document.getElementById("menu-button");
  const spawnButton = document.getElementById("spawn-button");

  const rows = 8;
  const cols = 8;

  let figure = null;
  let figurePos = { row: 0, col: 2 };
  const field = createField(rows, cols);

  const { ctx, cellSize, drawField } = setupCanvas(canvas, cols, rows, redraw);

  function redraw() {
    drawField();
    drawFixedBlocks(ctx, field, cellSize);
    if (figure) {
      drawFigure(ctx, figure, figurePos, cellSize);
    }
  }

  function fixAndSpawn() {
    if (!figure) return;
    fixFigureToField(field, figure, figurePos);
    clearFullRows(field); // можешь заменить на clearFullLines
    figure = null;
    redraw();
  }

  setupMouseControls(
    canvas,
    cols,
    rows,
    cellSize,
    () => figure,
    () => figurePos,
    (isFinal = false) => {
      redraw();
      if (isFinal) fixAndSpawn();
    }
  );

  setupTouchControls(
    joystickZone,
    cols,
    rows,
    () => figure,
    () => figurePos,
    (isFinal = false) => {
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
