import * as React from 'react';
import { ColorValue, LayoutChangeEvent, View } from 'react-native';
import { styles } from './styles';
import { Size } from './geometry';

type PopoverMeasureProps = {
  setMeasure: React.Dispatch<React.SetStateAction<Size | undefined>>;
  measured: boolean;
  backgroundColor: ColorValue;
};

export const PopoverMeasure: React.FC<
  React.PropsWithChildren<PopoverMeasureProps>
> = ({ setMeasure, children, measured, backgroundColor }) => {
  const onLayout = (e: LayoutChangeEvent) => {
    const { layout } = e.nativeEvent;
    setMeasure([Math.round(layout.width), Math.round(layout.height)]);
  };

  return (
    <View
      onLayout={measured ? undefined : onLayout}
      pointerEvents={measured ? 'auto' : 'none'}
      style={[
        styles.content,
        { backgroundColor },
        !measured && styles.measure,
      ]}>
      {children}
    </View>
  );
};
