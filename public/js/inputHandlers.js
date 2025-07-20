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
  const joystick = document.getElementById("joystick");
  let animationFrame = null;
  let touchStart = null;
  let velocity = { x: 0, y: 0 };

  function moveLoop() {
    const figure = getFigure();
    const figurePos = getFigurePos();
    if (!figure || !figurePos) return;

    const speedFactor = 0.08;
    const maxSpeed = 0.6;

    let dx = velocity.x * speedFactor;
    let dy = velocity.y * speedFactor;

    dx = Math.max(-maxSpeed, Math.min(maxSpeed, dx));
    dy = Math.max(-maxSpeed, Math.min(maxSpeed, dy));

    let newCol = figurePos.col + dx;
    let newRow = figurePos.row + dy;

    newCol = Math.max(0, Math.min(cols - figure[0].length, newCol));
    newRow = Math.max(0, Math.min(rows - figure.length, newRow));

    figurePos.col = Math.floor(newCol);
    figurePos.row = Math.floor(newRow);

    onUpdate(false);
    animationFrame = requestAnimationFrame(moveLoop);
  }

  document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
    velocity = { x: 0, y: 0 };

    joystick.style.left = `${touch.clientX}px`;
    joystick.style.top = `${touch.clientY}px`;
    joystick.style.opacity = "1";

    animationFrame = requestAnimationFrame(moveLoop);
  });

  document.addEventListener("touchmove", (e) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    velocity = {
      x: touch.clientX - touchStart.x,
      y: touch.clientY - touchStart.y,
    };
  });

  document.addEventListener("touchend", () => {
    cancelAnimationFrame(animationFrame);
    joystick.style.opacity = "0";
    velocity = { x: 0, y: 0 };
    touchStart = null;
    onUpdate(true);
  });
}
