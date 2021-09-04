import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { styles } from './styles';
import { Status } from './useStatusHelper';
import { Size } from './geometry';

type PopoverMeasureProps = {
  isStatus: (status: number) => boolean;
  measure?: Size;
  setMeasure: React.Dispatch<React.SetStateAction<Size | undefined>>;
  setStatus: (status: number, update?: boolean) => void;
  isDark: boolean;
};

export const PopoverMeasure: React.FC<PopoverMeasureProps> = ({
  measure,
  setMeasure,
  setStatus,
  children,
  isStatus,
  isDark,
}) => {
  const onLayout = (e: LayoutChangeEvent) => {
    const { layout } = e.nativeEvent;
    const newMeasure: Size = [
      Math.round(layout.width),
      Math.round(layout.height),
    ];

    const queue: (() => void)[] = [];

    if (
      !measure ||
      measure[0] !== newMeasure[0] ||
      measure[1] !== newMeasure[1]
    ) {
      queue.push(() => setMeasure(newMeasure));
    }

    if (!isStatus(Status.Show)) {
      const update = !queue.length;
      queue.unshift(() => setStatus(Status.Show, update));
    }

    queue.forEach((cb) => cb());
  };

  return (
    <View
      onLayout={onLayout}
      pointerEvents={isStatus(Status.Show) ? 'auto' : 'none'}
      style={[
        styles.content,
        isDark && styles.darkContent,
        isStatus(Status.Measure) && styles.measure,
      ]}>
      {children}
    </View>
  );
};
