import { Dimensions } from 'react-native';
import { isNumber } from '@liuyunjs/utils/lib/isNumber';
import { Rect, Point, Size } from './geometry';

export type Inset = { top: number; start: number; end: number; bottom: number };

const { width, height } = Dimensions.get('window');

const getInset = (inset: Inset | number): Inset => {
  if (isNumber(inset)) {
    return {
      start: inset,
      bottom: inset,
      end: inset,
      top: inset,
    };
  }
  return inset;
};

export const getArea = (insetInput: Inset | number): Rect => {
  const inset = getInset(insetInput);
  return [
    inset.start,
    inset.top,
    width - inset.start - inset.end,
    height - inset.top - inset.bottom,
  ];
};

export const getTranslateOrigin = (
  contentSize: Size,
  origin: Point,
  anchor: Point,
): Point => {
  const popoverCenter: Point = [
    origin[0] + contentSize[1] / 2,
    origin[1] + contentSize[1] / 2,
  ];
  return [anchor[0] - popoverCenter[0], anchor[1] - popoverCenter[1]];
};
