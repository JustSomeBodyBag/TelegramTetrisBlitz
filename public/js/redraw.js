import { drawFixedBlocks } from './field.js';
import { drawFigure } from './figure.js';

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

  for (let i = 0; i < figures.length; i++) {
    const fig = figures[i];
    const pos = figuresPos[i];
    const isDragging = dragIndex === i;

    const scale = isDragging ? scaleOnDrag : 0.7;
    const ctx = isDragging ? floatingCtx : floatingCtx;

    const figWidth = fig.shape[0].length * cellSize * scale;
    const figHeight = fig.shape.length * cellSize * scale;

    const drawX = (isDragging && dragCoords) ? dragCoords.x : pos.x + (cellSize * 2 - figWidth / 2);
    const drawY = (isDragging && dragCoords) ? dragCoords.y : pos.y + (cellSize * 2 - figHeight / 2);

    drawFigure(ctx, fig, null, cellSize * scale, {
      x: drawX,
      y: drawY
    });
  }
}
