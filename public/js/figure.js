export function drawFigure(ctx, figureObj, pos, cellSize, offset = { x: 0, y: 0 }) {
  if (!figureObj) return;

  const figure = figureObj.shape; 
  const color = figureObj.color || "#66aaff";

  const baseX = offset.x + (pos ? pos.col * cellSize : 0);
  const baseY = offset.y + (pos ? pos.row * cellSize : 0);

  ctx.fillStyle = color;
  ctx.strokeStyle = darkenColor(color, 0.3); 

  for (let r = 0; r < figure.length; r++) {
    for (let c = 0; c < figure[r].length; c++) {
      if (figure[r][c]) {
        const x = baseX + c * cellSize;
        const y = baseY + r * cellSize;

        ctx.fillRect(x, y, cellSize, cellSize);


        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 1);
        ctx.lineTo(x + cellSize - 1, y + 1);
        ctx.lineTo(x + cellSize - 1, y + cellSize - 1);
        ctx.lineTo(x + 1, y + cellSize - 1);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}

function darkenColor(hexColor, amount = 0.2) {
  let col = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
  if (col.length === 3) {
    col = col.split("").map(c => c + c).join("");
  }
  const num = parseInt(col, 16);

  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.max(0, Math.min(255, Math.floor(r * (1 - amount))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - amount))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - amount))));

  return `rgb(${r},${g},${b})`;
}