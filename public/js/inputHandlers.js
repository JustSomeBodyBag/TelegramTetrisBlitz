export function setupMouseControls(onUpdate) {
  let isDragging = false;

  window.addEventListener("mousedown", (e) => {
    isDragging = true;
    onUpdate(false, e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    onUpdate(false, e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    onUpdate(true, e.clientX, e.clientY);
  });

  window.addEventListener("click", (e) => {
    onUpdate(true, e.clientX, e.clientY);
  });
}

export function setupTouchControls(onUpdate) {
  let touchId = null;

  document.addEventListener("touchstart", (e) => {
    const touch = e.changedTouches[0];
    touchId = touch.identifier;
    onUpdate(false, touch.clientX, touch.clientY);
  });

  document.addEventListener("touchmove", (e) => {
    if (touchId === null) return;

    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        onUpdate(false, t.clientX, t.clientY);
        break;
      }
    }
  });

  document.addEventListener("touchend", (e) => {
    if (touchId === null) return;

    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        onUpdate(true, t.clientX, t.clientY);
        touchId = null;
        break;
      }
    }
  });
}
