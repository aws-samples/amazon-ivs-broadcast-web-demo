import { Parser } from 'expr-eval';

export function calcScaledCoords(
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight
) {
  // get the scale
  var scale = Math.max(
    containerWidth / itemWidth,
    containerHeight / itemHeight
  );
  // get the top left position of the image
  var x = containerWidth / 2 - (itemWidth / 2) * scale;
  var y = containerHeight / 2 - (itemHeight / 2) * scale;
  return { x, y, w: itemWidth * scale, h: itemHeight * scale };
}

export function formatPositionFromDimensions({ dimensions, baseCanvasSize }) {
  const parser = new Parser();
  const dimensionsArr = Object.entries(dimensions);

  const parserConstants = {
    CANVAS_WIDTH: baseCanvasSize.width,
    CANVAS_HEIGHT: baseCanvasSize.height,
  };
  parserConstants.LAYER_WIDTH = parser.evaluate(
    dimensions.w.toString(),
    parserConstants
  );
  parserConstants.LAYER_HEIGHT = parser.evaluate(
    dimensions.h.toString(),
    parserConstants
  );

  const formattedDimensions = {};
  for (const [property, dimension] of dimensionsArr) {
    if (property === 'visible') continue;

    const formattedDimension = parser.evaluate(
      dimension.toString(),
      parserConstants
    );
    formattedDimensions[property] = formattedDimension;
  }

  return {
    x: formattedDimensions.x,
    y: formattedDimensions.y,
    index: formattedDimensions.z,
    width: formattedDimensions.w,
    height: formattedDimensions.h,
  };
}

export function compareArrays(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const difference = Array.from(set1).filter((x) => !set2.has(x));

  return difference;
}
