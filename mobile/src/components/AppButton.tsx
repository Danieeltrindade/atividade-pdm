import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { COLORS } from '../constants/colors';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  outlined?: boolean;
}

export default function AppButton({ label, onPress, style, textStyle, outlined }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, outlined ? styles.outlined : styles.filled, pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, outlined ? styles.labelOutlined : styles.labelFilled, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: COLORS.primary,
  },
  outlined: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelFilled: {
    color: COLORS.white,
  },
  labelOutlined: {
    color: COLORS.primary,
  },
});
