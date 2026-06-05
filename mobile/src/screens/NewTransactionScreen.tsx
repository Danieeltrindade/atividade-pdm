import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { createTransaction, updateTransaction } from '../api/transactions';
import { fetchCategories } from '../api/categories';
import { Category } from '../types/category';
import { COLORS } from '../constants/colors';
import { formatDate } from '../utils/format';

const transactionSchema = z.object({
  description: z.string().min(3, 'Descrição inválida'),
  amount: z.string().regex(/^[0-9]+(,[0-9]{1,2})?$/, 'Valor inválido'),
  date: z.string().min(10, 'Data inválida'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  type: z.enum(['income', 'expense']),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function NewTransactionScreen() {
  const route = useRoute();
  const transactionToEdit = (route.params as any)?.transaction as any | undefined;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(transactionToEdit);

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: '',
      date: formatDate(new Date().toISOString()),
      categoryId: '',
      type: 'income',
    },
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadCategories();
    if (transactionToEdit) {
      reset({
        description: transactionToEdit.description,
        amount: String(transactionToEdit.amount).replace('.', ','),
        date: transactionToEdit.date,
        categoryId: transactionToEdit.categoryId ?? '',
        type: transactionToEdit.type,
      });
    }
  }, []);

  async function onSubmit(values: TransactionFormValues) {
    try {
      setLoading(true);
      const payload = {
        description: values.description,
        amount: Number(values.amount.replace(',', '.')),
        date: values.date,
        categoryId: values.categoryId,
        type: values.type,
      };
      if (isEditing && transactionToEdit) {
        await updateTransaction(transactionToEdit.id, payload);
      } else {
        await createTransaction(payload);
      }
      Alert.alert('Sucesso', 'Transação cadastrada com sucesso.');
      setValue('description', '');
      setValue('amount', '');
      setValue('categoryId', '');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a transação.');
    } finally {
      setLoading(false);
    }
  }

  const selectedCategoryId = watch('categoryId');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{isEditing ? 'Editar Transação' : 'Nova Transação'}</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Descrição" value={value} onChangeText={onChange} error={errors.description?.message} />
          )}
        />
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Valor (ex: 1200,50)" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.amount?.message} />
          )}
        />
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <AppInput label="Data (dd/mm/aaaa)" value={value} onChangeText={onChange} error={errors.date?.message} />
          )}
        />
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.segmentRow}>
          <TouchableOpacity onPress={() => setValue('type', 'income')} style={[styles.segmentButton, watch('type') === 'income' && styles.segmentButtonActive]}>
            <Text style={[styles.segmentLabel, watch('type') === 'income' && styles.segmentLabelActive]}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setValue('type', 'expense')} style={[styles.segmentButton, watch('type') === 'expense' && styles.segmentButtonActive]}>
            <Text style={[styles.segmentLabel, watch('type') === 'expense' && styles.segmentLabelActive]}>Despesa</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryItem, selectedCategoryId === category.id && styles.categoryItemSelected, { backgroundColor: category.color || COLORS.surface }]}
              onPress={() => setValue('categoryId', category.id)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.categoryId ? <Text style={styles.error}>{errors.categoryId.message}</Text> : null}
        <AppButton label={loading ? 'Salvando...' : 'Salvar transação'} onPress={handleSubmit(onSubmit)} style={{ marginTop: 16 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginBottom: 16 },
  label: { color: COLORS.muted, marginBottom: 8, fontWeight: '600' },
  segmentRow: { flexDirection: 'row', marginBottom: 18 },
  segmentButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentLabel: { color: COLORS.white, fontWeight: '700' },
  segmentLabelActive: { color: COLORS.background },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryItemSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  categoryText: { color: COLORS.white },
  error: { color: COLORS.danger, marginTop: 4 },
});
