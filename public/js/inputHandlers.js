export function setupMouseControls(canvas, cols, rows, cellSize, getFigure, getFigurePos, onUpdate) {
  let isDragging = false;

  canvas.addEventListener("mousedown", (e) => {
    const figure = getFigure();
    if (!figure) return;
    isDragging = true;
    moveFigureWithMouse(e);
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
    onUpdate(true); // фиксируем
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    moveFigureWithMouse(e);
  });

  function moveFigureWithMouse(e) {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure || !figurePos) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (
      col >= 0 &&
      row >= 0 &&
      col <= cols - figure[0].length &&
      row <= rows - figure.length
    ) {
      figurePos.col = col;
      figurePos.row = row;
      onUpdate(false); // обновление без фиксации
    }
  }
}

export function setupTouchControls(joystickZone, cols, rows, getFigure, getFigurePos, onUpdate) {
  if (!joystickZone) return;

  let direction = null;
  let holdInterval = null;

  function startMoving(dir) {
    direction = dir;
    moveFigure();
    holdInterval = setInterval(moveFigure, 130); // ускорение
  }

  function moveFigure() {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure || !figurePos) return;

    switch (direction) {
      case "left":
        if (figurePos.col > 0) figurePos.col--;
        break;
      case "right":
        if (figurePos.col < cols - figure[0].length) figurePos.col++;
        break;
      case "up":
        if (figurePos.row > 0) figurePos.row--;
        break;
      case "down":
        if (figurePos.row < rows - figure.length) figurePos.row++;
        break;
    }

    onUpdate(false);
  }

  function stopMoving() {
    clearInterval(holdInterval);
    direction = null;
    onUpdate(true); // финал
  }

  joystickZone.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    joystickZone.startX = touch.clientX;
    joystickZone.startY = touch.clientY;
  });

  joystickZone.addEventListener("touchmove", (e) => {
    if (direction) return;

    const touch = e.touches[0];
    const dx = touch.clientX - joystickZone.startX;
    const dy = touch.clientY - joystickZone.startY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < 20) return;

    if (absX > absY) {
      startMoving(dx > 0 ? "right" : "left");
    } else {
      startMoving(dy > 0 ? "down" : "up");
    }
  });

  joystickZone.addEventListener("touchend", stopMoving);
}
