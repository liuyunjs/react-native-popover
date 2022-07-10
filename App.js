import React from 'react';
import { SafeAreaView, Text, View, I18nManager } from 'react-native';
import { LegacyPopover, Popover } from './library/main';

I18nManager.forceRTL(false);

export default function App() {
  const ref = React.useRef();
  const ref2 = React.useRef();
  const ref3 = React.useRef();
  const [visible, setVisible] = React.useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <Text
        ref={ref}
        onPress={() => {
          setVisible(!visible);
        }}
        style={{
          top: 100,
          fontSize: 24,
          // margin: 100,
          backgroundColor: 'red',
        }}>
        Popover
      </Text>
      <Popover
        fromRef={ref}
        visible={visible}
        onChange={setVisible}
        placement="bottom"
        containerStyle={{ zIndex: 500 }}
        inset={{ top: 54, bottom: 44, start: 10, end: 10 }}>
        <View style={{ width: 100, height: 100 }} />
      </Popover>
      <LegacyPopover
        containerStyle={{ zIndex: 500 }}
        inset={{ top: 54, bottom: 44, start: 10, end: 10 }}
        placement="bottom"
        builder={() => <View style={{ width: 100, height: 100 }} />}>
        <Text
          ref={ref3}
          disabled
          style={{
            top: 100,
            fontSize: 24,
            // margin: 100,
            backgroundColor: 'red',
          }}>
          Popover2
        </Text>
      </LegacyPopover>

      <Text
        ref={ref2}
        onPress={() => {
          Popover.show({
            forceDark: true,
            fromRef: ref2,
            children: <View style={{ width: 130, height: 100 }} />,
            containerStyle: { zIndex: 500 },
            inset: { top: 54, bottom: 44, start: 10, end: 10 },
            placement: 'auto',
          });
        }}
        style={{
          // top: 100,
          fontSize: 24,
          backgroundColor: 'red',
        }}>
        Popover3
      </Text>
    </SafeAreaView>
  );
}
