document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const rows = 8;
  const cols = 8;

  function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
  }

  const FIGURES = [
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
  ];

  function drawFigure(baseRow, baseCol, shape, color = "#00ffcc") {
    const cellSize = canvas.width / cols;

    ctx.fillStyle = color;
    shape.forEach(({ x, y }) => {
        const row = baseRow + y;
        const col = baseCol + x;

        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      });
    }

  function drawGrid() {
    const cellSize = canvas.width / cols;

    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 1;

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

    drawFigure(2, 2, FIGURES[0]);
  }

  resizeCanvas();
  drawGrid();

  window.addEventListener("resize", () => {
    resizeCanvas();
    drawGrid();
  });

  // Обработка клика
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cellSize = canvas.width / cols;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    console.log(`Нажата клетка: (${row}, ${col})`);
  });

  // Меню-кнопка
  const menuBtn = document.getElementById("menu-button");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "Меню",
          message: "Здесь будет пауза, настройки и донат.",
          buttons: [{ text: "Закрыть", type: "close" }]
        });
      } else {
        console.warn("Telegram WebApp API недоступен");
      }
    });
  } else {
    console.warn("Кнопка меню не найдена в DOM");
  }

  console.log("🖼 drawGrid() loaded");
});
