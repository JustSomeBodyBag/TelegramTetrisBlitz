// gameLogic.js
import { chooseSmartFigure } from './randomGenerator.js';
import { redrawScene } from './redraw.js';
import { canPlaceAnyFigure } from './figuresManager.js';
import { updateScoreBoard, updateAllScoreDisplays, resetScore } from './score.js';

export function spawnFigures({
  gameOver,
  setFigures,
  setFiguresPos,
  figuresRef,
  floatingCanvas,
  gameCanvas,
  cellSize,
  field,
  cols,
  rows,
  drawField
}) {
  if (gameOver) return;

  const figures = [
    chooseSmartFigure(field),
    chooseSmartFigure(field),
    chooseSmartFigure(field)
  ];

  if (!canPlaceAnyFigure(figures, field, rows, cols)) {
    return null; // Спец. сигнал для game over
  }

  const containerSize = cellSize * 4;
  const centerX = floatingCanvas.width / 2;
  const baseY = gameCanvas.getBoundingClientRect().bottom + 10;

  const figuresPos = [
    { x: centerX - containerSize * 1.5, y: baseY },
    { x: centerX - containerSize / 2, y: baseY },
    { x: centerX + containerSize / 2, y: baseY }
  ];

  setFigures(figures);
  setFiguresPos(figuresPos);

  redrawScene({
    floatingCanvas,
    gameCanvas,
    gameCtx: gameCanvas.getContext('2d'),
    field,
    figures,
    figuresPos,
    dragCoords: null,
    dragIndex: null,
    cellSize,
    drawField
  });

  return true;
}

export function onGameOver(gameOverFlag, setGameOver, score) {
  if (gameOverFlag) return;
  setGameOver(true);
  console.log("Game Over triggered");
  // maxScore сохраняется в score.js — вызывай setMaxScore там
  // Тут можно вызвать popup (передать обработчик из main)
}
