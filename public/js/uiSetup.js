// uiSetup.js
import { setupUIButtons } from './uiButtons.js';
import { setupGameOverPopup } from './popup.js';
import { updateAllScoreDisplays } from './score.js';

export function setupUI({
  spawnFigures,
  onGameOver,
  floatingCanvas,
  gameCanvas,
  field,
  cellSize,
  cols,
  rows,
  setFigures,
  setFiguresPos,
  redrawScene,
  drawField,
  resetScore
}) {
  const gameOverPopup = setupGameOverPopup({
    onRestart: () => {
      // сброс флага и поля
      resetScore();

      for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[r].length; c++) {
          field[r][c] = 0;
        }
      }

      setFigures([]);
      setFiguresPos([]);

      spawnFigures();

      updateAllScoreDisplays();

      redrawScene({
        floatingCanvas,
        gameCanvas,
        gameCtx: gameCanvas.getContext('2d'),
        field,
        figures: [],
        figuresPos: [],
        dragCoords: null,
        dragIndex: null,
        cellSize,
        drawField
      });
    }
  });

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

      const spawnButton = document.getElementById("spawn-button");
      if (spawnButton) spawnButton.style.display = "none";
    });
  }

  return gameOverPopup;
}
