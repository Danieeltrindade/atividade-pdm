import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../constants/colors';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function AppInput({ label, error, style, ...props }: AppInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} placeholderTextColor={COLORS.muted} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { color: COLORS.white, marginBottom: 6, fontSize: 14, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  error: { color: COLORS.danger, marginTop: 6, fontSize: 13 },
});
