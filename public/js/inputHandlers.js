export function setupMouseControls(canvas, onDragStart, onDragMove, onDragEnd) {
  let dragging = false;

  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    onDragStart(e);
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    onDragMove(e);
  });

  window.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    onDragEnd(e);
  });
}

export function setupTouchControls(canvas, onDragStart, onDragMove, onDragEnd) {
  let dragging = false;

  canvas.addEventListener("touchstart", (e) => {
    dragging = true;
    onDragStart(e.touches[0]);
  });

  window.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    onDragMove(e.touches[0]);
  });

  window.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    onDragEnd(e);
  });
}
