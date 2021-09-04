import React from 'react';
import {
  GestureResponderEvent,
  UIManager,
  I18nManager,
  Dimensions,
  unstable_batchedUpdates,
} from 'react-native';
import { PopoverInternal, PopoverInternalProps } from './PopoverInternal';

type PopoverProps = Partial<
  Omit<PopoverInternalProps, 'fromRect' | 'onChange' | 'visible' | 'isDark'>
> & {};

export const Popover: React.FC<PopoverProps> = ({ children, ...rest }) => {
  const [rect, setRect] = React.useState<
    PopoverInternalProps['fromRect'] | undefined
  >();
  const [visible, setVisible] = React.useState(false);

  const child = React.Children.only(children) as React.ReactElement;

  const childOnPress = child.props.onPress;
  const { builder } = rest;
  const onPress = builder
    ? (e: GestureResponderEvent) => {
        UIManager.measureInWindow(
          // @ts-ignore
          e.target._nativeTag,
          (x, y, width, height) => {
            if (I18nManager.isRTL) {
              x = Dimensions.get('window').width - x - width;
            }

            unstable_batchedUpdates(() => {
              setVisible(true);
              setRect([x, y, width, height]);
            });
          },
        );

        childOnPress?.(e);
      }
    : childOnPress;

  const elem = React.cloneElement(child, {
    disabled: !onPress || child.props.disabled,
    onPress,
  });

  return (
    <>
      {elem}
      {!!builder && (
        // @ts-ignore
        <PopoverInternal
          {...rest}
          visible={visible}
          onChange={setVisible}
          fromRect={rect!}
        />
      )}
    </>
  );
};

Popover.defaultProps = {
  arrowSize: [16, 8],
  placement: 'auto',
  inset: 10,
};
