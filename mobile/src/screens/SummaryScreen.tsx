import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { fetchSummary } from '../api/transactions';
import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/format';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 48;
const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function SummaryScreen() {
  const isFocused = useIsFocused();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categories: [] as Array<{ name: string; value: number }> ,
    monthlyEvolution: [] as Array<{ month: string; value: number }>,
  });
  const [loading, setLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) loadSummary();
  }, [isFocused, loadSummary]);

  const pieData = summary.categories.map((item, index) => ({
    name: item.name,
    population: item.value,
    color: ['#22C55E', '#0F172A', '#64748B', '#38BDF8', '#F59E0B'][index % 5],
    legendFontColor: COLORS.text,
    legendFontSize: 12,
  }));

  const barLabels = summary.monthlyEvolution.map((item) => item.month);
  const barValues = summary.monthlyEvolution.map((item) => item.value);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resumo Financeiro</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 24 }} />
      ) : (
        <>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Receitas</Text>
            <Text style={[styles.metricValue, { color: COLORS.success }]}>{formatCurrency(summary.totalIncome)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Despesas</Text>
            <Text style={[styles.metricValue, { color: COLORS.danger }]}>{formatCurrency(summary.totalExpense)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Saldo</Text>
            <Text style={styles.metricValue}>{formatCurrency(summary.balance)}</Text>
          </View>
          <Text style={styles.chartTitle}>Gastos por categoria</Text>
          <PieChart
            data={pieData}
            width={screenWidth}
            height={240}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={styles.chartTitle}>Evolução mensal</Text>
          <BarChart
            data={{ labels: barLabels, datasets: [{ data: barValues }] }}
            width={screenWidth}
            height={260}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </>
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: COLORS.background,
  backgroundGradientTo: COLORS.surface,
  decimalPlaces: 0,
  color: () => COLORS.primary,
  labelColor: () => COLORS.text,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: COLORS.primary,
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingBottom: 40 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginBottom: 18 },
  metricBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
  },
  metricLabel: { color: COLORS.muted, fontSize: 14, marginBottom: 6 },
  metricValue: { color: COLORS.white, fontSize: 24, fontWeight: '800' },
  chartTitle: { marginTop: 22, color: COLORS.white, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  chart: { borderRadius: 24, backgroundColor: COLORS.surface },
});
