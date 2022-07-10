import * as React from 'react';
import { GestureResponderEvent } from 'react-native';
import { isFunction } from '@liuyunjs/utils/lib/isFunction';
import { Popover } from './Popover';

export type LegacyPopoverProps = Partial<
  Omit<
    React.ComponentProps<typeof Popover>,
    'fromRect' | 'visible' | 'onWillChange' | 'onChange'
  >
> & {
  builder?: () => React.ReactElement;
};

export const LegacyPopover: React.FC<
  React.PropsWithChildren<LegacyPopoverProps>
> = ({ children, ...rest }) => {
  const child = React.Children.only(children) as React.ReactElement;
  const [visible, setVisible] = React.useState(false);
  const fromRef = React.useRef<any>();
  const { onPress: childOnPress, disabled } = child.props;
  const { builder } = rest;
  const onPress = builder
    ? (e: GestureResponderEvent) => {
        setVisible(!visible);
        childOnPress?.(e);
      }
    : childOnPress;

  // @ts-ignore
  const childRef = child.ref;

  const elem = React.cloneElement(child, {
    disabled: !onPress || disabled,
    onPress,
    ref: childRef
      ? (ref: any) => {
          fromRef.current = ref;
          if (isFunction(childRef)) {
            childRef(ref);
          } else {
            childRef.current = ref;
          }
        }
      : fromRef,
  });

  return (
    <>
      {elem}
      {!!builder && (
        <Popover
          {...(rest as any)}
          visible={visible}
          onWillChange={setVisible}
          fromRef={fromRef}>
          {builder()}
        </Popover>
      )}
    </>
  );
};
