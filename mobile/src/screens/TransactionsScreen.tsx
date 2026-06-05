import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Modal, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Screens } from '../navigation/screenNames';
import TransactionCard from '../components/TransactionCard';
import { fetchTransactions, deleteTransaction } from '../api/transactions';
import { Transaction } from '../types/transaction';
import { COLORS } from '../constants/colors';
import AppButton from '../components/AppButton';

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function TransactionsScreen() {
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTransactions({
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      });
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isFocused) {
      loadTransactions();
    }
  }, [isFocused, loadTransactions]);

  function handleChangeMonth(offset: number) {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() + offset);
    setSelectedDate(date);
  }

  function handleLongPress(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  }

  async function handleDelete() {
    if (!selectedTransaction) return;
    try {
      await deleteTransaction(selectedTransaction.id);
      setTransactions((prev) => prev.filter((item) => item.id !== selectedTransaction.id));
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a transação.');
    }
  }

  function handleEdit() {
    if (!selectedTransaction) return;
    setModalVisible(false);
    navigation.navigate(Screens.NewTransaction as any, { transaction: selectedTransaction });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <View style={styles.filterRow}>
          <AppButton label="<" onPress={() => handleChangeMonth(-1)} style={styles.filterButton} />
          <Text style={styles.filterLabel}>{monthLabels[selectedDate.getMonth()]} / {selectedDate.getFullYear()}</Text>
          <AppButton label=">" onPress={() => handleChangeMonth(1)} style={styles.filterButton} />
        </View>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard transaction={item} onLongPress={() => handleLongPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTransactions(); }} tintColor={COLORS.primary} />}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>Nenhuma transação encontrada para este período.</Text> : null}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ações da transação</Text>
            <Text style={styles.modalSubtitle}>{selectedTransaction?.description}</Text>
              <AppButton label="Editar" onPress={handleEdit} style={{ marginTop: 12, backgroundColor: COLORS.primary }} />
            <AppButton label="Excluir" onPress={handleDelete} style={{ marginTop: 12, backgroundColor: COLORS.danger }} />
            <AppButton label="Fechar" onPress={() => setModalVisible(false)} outlined style={{ marginTop: 12 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24 },
  header: { marginBottom: 18 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginBottom: 10 },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterLabel: { color: COLORS.muted, fontSize: 16, marginHorizontal: 12 },
  filterButton: { minWidth: 50 },
  listContent: { paddingBottom: 36 },
  emptyText: { color: COLORS.muted, textAlign: 'center', marginTop: 36 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.85)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.card, borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white },
  modalSubtitle: { color: COLORS.muted, marginTop: 8, marginBottom: 18 },
});
