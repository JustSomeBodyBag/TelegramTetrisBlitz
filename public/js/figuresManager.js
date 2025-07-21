// figuresManager.js
import { doesFigureFit } from './field.js';

export function canPlaceAnyFigure(figuresToCheck, field, rows, cols) {
  for (const figure of figuresToCheck) {
    for (let row = 0; row <= rows - figure.shape.length; row++) {
      for (let col = 0; col <= cols - figure.shape[0].length; col++) {
        if (doesFigureFit(field, figure.shape, { row, col })) {
          return true;
        }
      }
    }
  }
  return false;
}
