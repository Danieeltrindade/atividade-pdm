import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../types/category';
import { COLORS } from '../constants/colors';

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: category.color || COLORS.surface }]}> 
      <Text style={styles.label}>{category.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
  },
  label: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
