import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface FinanceCardProps {
  label: string;
  amount: string;
  subtext?: string;
  color?: string;
}

export default function FinanceCard({ label, amount, subtext, color = COLORS.primary }: FinanceCardProps) {
  return (
    <View style={[styles.card, { borderColor: color }]}> 
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, { color }]}>{amount}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 12,
    minWidth: 180,
  },
  label: {
    color: COLORS.muted,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtext: {
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 12,
  },
});
