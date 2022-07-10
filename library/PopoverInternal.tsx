import * as React from 'react';
import { Size, Rect } from './geometry';
import { PopoverMeasure } from './PopoverMeasure';
import { ModalityPopover, PopoverModalProps } from './ModalityPopover';

export type PopoverInternalProps = PopoverModalProps & {
  fromRect: Rect;
};

export const PopoverInternal: React.FC<
  React.PropsWithChildren<PopoverInternalProps>
> = ({ children, ...rest }) => {
  const [measure, setMeasure] = React.useState<Size>();
  const measured = !!measure;
  let elem = children as React.ReactElement;
  if (!elem) return null;

  elem = (
    <PopoverMeasure
      backgroundColor={rest.backgroundColor}
      measured={measured}
      setMeasure={setMeasure}>
      {elem}
    </PopoverMeasure>
  );

  if (!measured) {
    return elem;
  }

  return (
    <ModalityPopover {...rest} measure={measure!}>
      {elem}
    </ModalityPopover>
  );
};
