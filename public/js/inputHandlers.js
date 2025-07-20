export function setupMouseControls(canvas, cols, rows, cellSize, getFigure, getFigurePos, onUpdate) {
  let isDragging = false;

  canvas.addEventListener("mousedown", (e) => {
    if (!getFigure()) return;
    isDragging = true;
    onUpdate(false, e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    if (!getFigure()) return;
    onUpdate(false, e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    if (!getFigure()) return;
    onUpdate(true, e.clientX, e.clientY);
  });

  canvas.addEventListener("click", (e) => {
    if (isDragging) return;
    if (!getFigure()) return;
    onUpdate(true, e.clientX, e.clientY);
  });
}

export function setupTouchControls(canvas, cols, rows, getFigure, getFigurePos, onUpdate) {
  let touchId = null;

  canvas.addEventListener("touchstart", (e) => {
    if (touchId !== null) return;
    if (!getFigure()) return;

    const touch = e.changedTouches[0];
    touchId = touch.identifier;
    onUpdate(false, touch.clientX, touch.clientY);
  });

  canvas.addEventListener("touchmove", (e) => {
    if (touchId === null) return;
    if (!getFigure()) return;

    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        onUpdate(false, t.clientX, t.clientY);
        break;
      }
    }
  });

  canvas.addEventListener("touchend", (e) => {
    if (touchId === null) return;
    if (!getFigure()) return;

    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        onUpdate(true, t.clientX, t.clientY);
        touchId = null;
        break;
      }
    }
  });

  // Второй тап для фиксации
  canvas.addEventListener("touchstart", (e) => {
    if (touchId !== null) return;
    if (!getFigure()) return;

    if (e.touches.length === 1 && e.changedTouches.length === 1) {
      const t = e.changedTouches[0];
      onUpdate(true, t.clientX, t.clientY);
    }
  });
}
