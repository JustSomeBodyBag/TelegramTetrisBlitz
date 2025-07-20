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

export function setupTouchControls(cols, rows, getFigure, getFigurePos, onUpdate) {
  let joystick = null;
  let touchId = null;
  let centerX = 0;
  let centerY = 0;
  let loopId = null;

  function createJoystick(x, y) {
    joystick = document.createElement("div");
    joystick.style.position = "fixed";
    joystick.style.left = `${x - 30}px`;
    joystick.style.top = `${y - 30}px`;
    joystick.style.width = "60px";
    joystick.style.height = "60px";
    joystick.style.borderRadius = "50%";
    joystick.style.border = "1px solid #666";
    joystick.style.background = "rgba(255,255,255,0.05)";
    joystick.style.zIndex = "1000";
    document.body.appendChild(joystick);
  }

  function removeJoystick() {
    if (joystick && joystick.parentNode) {
      joystick.parentNode.removeChild(joystick);
    }
    joystick = null;
  }

  function startLoop() {
    if (loopId) return;
    loopId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (loopId) cancelAnimationFrame(loopId);
    loopId = null;
  }

  function loop() {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure || !figurePos || !touchId) return;

    const dx = currentX - centerX;
    const dy = currentY - centerY;

    const threshold = 10;
    let moved = false;

    const speed = Math.min(1 + Math.max(Math.abs(dx), Math.abs(dy)) / 30, 10);
    const now = Date.now();
    if (!loop.lastMove || now - loop.lastMove > (1000 / speed)) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold && figurePos.col < cols - figure[0].length) {
          figurePos.col++;
          moved = true;
        } else if (dx < -threshold && figurePos.col > 0) {
          figurePos.col--;
          moved = true;
        }
      } else {
        if (dy > threshold && figurePos.row < rows - figure.length) {
          figurePos.row++;
          moved = true;
        } else if (dy < -threshold && figurePos.row > 0) {
          figurePos.row--;
          moved = true;
        }
      }
      if (moved) {
        loop.lastMove = now;
        onUpdate(false);
      }
    }

    loopId = requestAnimationFrame(loop);
  }

  let currentX = 0;
  let currentY = 0;

  document.addEventListener("touchstart", (e) => {
    if (touchId !== null) return; // only one joystick
    const touch = e.changedTouches[0];
    touchId = touch.identifier;
    centerX = touch.clientX;
    centerY = touch.clientY;
    currentX = centerX;
    currentY = centerY;
    createJoystick(centerX, centerY);
    startLoop();
  });

  document.addEventListener("touchmove", (e) => {
    for (let t of e.changedTouches) {
      if (t.identifier === touchId) {
        currentX = t.clientX;
        currentY = t.clientY;
        break;
      }
    }
  });

  document.addEventListener("touchend", (e) => {
    for (let t of e.changedTouches) {
      if (t.identifier === touchId) {
        touchId = null;
        stopLoop();
        removeJoystick();
        onUpdate(true); // финальная фиксация
        break;
      }
    }
  });
}
