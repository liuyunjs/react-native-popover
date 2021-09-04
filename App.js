import React from 'react';
import { SafeAreaView, Text, View, I18nManager } from 'react-native';
import { Popover } from './library/main';

I18nManager.forceRTL(false);

export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
      <Popover
        containerStyle={{ zIndex: 500 }}
        inset={{ top: 54, bottom: 44, start: 10, end: 10 }}
        placement="bottom"
        builder={() => <View style={{ width: 100, height: 100 }} />}>
        <Text
          disabled
          style={{
            top: 100,
            fontSize: 24,
            // margin: 100,
            backgroundColor: 'red',
          }}>
          Popover
        </Text>
      </Popover>
    </SafeAreaView>
  );
}
