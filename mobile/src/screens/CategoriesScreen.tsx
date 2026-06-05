import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import CategoryBadge from '../components/CategoryBadge';
import { fetchCategories, createCategory, deleteCategory, updateCategory } from '../api/categories';
import { Category } from '../types/category';
import { COLORS } from '../constants/colors';

const categorySchema = z.object({
  name: z.string().min(2, 'Nome inválido'),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, 'Use um código hexadecimal válido'),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', color: '#22C55E', icon: 'label' },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  function openNewModal() {
    setSelectedCategory(null);
    reset({ name: '', color: '#22C55E', icon: 'label' });
    setModalVisible(true);
  }

  function openEditModal(category: Category) {
    setSelectedCategory(category);
    reset({ name: category.name, color: category.color, icon: category.icon ?? 'label' });
    setModalVisible(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    try {
      setSaving(true);
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, values);
      } else {
        await createCategory(values);
      }
      await loadCategories();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    Alert.alert('Excluir categoria', `Deseja excluir a categoria ${category.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(category.id);
            await loadCategories();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a categoria.');
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Categorias</Text>
        <AppButton label="Nova categoria" onPress={openNewModal} />
      </View>
      <Text style={styles.description}>Organize suas receitas e despesas com categorias personalizadas e rápidas.</Text>
      <View style={styles.list}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryRow}>
            <View style={styles.categoryInfo}>
              <CategoryBadge category={category} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => openEditModal(category)} style={styles.actionButton}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              {!category.isDefault ? (
                <TouchableOpacity onPress={() => handleDelete(category)} style={styles.actionButton}>
                  <Text style={[styles.actionText, { color: COLORS.danger }]}>Excluir</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCategory ? 'Editar categoria' : 'Nova categoria'}</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <AppInput label="Nome" value={value} onChangeText={onChange} error={errors.name?.message} />
              )}
            />
            <Controller
              control={control}
              name="color"
              render={({ field: { value, onChange } }) => (
                <AppInput label="Cor (hex)" value={value} onChangeText={onChange} error={errors.color?.message} />
              )}
            />
            <Controller
              control={control}
              name="icon"
              render={({ field: { value, onChange } }) => (
                <AppInput label="Ícone" value={value} onChangeText={onChange} error={errors.icon?.message} />
              )}
            />
            <View style={styles.modalButtons}>
              <AppButton label={saving ? 'Salvando...' : 'Salvar'} onPress={handleSubmit(onSubmit)} />
              <AppButton label="Cancelar" onPress={() => setModalVisible(false)} outlined style={{ marginTop: 12 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '800' },
  description: { color: COLORS.muted, marginBottom: 20 },
  list: { marginTop: 12 },
  categoryRow: { marginBottom: 14, backgroundColor: COLORS.surface, borderRadius: 20, padding: 16 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryName: { color: COLORS.white, marginLeft: 12, fontSize: 16, fontWeight: '700' },
  actionsRow: { flexDirection: 'row' },
  actionButton: { marginRight: 16 },
  actionText: { color: COLORS.primary, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.92)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.card, borderRadius: 24, padding: 24 },
  modalTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  modalButtons: { marginTop: 16 },
});
