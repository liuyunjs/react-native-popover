import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  measure: {
    opacity: 0,
  },
  content: {
    position: 'absolute',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 8,
  },

  arrow: {
    position: 'absolute',
    borderTopColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },

  darkArrow: {
    borderTopColor: '#2b2b2b',
  },

  darkContent: {
    backgroundColor: '#2b2b2b',
  },
});
