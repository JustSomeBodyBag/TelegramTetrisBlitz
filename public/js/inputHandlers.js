export function setupMouseControls(canvas, cols, rows, cellSize, getFigure, getFigurePos, onUpdate) {
  let isDragging = false;
  let dragX = 0;
  let dragY = 0;

  canvas.addEventListener("mousedown", (e) => {
    const figure = getFigure();
    if (!figure) return;
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    dragX = e.clientX - rect.left;
    dragY = e.clientY - rect.top;
    onUpdate(dragX, dragY, false);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    dragX = e.clientX - rect.left;
    dragY = e.clientY - rect.top;
    onUpdate(dragX, dragY, false);
  });

  canvas.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    snapToGrid();
  });

  function snapToGrid() {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure || !figurePos) return;

    const col = Math.round(dragX / cellSize);
    const row = Math.round(dragY / cellSize);

    if (
      col >= 0 &&
      row >= 0 &&
      col <= cols - figure[0].length &&
      row <= rows - figure.length
    ) {
      figurePos.col = col;
      figurePos.row = row;
    }

    onUpdate(dragX, dragY, true);
  }
}


export function setupTouchControls(cols, rows, getFigure, getFigurePos, onUpdate) {
  let touchId = null;
  let dragX = 0;
  let dragY = 0;
  let joystick = null;

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
    joystick.style.zIndex = "9999";
    joystick.style.pointerEvents = "none";
    document.body.appendChild(joystick);
  }

  function removeJoystick() {
    if (joystick && joystick.parentNode) {
      joystick.parentNode.removeChild(joystick);
    }
    joystick = null;
  }

  document.addEventListener("touchstart", (e) => {
    if (touchId !== null) return;

    const touch = e.changedTouches[0];
    touchId = touch.identifier;
    dragX = touch.clientX;
    dragY = touch.clientY;
    createJoystick(dragX, dragY);
    onUpdate(dragX, dragY, false);
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        dragX = t.clientX;
        dragY = t.clientY;
        onUpdate(dragX, dragY, false);
        break;
      }
    }
  }, { passive: false });

  document.addEventListener("touchend", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        touchId = null;
        snapToGrid();
        removeJoystick();
        break;
      }
    }
  }, { passive: false });

  function snapToGrid() {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure || !figurePos) return;

    const canvas = document.getElementById("gameCanvas");
    const rect = canvas.getBoundingClientRect();
    const localX = dragX - rect.left;
    const localY = dragY - rect.top;

    const col = Math.round(localX / (rect.width / cols));
    const row = Math.round(localY / (rect.height / rows));

    if (
      col >= 0 &&
      row >= 0 &&
      col <= cols - figure[0].length &&
      row <= rows - figure.length
    ) {
      figurePos.col = col;
      figurePos.row = row;
    }

    onUpdate(true);
  }
}
