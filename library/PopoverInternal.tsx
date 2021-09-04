import React from 'react';
import { useColorScheme } from 'react-native';
import { Size, Rect } from './geometry';
import { useStatusHelper, Status } from './useStatusHelper';
import { PopoverMeasure } from './PopoverMeasure';
import { PopoverModal, PopoverModalProps } from './PopoverModal';

export type PopoverInternalProps = Omit<
  PopoverModalProps,
  'status' | 'measure' | 'fromRect' | 'is'
> & {
  builder: () => React.ReactNode;
  fromRect: Rect;
};

export const PopoverInternal: React.FC<PopoverInternalProps> = ({
  builder,
  visible,
  ...rest
}) => {
  const isDark = useColorScheme?.() === 'dark';
  const [measure, setMeasure] = React.useState<Size>();
  const [isStatus, setStatus] = useStatusHelper();

  React.useMemo(() => {
    if (visible) {
      setStatus(Status.Measure);
    } else if (!isStatus(Status.Initial)) {
      setStatus(Status.Hide);
    }
  }, [visible]);

  if (isStatus(Status.Initial)) return null;
  let elem = builder() as React.ReactElement;
  if (!elem) return null;

  elem = (
    <PopoverMeasure
      isDark={isDark}
      isStatus={isStatus}
      setStatus={setStatus}
      measure={measure}
      setMeasure={setMeasure}>
      {elem}
    </PopoverMeasure>
  );

  if (isStatus(Status.Measure)) {
    return elem;
  }

  return (
    <PopoverModal
      {...rest}
      isDark={isDark}
      visible={isStatus(Status.Show)}
      measure={measure!}>
      {elem}
    </PopoverModal>
  );
};
