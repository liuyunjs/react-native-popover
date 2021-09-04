import React from 'react';
import { AnimationPresupposition } from 'rmotion';
import { I18nManager, StyleSheet, View } from 'react-native';
import { Modal, ModalProps } from 'react-native-smart-modal';
import { computeGeometry, Placement, Rect, Size } from './geometry';
import { getArea, getTranslateOrigin, Inset } from './utils';
import { PopoverArrow, PopoverArrowProps } from './PopoverArrow';

export type PopoverModalProps = Omit<
  ModalProps,
  | 'onChange'
  | 'contentContainerStyle'
  | 'visible'
  | 'onWillChange'
  | 'namespace'
  | 'animationConf'
  | 'animation'
> &
  Omit<PopoverArrowProps, 'origin' | 'anchor' | 'placement'> & {
    measure: Size;
    arrowSize: Size;
    fromRect: Rect;
    inset: Inset | number;
    onChange: (visible: boolean) => void;
    placement: Placement | 'auto';
    visible: boolean;
  };

const animationConf = { duration: 200 };

export const PopoverModal: React.FC<PopoverModalProps> = ({
  measure,
  children,
  arrowSize,
  fromRect,
  inset,
  placement,
  onChange,
  visible,
  isDark,
  ...rest
}) => {
  const {
    origin,
    anchor,
    placement: p,
    arrow,
  } = computeGeometry(measure, placement, fromRect, getArea(inset), arrowSize);

  const translateOrigin = getTranslateOrigin(measure, origin, anchor);

  const animation: AnimationPresupposition = {
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
    <Modal
      {...rest}
      contentContainerStyle={{
        top: origin[1],
        left: origin[0],
        width: measure![0],
        height: measure![1],
        flex: 0,
      }}
      animationConf={animationConf}
      onWillChange={onChange}
      animation={animation}
      namespace="popover"
      visible={visible}>
      <View style={StyleSheet.absoluteFill}>
        <PopoverArrow isDark={isDark} placement={p} {...arrow} />
        {children}
      </View>
    </Modal>
  );
};
