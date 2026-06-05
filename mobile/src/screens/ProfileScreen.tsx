import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>
      <View style={{ marginTop: 24 }}>
        <AppButton label="Sair da conta" onPress={logout} style={{ backgroundColor: COLORS.danger }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginBottom: 24 },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 20, marginBottom: 14 },
  label: { color: COLORS.muted, fontSize: 14, marginBottom: 6 },
  value: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});
