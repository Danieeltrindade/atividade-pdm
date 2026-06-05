# PDM Finance App

Mobile frontend Expo app para o backend PDM.

## Execução

1. Abra o terminal na pasta `mobile`
2. Rode `npm install`
3. Rode `npx expo start`

## Observações

- Ajuste `src/constants/api.ts` para o endereço do backend se necessário.
- A autenticação usa JWT salvo em AsyncStorage.
- A navegação principal usa `BottomTabNavigator` com Home, Transações, Nova Transação, Resumo e Perfil.
