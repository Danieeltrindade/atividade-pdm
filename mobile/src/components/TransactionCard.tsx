import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Transaction } from '../types/transaction';
import { formatCurrency, formatDate } from '../utils/format';

interface TransactionCardProps {
  transaction: Transaction;
  onLongPress: () => void;
}

export default function TransactionCard({ transaction, onLongPress }: TransactionCardProps) {
  return (
    <Pressable style={styles.container} onLongPress={onLongPress}>
      <View style={styles.row}>
        <View style={styles.leftRow}>
          <MaterialCommunityIcons
            name={transaction.type === 'income' ? 'arrow-up-bold-circle' : 'arrow-down-bold-circle'}
            size={22}
            color={transaction.type === 'income' ? COLORS.success : COLORS.danger}
          />
          <View style={styles.textContent}>
            <Text style={styles.title}>{transaction.description}</Text>
            <Text style={styles.category}>{transaction.category}</Text>
          </View>
        </View>
        <Text style={[styles.amount, { color: transaction.type === 'income' ? COLORS.success : COLORS.danger }]}> 
          {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
        </Text>
      </View>
      <Text style={styles.date}>{formatDate(transaction.date)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textContent: { marginLeft: 12, flex: 1 },
  title: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  category: { color: COLORS.muted, marginTop: 2, fontSize: 13 },
  amount: { fontSize: 16, fontWeight: '700' },
  date: { color: COLORS.muted, marginTop: 12, fontSize: 12 },
});
