import { setupCanvas } from './canvasSetup.js';
import { FIGURES } from './figures.js';
import { createField, doesFigureFit } from './field.js';
import {
  initializeDragHandlers,
  setTouchSensitivity
} from './dragHandler.js';
import { redrawScene } from './redraw.js';
import { chooseSmartFigure } from './randomGenerator.js';
import { setupUIButtons } from './uiButtons.js';
import { setupGameOverPopup } from './popup.js';
import {
  getScore,
  setScore,
  getMaxScore,
  setMaxScore,
  updateScore,
  updateScoreBoard,
  updateAllScoreDisplays,
  getGameOver,
  setGameOver,
  resetScore
} from './score.js';


document.addEventListener("DOMContentLoaded", () => {
  const floatingCanvas = document.getElementById("floatingCanvas");
  const gameCanvas = document.getElementById("gameCanvas");
  const spawnButton = document.getElementById("spawn-button");

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

  function setFigures(f) {
    figures = f;
  }
  function setFiguresPos(pos) {
    figuresPos = pos;
  }

  let maxScore = getMaxScore();

  const highScoreText = document.querySelector('.high-score-text');
  const storedMax = localStorage.getItem('tetrisMaxScore');
  if (highScoreText && storedMax) {
    highScoreText.textContent = `Рекорд: ${storedMax}`;
  }

  function canPlaceAnyFigure(figuresToCheck) {
    for (const figure of figuresToCheck) {
      for (let row = 0; row <= rows - figure.shape.length; row++) {
        for (let col = 0; col <= cols - figure.shape[0].length; col++) {
          if (doesFigureFit(field, figure.shape, { row, col })) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function spawnFigures() {
    if (getGameOver()) return;

    figures = [
      chooseSmartFigure(field),
      chooseSmartFigure(field),
      chooseSmartFigure(field)
    ];

    if (!canPlaceAnyFigure(figures)) {
      onGameOver();
      return;
    }

    const containerSize = cellSize * 4;
    const centerX = floatingCanvas.width / 2;
    const baseY = gameCanvas.getBoundingClientRect().bottom + 10;

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

  function onFigurePlaced() {
    if (getGameOver()) return;

    if (figures.length === 0) {
      spawnFigures();
    } else {
      if (!canPlaceAnyFigure(figures)) {
        onGameOver();
      }
    }

    updateScoreBoard();
  }

  initializeDragHandlers({
    floatingCanvas,
    gameCanvas,
    field,
    figuresRef: () => figures,
    setFigures,
    figuresPosRef: () => figuresPos,
    setFiguresPos,
    cellSize,
    cols,
    rows,
    redraw: redrawScene,
    drawField,
    updateScore,
    updateScoreBoard,
    onFigurePlaced
  });

  setTouchSensitivity(1);

  const gameOverPopup = setupGameOverPopup({
    onRestart: () => {
      setGameOver(false);

      for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[r].length; c++) {
          field[r][c] = 0;
        }
      }

      setFigures([]);
      setFiguresPos([]);
      setScore(0);

      spawnFigures();
      updateAllScoreDisplays();

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
  });

  function onGameOver() {
    if (getGameOver()) return;
    setGameOver(true);

    setMaxScore(getScore());
    maxScore = getMaxScore();

    gameOverPopup.show({
      maxScore,
      finalScore: getScore()
    });
  }

  setupUIButtons({
    onSpawn: spawnFigures,
    onGameOver
  });

  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", () => {
      document.getElementById("welcomeScreen").style.display = "none";
      document.getElementById("container").style.display = "block";

      spawnFigures();
      updateAllScoreDisplays();

      if (spawnButton) spawnButton.style.display = "none";
    });
  }

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
