import { ColorValue, I18nManager, View } from 'react-native';
import * as React from 'react';
import type { Placement, Point, Size } from './geometry';
import { styles } from './styles';

const ARROW_DEG: { [index in Placement]: string } = {
  bottom: '-180deg',
  start: I18nManager.isRTL ? '90deg' : '-90deg',
  end: I18nManager.isRTL ? '-90deg' : '90deg',
  top: '0deg',
};

export type PopoverArrowProps = {
  origin: Point;
  measure: Size;
  placement: Placement;
  backgroundColor: ColorValue;
};

export const PopoverArrow: React.FC<PopoverArrowProps> = ({
  origin,
  measure,
  placement,
  backgroundColor,
}) => {
  const [width, height] = measure;

  return (
    <View
      style={[
        styles.arrow,
        {
          borderTopColor: backgroundColor,
          width,
          height,
          borderTopWidth: height / 2,
          left: origin[0],
          top: origin[1],
          borderEndWidth: width / 2,
          borderBottomWidth: height / 2,
          borderStartWidth: width / 2,
          transform: [{ rotate: ARROW_DEG[placement] }],
        },
      ]}
    />
  );
};
