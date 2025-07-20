export function setupMouseControls(canvas, cols, rows, cellSize, getFigure, getFigurePos, onUpdate) {
  let isDragging = false;

  canvas.addEventListener("mousedown", () => { isDragging = true; });
  canvas.addEventListener("mouseup", (e) => {
    isDragging = false;
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= 0 && col <= cols - figure[0].length && row >= 0 && row <= rows - figure.length) {
      figurePos.col = col;
      figurePos.row = row;
    }
    onUpdate();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= 0 && col <= cols - figure[0].length && row >= 0 && row <= rows - figure.length) {
      figurePos.col = col;
      figurePos.row = row;
      onUpdate();
    }
  });
}

export function setupTouchControls(joystickZone, cols, rows, getFigure, getFigurePos, onUpdate) {
  if (!joystickZone) return;

  let startX = null;
  let startY = null;
  let lastMove = 0;

  joystickZone.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  joystickZone.addEventListener("touchmove", (e) => {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure) return;

    const now = Date.now();
    if (now - lastMove < 100) return;

    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && figurePos.col < cols - figure[0].length) {
        figurePos.col++;
        startX = touch.clientX;
      } else if (dx < -20 && figurePos.col > 0) {
        figurePos.col--;
        startX = touch.clientX;
      }
    } else {
      if (dy > 20 && figurePos.row < rows - figure.length) {
        figurePos.row++;
        startY = touch.clientY;
      } else if (dy < -20 && figurePos.row > 0) {
        figurePos.row--;
        startY = touch.clientY;
      }
    }

    lastMove = now;
    onUpdate();
  });

  joystickZone.addEventListener("touchend", () => {
    onUpdate(true);
  });
}
