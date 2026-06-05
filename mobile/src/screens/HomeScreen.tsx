import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { fetchSummary } from '../api/transactions';
import FinanceCard from '../components/FinanceCard';
import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/format';
import { useIsFocused } from '@react-navigation/native';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomeScreen() {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSummary();
      setSummary({
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
        balance: data.balance,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) loadSummary();
  }, [isFocused, loadSummary]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{getGreeting()}, {user?.name} 👋</Text>
      <Text style={styles.subtitle}>Confira seu desempenho financeiro do mês.</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 24 }} />
      ) : (
        <View style={styles.cardsRow}>
          <FinanceCard label="Receita" amount={formatCurrency(summary.totalIncome)} color={COLORS.success} subtext="Total do mês" />
          <FinanceCard label="Despesa" amount={formatCurrency(summary.totalExpense)} color={COLORS.danger} subtext="Total do mês" />
        </View>
      )}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo atual</Text>
        <Text style={styles.balanceValue}>{formatCurrency(summary.balance)}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destaques</Text>
        <Text style={styles.sectionDescription}>Use a aba de transações para filtrar, editar e cadastrar entradas com segurança.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24 },
  greeting: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: COLORS.muted, fontSize: 16, marginBottom: 24 },
  cardsRow: { flexDirection: 'row' },
  balanceCard: {
    marginTop: 24,
    borderRadius: 28,
    padding: 24,
    backgroundColor: COLORS.surface,
  },
  balanceLabel: { color: COLORS.muted, fontSize: 14, marginBottom: 8 },
  balanceValue: { color: COLORS.white, fontSize: 34, fontWeight: '800' },
  section: { marginTop: 28 },
  sectionTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  sectionDescription: { color: COLORS.muted, lineHeight: 22 },
});
