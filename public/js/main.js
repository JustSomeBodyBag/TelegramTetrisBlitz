import { setupCanvas } from './canvasSetup.js';
import { FIGURES } from './figures.js';
import {
  createField
} from './field.js';
import {
  initializeDragHandlers,
  setTouchSensitivity
} from './dragHandler.js';
import { redrawScene } from './redraw.js';

document.addEventListener("DOMContentLoaded", () => {
  const floatingCanvas = document.getElementById("floatingCanvas");
  const gameCanvas = document.getElementById("gameCanvas");
  const spawnButton = document.getElementById("spawn-button");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;

  const field = createField(rows, cols);
  const { ctx: gameCtx, cellSize, drawField } = setupCanvas(gameCanvas, cols, rows);

  floatingCanvas.width = window.innerWidth;
  floatingCanvas.height = window.innerHeight;
  floatingCanvas.style.width = floatingCanvas.width + "px";
  floatingCanvas.style.height = floatingCanvas.height + "px";

  let figures = [];
  let figuresPos = [];

  // dragCoords и dragIndex теперь внутри dragHandler, но redrawScene нуждается в них,
  // поэтому добавим локальные переменные для синхронизации:
  let dragCoords = null;
  let dragIndex = null;

  initializeDragHandlers({
    floatingCanvas,
    gameCanvas,
    field,
    figuresRef: () => figures,
    setFigures: (f) => { figures = f; },
    figuresPosRef: () => figuresPos,
    setFiguresPos: (pos) => { figuresPos = pos; },
    cellSize,
    cols,
    rows,
    redraw: redrawScene,
    drawField
  });
  setTouchSensitivity(1);

  // Чтобы dragCoords и dragIndex были актуальны при redraw,
  // можно подписаться на события и обновлять эти переменные.
  // Но проще — обновлять их внутри обработчиков перетаскивания.
  // Для этого нужно экспортировать из dragHandler специальные getter'ы или 
  // передавать callback — для простоты будем считать redrawCurrent их берёт из dragHandler.

  function getRandomFigure() {
    const index = Math.floor(Math.random() * FIGURES.length);
    return FIGURES[index];
  }

  function spawnFigures() {
    // Спавним 3 фигуры
    figures = [getRandomFigure(), getRandomFigure(), getRandomFigure()];

    const containerSize = cellSize * 4; // Размер контейнера для каждой фигуры
    const gameRect = gameCanvas.getBoundingClientRect();
    const floatingRect = floatingCanvas.getBoundingClientRect();

    const baseY = gameRect.bottom + 10 - floatingRect.top; // Немного ниже игрового поля
    const centerX = gameRect.left + gameRect.width / 2 - floatingRect.left;

    // Располагаем фигуры с промежутком в контейнерах
    figuresPos = [
      { x: centerX - containerSize * 1.5, y: baseY },
      { x: centerX - containerSize / 2, y: baseY },
      { x: centerX + containerSize / 2, y: baseY }
    ];

    redrawScene({
      floatingCanvas,
      gameCanvas,
      gameCtx,
      field,
      figures,
      figuresPos,
      dragCoords: null,
      dragIndex: null,
      cellSize,
      drawField
    });
  }

  spawnButton.addEventListener("click", () => {
    spawnFigures();
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

  redrawScene({
    floatingCanvas,
    gameCanvas,
    gameCtx,
    field,
    figures,
    figuresPos,
    dragCoords: null,
    dragIndex: null,
    cellSize,
    drawField
  });
});
