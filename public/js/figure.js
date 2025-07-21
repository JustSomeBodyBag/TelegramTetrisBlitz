import { FIGURE_DESIGNS } from './design.js';


export function drawFigure(ctx, figure, gridPos, cellSize, pixelPos = null, options = {}) {
  const scale = options.scale ?? 1;
  const offsetX = options.offsetX ?? 0;
  const offsetY = options.offsetY ?? 0;

  const shape = figure.shape;
  const design = FIGURE_DESIGNS[figure.id] || { color: figure.color ?? "#999", borderColor: "#666" };

  ctx.fillStyle = design.color;
  ctx.strokeStyle = design.borderColor;
  const borderWidth = 2;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;

      let x, y;

      if (pixelPos) {
        x = pixelPos.x + (col * cellSize * scale) + offsetX;
        y = pixelPos.y + (row * cellSize * scale) + offsetY;
      } else if (gridPos) {
        x = gridPos.col * cellSize + col * cellSize;
        y = gridPos.row * cellSize + row * cellSize;
      } else {
        continue;
      }

      ctx.fillRect(x, y, cellSize * scale, cellSize * scale);

      // Рисуем рамку
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(x, y, cellSize * scale, cellSize * scale);
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