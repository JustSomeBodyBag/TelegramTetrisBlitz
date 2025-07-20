document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const joystickZone = document.getElementById("joystick-zone");
  const menuButton = document.getElementById("menu-button");

  const rows = 8;
  const cols = 8;
  let cellSize = 40;

  const figure = [
    [1],
    [1],
    [1],
    [1],
  ];

  let figurePos = { row: 0, col: 2 };

  function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    cellSize = canvas.width / cols;
  }

  function drawField() {
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#2c3e50";
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    for (let j = 0; j <= cols; j++) {
      ctx.beginPath();
      ctx.moveTo(j * cellSize, 0);
      ctx.lineTo(j * cellSize, canvas.height);
      ctx.stroke();
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

  resizeCanvas();
  redraw();

  window.addEventListener("resize", () => {
    resizeCanvas();
    redraw();
  });

  // 🖱 Управление мышью — перемещаем по сетке при зажатии
  let isDragging = false;

  canvas.addEventListener("mousedown", () => {
    isDragging = true;
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (
      col >= 0 &&
      col <= cols - figure[0].length &&
      row >= 0 &&
      row <= rows - figure.length
    ) {
      figurePos = { col, row };
      redraw();
    }
  });

  // 📱 Управление пальцем — свайпы влево/вправо/вниз
  if (joystickZone) {
    let startX = null;
    let startY = null;
    let lastMove = 0;

    joystickZone.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    joystickZone.addEventListener("touchmove", (e) => {
      const now = Date.now();
      if (now - lastMove < 100) return;

      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Горизонтальное
        if (dx > 20 && figurePos.col < cols - figure[0].length) {
            figurePos.col++;
            startX = touch.clientX;
        } else if (dx < -20 && figurePos.col > 0) {
            figurePos.col--;
            startX = touch.clientX;
        }
        } else {
        // Вертикальное
        if (dy > 20 && figurePos.row < rows - figure.length) {
            figurePos.row++;
            startY = touch.clientY;
        } else if (dy < -20 && figurePos.row > 0) {
            figurePos.row--;
            startY = touch.clientY;
        }
       }


      lastMove = now;
      redraw();
    });
  }

  // 📎 Кнопка меню
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "Меню",
          message: "Пауза, настройки, донат",
          buttons: [{ text: "Закрыть", type: "close" }],
        });
      }
    });
  }

  console.log("✅ UI и управление загружены");
});
