import * as React from 'react';
import { ColorValue, I18nManager } from 'react-native';
import Animated, {
  EntryAnimationsValues,
  ExitAnimationsValues,
  LayoutAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ModalInternalProps, ModalInternal } from 'react-native-smart-modal';
import { computeGeometry, Placement, Rect, Size } from './geometry';
import { getArea, getTranslateOrigin, Inset } from './utils';
import { styles } from './styles';

export type PopoverModalProps = Omit<
  ModalInternalProps,
  'animationIn' | 'animationOut'
> & {
  arrowSize: Size;
  fromRect: Rect;
  inset: Inset | number;
  placement: Placement | 'auto';
  duration: number;
  backgroundColor: ColorValue;
};

const ARROW_DEG: { [index in Placement]: string } = {
  bottom: '-180deg',
  start: I18nManager.isRTL ? '90deg' : '-90deg',
  end: I18nManager.isRTL ? '-90deg' : '90deg',
  top: '0deg',
};

export const ModalityPopover: React.FC<
  React.PropsWithChildren<PopoverModalProps>
> = ({
  children,
  arrowSize,
  fromRect,
  inset,
  placement,
  contentContainerStyle,
  backgroundColor,
  duration = 300,
  ...rest
}) => {
  const arrowPlacement = useSharedValue<Placement>('bottom');
  const arrowPosition = useSharedValue({ measure: [0, 0], origin: [0, 0] });

  const calcTranslation = (measure: Size) => {
    'worklet';
    const {
      origin,
      anchor,
      placement: p,
      arrow,
    } = computeGeometry(
      measure,
      placement,
      fromRect,
      getArea(inset),
      arrowSize,
    );

    arrowPlacement.value = p;
    arrowPosition.value = arrow;

    const translateOrigin = getTranslateOrigin(measure, origin, anchor);

    return [origin, translateOrigin] as const;
  };

  const animationIn = (values: EntryAnimationsValues): LayoutAnimation => {
    'worklet';
    const [origin, translateOrigin] = calcTranslation([
      values.targetWidth,
      values.targetHeight,
    ]);

    const config = { duration };

    return {
      initialValues: {
        originX: origin[0],
        originY: origin[1],
        opacity: 0,
        transform: [
          { translateX: translateOrigin[0] * (I18nManager.isRTL ? -1 : 1) },
          { translateY: translateOrigin[1] },
          { scale: 0 },
        ],
      },
      animations: {
        opacity: withTiming(1, config),
        transform: [
          { translateX: withTiming(0, config) },
          { translateY: withTiming(0, config) },
          { scale: withTiming(1, config) },
        ],
      },
    };
  };

  const animationOut = (values: ExitAnimationsValues): LayoutAnimation => {
    'worklet';

    const [origin, translateOrigin] = calcTranslation([
      values.currentWidth,
      values.currentHeight,
    ]);

    const config = { duration };

    return {
      initialValues: {
        originX: origin[0],
        originY: origin[1],
        opacity: 1,
        transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
      },
      animations: {
        opacity: withTiming(0, config),
        transform: [
          {
            translateX: withTiming(
              translateOrigin[0] * (I18nManager.isRTL ? -1 : 1),
              config,
            ),
          },
          { translateY: withTiming(translateOrigin[1], config) },
          { scale: withTiming(0, config) },
        ],
      },
    };
  };

  const arrowStyle = useAnimatedStyle(() => {
    const {
      measure: [width, height],
      origin,
    } = arrowPosition.value;
    return {
      width,
      height,
      borderTopWidth: height / 2,
      left: origin[0],
      top: origin[1],
      borderEndWidth: width / 2,
      borderBottomWidth: height / 2,
      borderStartWidth: width / 2,
      transform: [{ rotate: ARROW_DEG[arrowPlacement.value] }],
    };
  });

  return (
    <ModalInternal
      {...rest}
      contentContainerStyle={[
        styles.content,
        contentContainerStyle,
        { backgroundColor },
      ]}
      animationOut={animationOut}
      animationIn={animationIn}>
      <Animated.View
        style={[styles.arrow, { borderTopColor: backgroundColor }, arrowStyle]}
      />
      {children}
    </ModalInternal>
  );
};
