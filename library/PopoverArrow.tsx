import { styles } from './styles';
import { I18nManager, View } from 'react-native';
import React from 'react';
import { Placement, Point, Size } from './geometry';

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
  isDark: boolean;
};

export const PopoverArrow: React.FC<PopoverArrowProps> = ({
  origin,
  measure,
  placement,
  isDark,
}) => {
  const [width, height] = measure;

  return (
    <View
      style={[
        styles.arrow,
        isDark && styles.darkArrow,
        {
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
