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
}

export function setupTouchControls(onUpdate) {
  let isTouching = false;

  window.addEventListener("touchstart", (e) => {
    isTouching = true;
    const touch = e.touches[0];
    onUpdate(false, touch.clientX, touch.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    if (!isTouching) return;
    const touch = e.touches[0];
    onUpdate(false, touch.clientX, touch.clientY);
  });

  window.addEventListener("touchend", (e) => {
    if (!isTouching) return;
    isTouching = false;
    const touch = e.changedTouches[0];
    onUpdate(true, touch.clientX, touch.clientY);
  });
}
