import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../types';
import { CATEGORIES } from '../constants/categories';
import { useTheme } from '../hooks/useTheme';
import { typography, radius } from '../constants/theme';
import { List, BookOpen, Briefcase, GraduationCap, Heart, User } from 'lucide-react-native';

const IconMap: Record<string, any> = {
  'list': List,
  'book-open': BookOpen,
  'briefcase': Briefcase,
  'graduation-cap': GraduationCap,
  'heart': Heart,
  'user': User,
};

interface Props {
  category: Category;
  size?: 'small' | 'large';
}

export const CategoryBadge: React.FC<Props> = ({ category, size = 'small' }) => {
  const { theme } = useTheme();
  const catInfo = CATEGORIES.find(c => c.label === category) || CATEGORIES[0];
  const IconComponent = IconMap[catInfo.icon] || List;

  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container,
      { backgroundColor: catInfo.color + '20' }, // 20% opacity
      isSmall ? styles.smallContainer : styles.largeContainer
    ]}>
      <IconComponent size={isSmall ? 12 : 16} color={catInfo.color} />
      <Text style={[
        styles.text,
        { color: catInfo.color },
        isSmall ? styles.smallText : styles.largeText
      ]}>
        {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  largeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  text: {
    fontWeight: typography.medium,
  },
  smallText: {
    fontSize: typography.xs,
  },
  largeText: {
    fontSize: typography.sm,
  },
});
