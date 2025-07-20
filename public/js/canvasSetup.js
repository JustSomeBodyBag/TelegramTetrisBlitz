export function setupCanvas(canvas, cols, rows) {
  const ctx = canvas.getContext("2d");
  const cellSize = 40;

  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  function drawField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#18222d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00bfff";
    ctx.lineWidth = 1;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellSize);
      ctx.lineTo(cols * cellSize, r * cellSize);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellSize, 0);
      ctx.lineTo(c * cellSize, rows * cellSize);
      ctx.stroke();
    }
  }

  return { ctx, cellSize, drawField };
}
