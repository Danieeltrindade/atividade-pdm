import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from '../constants/api';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function removeToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function getToken() {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  return token ?? undefined;
}
