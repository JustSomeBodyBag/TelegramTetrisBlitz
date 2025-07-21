export function setupMouseControls(canvas, onDragStart, onDragMove, onDragEnd) {
  let dragging = false;

  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    onDragStart(e);
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    onDragMove(e, { isTouch: false });  // <-- мышь
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
    e.preventDefault();
    dragging = true;
    onDragStart(e.touches[0]);
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    e.preventDefault();
    onDragMove(e.touches[0], { isTouch: true });  // <-- тач
  }, { passive: false });

  window.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    onDragEnd(e);
  });
}
