export function setupMouseControls(canvas, cols, rows, cellSize, getFigure, getFigurePos, onEnd) {
  let isDragging = false;

  canvas.addEventListener("mousedown", (e) => {
    if (!getFigure()) return;
    isDragging = true;
    onEnd(false, e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    onEnd(false, e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    onEnd(true, e.clientX, e.clientY);
  });
}

export function setupTouchControls(cols, rows, getFigure, getFigurePos, onEnd) {
  let isTouching = false;

  window.addEventListener("touchstart", (e) => {
    if (!getFigure()) return;
    isTouching = true;
    const touch = e.touches[0];
    onEnd(false, touch.clientX, touch.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    if (!isTouching) return;
    const touch = e.touches[0];
    onEnd(false, touch.clientX, touch.clientY);
  });

  window.addEventListener("touchend", (e) => {
    if (!isTouching) return;
    isTouching = false;
    const touch = e.changedTouches[0];
    onEnd(true, touch.clientX, touch.clientY);
  });
}
