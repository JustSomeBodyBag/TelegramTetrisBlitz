import { setupCanvas } from "./canvasSetup.js";
import { drawFigure } from "./figure.js";
import { createField, drawFixedBlocks, fixFigureToField, clearFullRows } from "./field.js";
import { setupMouseControls, setupTouchControls } from "./inputHandlers.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const joystickZone = document.getElementById("joystick-zone");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  let figure = [
    [1],
    [1],
    [1],
    [1],
  ];

  let figurePos = { row: 0, col: 2 };
  const field = createField(rows, cols);

  let ctx, cellSize, drawField, resizeCanvas;

  // Определяем redraw только после получения drawField
  function redraw() {
    drawField();
    drawFixedBlocks(ctx, field, cellSize);
    drawFigure(ctx, figure, figurePos, cellSize);
  }

  // Сначала вызываем setupCanvas без передачи redraw
  ({ ctx, cellSize, drawField, resizeCanvas } = setupCanvas(canvas, cols, rows));
  
  // Теперь можно привязать resizeCanvas к вызову redraw
  window.addEventListener("resize", () => {
    resizeCanvas();
    redraw();
  });

  function fixAndSpawn() {
    fixFigureToField(field, figure, figurePos);
    clearFullRows(field);
    figurePos = { row: 0, col: 2 };
    redraw();
  }

  setupMouseControls(canvas, cols, rows, cellSize, figure, figurePos, fixAndSpawn);
  setupTouchControls(joystickZone, cols, rows, figure, figurePos, (isFinal = false) => {
    redraw();
    if (isFinal) fixAndSpawn();
  });

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
  console.log("✅ UI и управление загружены");
});
