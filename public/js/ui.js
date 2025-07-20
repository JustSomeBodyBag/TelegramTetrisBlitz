document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const joystickZone = document.getElementById("joystick-zone");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;
  const cellSize = 40;

  const figure = [
    [1],
    [1],
    [1],
    [1],
  ];

  let figurePos = { row: 0, col: 2 };
  let field = Array.from({ length: rows }, () => Array(cols).fill(0));

  function drawField() {
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

    ctx.strokeStyle = "#2c3e50";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (field[r][c]) {
          ctx.fillStyle = "#00bfff";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
        ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }

  function drawFigure() {
    ctx.fillStyle = "#ff6347";
    for (let r = 0; r < figure.length; r++) {
      for (let c = 0; c < figure[r].length; c++) {
        if (figure[r][c]) {
          const x = (figurePos.col + c) * cellSize;
          const y = (figurePos.row + r) * cellSize;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  function redraw() {
    drawField();
    drawFigure();
  }

  redraw();

  // 📦 Управление через "джойстик"
  let controlStartX = null;
  let lastMoveTime = 0;
  const MOVE_INTERVAL = 120;

  function moveFigure(dir) {
    if (dir === "left" && figurePos.col > 0) figurePos.col--;
    if (dir === "right" && figurePos.col < cols - figure[0].length) figurePos.col++;
    if (dir === "down" && figurePos.row < rows - figure.length) figurePos.row++;
    redraw();
  }

  // ☝️ touch управление
  joystickZone.addEventListener("touchstart", e => {
    controlStartX = e.touches[0].clientX;
  });

  joystickZone.addEventListener("touchmove", e => {
    const now = Date.now();
    if (now - lastMoveTime < MOVE_INTERVAL) return;

    const x = e.touches[0].clientX;
    const dx = x - controlStartX;

    if (dx > 20) {
      moveFigure("right");
      controlStartX = x;
      lastMoveTime = now;
    } else if (dx < -20) {
      moveFigure("left");
      controlStartX = x;
      lastMoveTime = now;
    }
  });

  joystickZone.addEventListener("touchend", () => {
    controlStartX = null;
  });

  // 🖱 Мышь
  joystickZone.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const targetCol = Math.floor(canvasX / cellSize);

    if (targetCol !== figurePos.col && targetCol >= 0 && targetCol < cols - figure[0].length + 1) {
      figurePos.col = targetCol;
      redraw();
    }
  });

  // ✅ Кнопка "Меню"
  menuButton.addEventListener("click", () => {
    console.log("Меню открыто");
    // действия по кнопке (пауза, окно, меню и т.д.)
  });
});
