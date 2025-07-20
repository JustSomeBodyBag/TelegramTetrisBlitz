export function setupCanvas(canvas, cols, rows, onResize) {
  const ctx = canvas.getContext("2d");
  let cellSize = 40;

  function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    cellSize = canvas.width / cols;
    onResize && onResize();
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

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  return { ctx, cellSize, drawField, resizeCanvas };
}
