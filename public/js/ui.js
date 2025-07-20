document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const controls = document.getElementById("controls");

  const rows = 8;
  const cols = 8;
  const cellSize = 40;

  const field = Array.from({ length: rows }, () => Array(cols).fill(0));

  const figure = [
    [1],
    [1],
    [1],
    [1],
  ];

  let figurePos = { row: 0, col: 2 };

  function drawField() {
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (field[r][c]) {
          ctx.fillStyle = "#00bfff";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
        ctx.beginPath();
        ctx.rect(c * cellSize, r * cellSize, cellSize, cellSize);
        ctx.stroke();
      }
    }
  }

  function drawFigure(pos) {
    ctx.fillStyle = "#ff6347";
    for (let r = 0; r < figure.length; r++) {
      for (let c = 0; c < figure[r].length; c++) {
        if (figure[r][c]) {
          const x = (pos.col + c) * cellSize;
          const y = (pos.row + r) * cellSize;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  function fixFigure(fig, pos) {
    for (let r = 0; r < fig.length; r++) {
      for (let c = 0; c < fig[r].length; c++) {
        if (fig[r][c]) {
          const fr = pos.row + r;
          const fc = pos.col + c;
          if (fr >= 0 && fr < rows && fc >= 0 && fc < cols) {
            field[fr][fc] = 1;
          }
        }
      }
    }
  }

  function clearFullLines() {
    let linesCleared = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if (field[r].every(cell => cell === 1)) {
        field.splice(r, 1);
        field.unshift(Array(cols).fill(0));
        linesCleared++;
        r++;
      }
    }
    return linesCleared;
  }

  function redraw() {
    drawField();
    drawFigure(figurePos);
  }

  redraw();

  // 👇 Управление свайпом
  let startX = 0;
  let startY = 0;

  controls.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  controls.addEventListener("touchend", e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      // горизонтальный свайп
      if (dx > 20 && figurePos.col < cols - figure[0].length) {
        figurePos.col += 1;
      } else if (dx < -20 && figurePos.col > 0) {
        figurePos.col -= 1;
      }
    } else {
      // вертикальный свайп
      if (dy > 20 && figurePos.row < rows - figure.length) {
        figurePos.row += 1;
      }
    }

    redraw();
  });

  // 👇 Фиксация по кнопке (или автоматически, если нужно)
  document.getElementById("menu-button").addEventListener("click", () => {
    fixFigure(figure, figurePos);
    clearFullLines();
    figurePos = { row: 0, col: 2 };
    redraw();
  });
});
