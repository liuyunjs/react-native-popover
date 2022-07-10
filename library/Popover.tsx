import * as React from 'react';
import { darkly } from 'rn-darkly';
import { withModal } from 'react-native-smart-modal';
import { I18nManager, Dimensions } from 'react-native';
import { isFunction } from '@liuyunjs/utils/lib/isFunction';
import { PopoverInternal, PopoverInternalProps } from './PopoverInternal';

export type PopoverProps = Partial<Omit<PopoverInternalProps, 'fromRect'>> & {
  fromRef: React.MutableRefObject<any> | React.RefObject<any>;
};

const Popover: React.FC<React.PropsWithChildren<PopoverProps>> = ({
  fromRef,
  ...rest
}) => {
  const [rect, setRect] = React.useState<
    PopoverInternalProps['fromRect'] | undefined
  >();

  React.useLayoutEffect(() => {
    if (fromRef.current) {
      const ref = isFunction(fromRef.current.measure)
        ? fromRef.current
        : fromRef.current.getNode();

      ref.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          if (I18nManager.isRTL) {
            x = Dimensions.get('window').width - x - width;
          }
          setRect([x, y, width, height]);
        },
      );
    }
  }, [fromRef]);

  if (!rect) return null;

  return <PopoverInternal {...(rest as any)} fromRect={rect!} />;
};

const DarklyPopover = darkly(
  Popover,
  'style',
  'contentContainerStyle',
  'containerStyle',
  'backgroundColor',
);

DarklyPopover.defaultProps = {
  arrowSize: [16, 8],
  placement: 'auto',
  inset: 10,
  backgroundColor: '#fff',
  dark_backgroundColor: '#2b2b2b',
};

const ModalPopover = withModal(DarklyPopover);

export { ModalPopover as Popover };
