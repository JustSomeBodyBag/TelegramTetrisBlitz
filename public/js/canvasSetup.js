export function setupCanvas(canvas, cols, rows) {
  const ctx = canvas.getContext("2d");
  let cellSize = 40;

  function resizeCanvas() {
    const width = cellSize * cols;
    const height = cellSize * rows;
    canvas.width = width;
    canvas.height = height;
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

  resizeCanvas();

  return { ctx, cellSize, drawField, resizeCanvas };
}
