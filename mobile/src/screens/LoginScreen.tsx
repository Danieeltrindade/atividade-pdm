import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const loginSchema = z.object({
  email: z.string().email('Digite um email válido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setLoading(true);
      await login(values);
    } catch (error) {
      Alert.alert('Erro de login', 'Não foi possível autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>PDM Finance</Text>
        <Text style={styles.subtitle}>Sua gestão financeira com um design premium e foco em resultados.</Text>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <AppInput
                label="Email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <AppInput
                label="Senha"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />
          <AppButton label={loading ? 'Carregando...' : 'Entrar'} onPress={handleSubmit(onSubmit)} />
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Ajuda', 'Insira suas credenciais para acessar o app.')}> 
          <Text style={styles.helpText}>Precisa de ajuda para entrar?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: COLORS.card,
    borderRadius: 32,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  logo: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
  },
  form: {
    marginBottom: 16,
  },
  helpText: {
    color: COLORS.primary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
});
