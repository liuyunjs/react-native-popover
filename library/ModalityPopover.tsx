import * as React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { ModalInternalProps, ModalInternal } from 'react-native-smart-modal';
import { computeGeometry, Placement, Rect, Size } from './geometry';
import { getArea, getTranslateOrigin, Inset } from './utils';
import { PopoverArrow, PopoverArrowProps } from './PopoverArrow';

export type PopoverModalProps = Omit<
  ModalInternalProps,
  'animationConf' | 'animation' | 'animationIn' | 'animationOut'
> &
  Omit<PopoverArrowProps, 'origin' | 'anchor' | 'placement'> & {
    measure: Size;
    arrowSize: Size;
    fromRect: Rect;
    inset: Inset | number;
    placement: Placement | 'auto';
  };

const animationConf = { duration: 200 };

export const ModalityPopover: React.FC<
  React.PropsWithChildren<PopoverModalProps>
> = ({
  measure,
  children,
  arrowSize,
  fromRect,
  inset,
  placement,
  contentContainerStyle,
  backgroundColor,
  ...rest
}) => {
  const {
    origin,
    anchor,
    placement: p,
    arrow,
  } = computeGeometry(measure, placement, fromRect, getArea(inset), arrowSize);

  const translateOrigin = getTranslateOrigin(measure, origin, anchor);

  const animation = {
    from: {
      opacity: 0,
      translateX: translateOrigin[0] * (I18nManager.isRTL ? -1 : 1),
      translateY: translateOrigin[1],
      scale: 0,
    },
    animate: {
      opacity: 1,
      translateX: 0,
      translateY: 0,
      scale: 1,
    },
  };

  return (
    <ModalInternal
      {...rest}
      contentContainerStyle={[
        contentContainerStyle,
        {
          top: origin[1],
          left: origin[0],
          width: measure![0],
          height: measure![1],
          flex: 0,
        },
      ]}
      animationConf={animationConf}
      animation={animation}>
      <View style={StyleSheet.absoluteFill}>
        <PopoverArrow
          backgroundColor={backgroundColor}
          placement={p}
          {...arrow}
        />
        {children}
      </View>
    </ModalInternal>
  );
};
