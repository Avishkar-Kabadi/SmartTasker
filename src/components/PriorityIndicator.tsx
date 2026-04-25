import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Priority } from '../types';
import { PRIORITY_COLORS } from '../constants/categories';
import { radius } from '../constants/theme';

interface Props {
  priority: Priority;
  size?: number;
}

export const PriorityIndicator: React.FC<Props> = ({ priority, size = 12 }) => {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  
  return (
    <View style={[
      styles.indicator,
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: color,
        shadowColor: color,
      }
    ]} />
  );
};

const styles = StyleSheet.create({
  indicator: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  }
});
