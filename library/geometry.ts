// 参考 https://github.com/doomsower/react-native-modal-popover

import { getTranslateOrigin } from './utils';

export type Point = [number, number];

export type Rect = [number, number, number, number];

export type Size = [number, number];

export type Placement = 'top' | 'end' | 'bottom' | 'start';

type Arrow = { measure: Size; origin: Point };

export interface Geometry {
  origin: Point;
  anchor: Point;
  placement: Placement;
  arrow: Arrow;
}

type ComputeGeometry = (
  displayArea: Rect,
  fromRect: Rect,
  contentSize: Size,
  arrowSize: Size,
) => Geometry;

const clamp = (
  displayArea: Rect,
  contentSize: Size,
  offset: number,
  index: number,
) =>
  Math.min(
    displayArea[index] + displayArea[index + 2] - contentSize[index],
    Math.max(displayArea[index], offset),
  );

const getHorizontalXOrVerticalY = (
  displayArea: Rect,
  fromRect: Rect,
  contentSize: Size,
  index: number,
) => {
  return clamp(
    displayArea,
    contentSize,
    fromRect[index] + (fromRect[index + 2] - contentSize[index]) / 2,
    index,
  );
};

const computeArrowGeometry = (
  arrowSize: Size,
  origin: Point,
  anchor: Point,
): Arrow => {
  const width = arrowSize[0] + 2;
  const height = arrowSize[1] * 2 + 2;
  return {
    measure: [width, height],
    origin: getTranslateOrigin([width, height], origin, anchor),
  };
};

const computeTopGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  // 横坐标 - 目标内容的宽度减去本身的高度除以2 得到 left 偏移量
  // 限定横坐标的边界，view 不能超出左右边界
  const x = getHorizontalXOrVerticalY(displayArea, fromRect, contentSize, 0);

  // 纵坐标 - 本身高度 - 想要偏移的大小 得到 top 偏移量
  const y = fromRect[1] - contentSize[1] - arrowSize[1];

  const origin: Point = [x, y];
  // 放大缩小的锚点
  const anchor: Point = [fromRect[0] + fromRect[2] / 2, fromRect[1]];

  return {
    origin,
    anchor,
    placement: 'top',
    arrow: computeArrowGeometry(arrowSize, origin, anchor),
  };
};

const computeBottomGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  // 横坐标 - 目标内容的宽度减去本身的高度除以2 得到 left 偏移量
  // 限定横坐标的边界，view 不能超出左右边界
  const x = getHorizontalXOrVerticalY(displayArea, fromRect, contentSize, 0);

  // 目标纵坐标 + 目标本身高度 + 想要偏移的大小 得到 top 偏移量
  const y = fromRect[1] + fromRect[3] + arrowSize[1];

  const origin: Point = [x, y];
  // 放大缩小的锚点
  const anchor: Point = [
    fromRect[0] + fromRect[2] / 2,
    fromRect[1] + fromRect[3],
  ];

  return {
    origin,
    anchor,
    placement: 'bottom',
    arrow: computeArrowGeometry(arrowSize, origin, anchor),
  };
};

const computeStartGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  // 目标横坐标 - 内容本身宽度 - 想要偏移的大小 得到 left 偏移量
  const x = fromRect[0] - contentSize[0] - arrowSize[1];

  // 纵坐标 - 目标内容的高度减去本身的高度除以2 得到 top 偏移量
  // 限定横坐标的边界，view 不能超出上下边界
  const y = getHorizontalXOrVerticalY(displayArea, fromRect, contentSize, 1);

  const origin: Point = [x, y];
  // 放大缩小的锚点
  const anchor: Point = [fromRect[0], fromRect[1] + fromRect[3] / 2];

  return {
    origin,
    anchor,
    placement: 'start',
    arrow: computeArrowGeometry(arrowSize, origin, anchor),
  };
};

const computeEndGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  const x = fromRect[0] + fromRect[2] + arrowSize[1];

  const y = getHorizontalXOrVerticalY(displayArea, fromRect, contentSize, 1);

  const origin: Point = [x, y];
  // 放大缩小的锚点
  const anchor: Point = [
    fromRect[0] + fromRect[2],
    fromRect[1] + fromRect[3] / 2,
  ];

  return {
    origin,
    anchor,
    placement: 'end',
    arrow: computeArrowGeometry(arrowSize, origin, anchor),
  };
};

const computeAutoGeometry = (
  displayArea: Rect,
  fromRect: Rect,
  contentSize: Size,
  arrowSize: Size,
): Geometry => {
  let geom: Geometry | null = null;
  const placements: Placement[] = ['start', 'end', 'top', 'bottom'];

  for (let i = 0; i < 4; i += 1) {
    const placement = placements[i];
    geom = computeGeometry(
      contentSize,
      placement,
      fromRect,
      displayArea,
      arrowSize,
    );
    const { origin, arrow } = geom;

    if (
      inDisplayRect(displayArea, contentSize, arrowSize, origin, arrow.origin)
    ) {
      break;
    }
  }

  return geom!;
};

const inDisplayRect = (
  displayArea: Rect,
  contentSize: Size,
  arrowSize: Size,
  origin: Point,
  arrowOrigin: Point,
) => {
  return [0, 1].reduce((previousValue, currentValue) => {
    const max =
      displayArea[currentValue] +
      displayArea[currentValue + 2] -
      contentSize[currentValue];
    const min = displayArea[currentValue];
    const curr = origin[currentValue];
    const arrowOffset = arrowOrigin[currentValue];

    return previousValue && max >= curr && min <= curr && arrowOffset >= 0;
  }, true);
};

const helpers: Record<Placement, ComputeGeometry> = {
  start: computeStartGeometry,
  end: computeEndGeometry,
  top: computeTopGeometry,
  bottom: computeBottomGeometry,
};

export const computeGeometry = (
  contentSize: Size,
  placement: Placement | 'auto',
  fromRect: Rect,
  displayArea: Rect,
  arrowSize: Size,
): Geometry => {
  const helper = helpers[placement as Placement] || computeAutoGeometry;

  return helper(displayArea, fromRect, contentSize, arrowSize);
};
