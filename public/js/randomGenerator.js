import { FIGURES } from './figures.js';

const CHANCE_MUST_CLEAR_LINE = 0.6;

function countFreeCells(field) {
  let count = 0;
  for (let r = 0; r < field.length; r++) {
    for (let c = 0; c < field[r].length; c++) {
      if (field[r][c] === 0) count++;
    }
  }
  return count;
}

function getShapeArea(shape) {
  let area = 0;
  for (const row of shape) {
    for (const cell of row) {
      if (cell === 1) area++;
    }
  }
  return area;
}

function getFigureSize(figure) {
  let minArea = Infinity;

  for (const shapeVariant of figure.shapes) {
    const shape = Array.isArray(shapeVariant) ? shapeVariant : shapeVariant.pattern;
    if (!shape) continue;

    const area = getShapeArea(shape);
    if (area < minArea) minArea = area;
  }

  if (minArea <= 3) return 'small';
  if (minArea <= 5) return 'medium';
  return 'large';
}

function weightedRandomSelect(items) {
  const weights = items.map(i => i.weight || 0);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    if (random < weights[i]) return items[i].value;
    random -= weights[i];
  }

  return items[items.length - 1].value;
}

function canClearLine(figure) {
  for (const shapeVariant of figure.shapes) {
    const shape = Array.isArray(shapeVariant) ? shapeVariant : shapeVariant.pattern;
    if (!shape) continue;

    for (const row of shape) {
      if (row.every(cell => cell === 1)) return true;
    }

    for (let c = 0; c < shape[0].length; c++) {
      let fullCol = true;
      for (let r = 0; r < shape.length; r++) {
        if (shape[r][c] !== 1) {
          fullCol = false;
          break;
        }
      }
      if (fullCol) return true;
    }
  }
  return false;
}

export function chooseSmartFigure(field) {
    const totalCells = 64; // 8x8 поле
    const freeCells = countFreeCells(field);
    const freeRatio = freeCells / totalCells; 

   const weights = {
    small: 0.7 + (1 - freeRatio) * 0.5,      
    medium: 0.5,                              
    large: 0.3 + freeRatio * 0.7              
  };
  const mustClearLineNow = Math.random() < CHANCE_MUST_CLEAR_LINE;

  const weightedFigures = [];

  for (const fig of FIGURES) {
    const size = getFigureSize(fig);
    if (!size) continue;

    if (mustClearLineNow && !canClearLine(fig)) continue;

    weightedFigures.push({
      value: fig,
      weight: weights[size] || 0.1
    });
  }

  if (weightedFigures.length === 0) {
    for (const fig of FIGURES) {
      const size = getFigureSize(fig);
      if (!size) continue;

      weightedFigures.push({
        value: fig,
        weight: weights[size] || 0.1
      });
    }
  }

  const chosenFigure = weightedRandomSelect(weightedFigures);

  let shapeVariant = null;
  while (true) {
    const index = Math.floor(Math.random() * chosenFigure.shapes.length);
    const variant = chosenFigure.shapes[index];
    if (Array.isArray(variant)) {
      shapeVariant = variant;
    } else if (variant.pattern) {
      shapeVariant = variant.pattern;
    } else {
      continue;
    }
    if (shapeVariant.length > 0 && shapeVariant.some(row => row.some(cell => cell === 1))) {
      break;
    }
  }

  return {
    id: chosenFigure.id,
    size: getFigureSize(chosenFigure),
    shape: shapeVariant,
  };
}
