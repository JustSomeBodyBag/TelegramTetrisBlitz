import { drawFixedBlocks } from './field.js';
import { drawFigure } from './figure.js';

function drawDebugContainers(ctx, figuresPos, cellSize) {
  const containerSize = cellSize * 4;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  figuresPos.forEach(pos => {
    ctx.strokeRect(pos.x, pos.y, containerSize, containerSize);
  });
  ctx.restore();
}

export function redrawScene({
  floatingCanvas,
  gameCanvas,
  gameCtx,
  field,
  figures = [],
  figuresPos = [],
  dragCoords = null,
  dragIndex = null,
  cellSize,
  drawField,
  scaleOnDrag = 1.0,
}) {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  const floatingCtx = floatingCanvas.getContext("2d");
  floatingCtx.clearRect(0, 0, floatingCanvas.width, floatingCanvas.height);

  drawField();
  drawFixedBlocks(gameCtx, field, cellSize);

  drawDebugContainers(floatingCtx, figuresPos, cellSize);

  for (let i = 0; i < figures.length; i++) {
    const fig = figures[i];
    const pos = figuresPos[i];
    const isDragging = dragIndex === i;

    if (!fig.shape || fig.shape.length === 0) {
      console.warn(`Figure at index ${i} has no valid shape!`);
      continue;
    }

    const shape = fig.shape;

    const scale = isDragging ? scaleOnDrag : 0.7;
    const ctx = floatingCtx;

    const figWidth = shape[0].length * cellSize * scale;
    const figHeight = shape.length * cellSize * scale;

    const drawX = (isDragging && dragCoords) ? dragCoords.x : pos.x + (cellSize * 2 - figWidth / 2);
    const drawY = (isDragging && dragCoords) ? dragCoords.y : pos.y + (cellSize * 2 - figHeight / 2);

    


    drawFigure(ctx, fig, null, cellSize, {
      x: drawX,
      y: drawY,
      scale: scale
    });
    
  }
}
