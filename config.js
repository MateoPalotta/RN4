import { Platform } from 'react-native';

const DEV_API_URL = Platform.select({
  web: 'http://localhost:5432',
  default: 'http://192.168.1.39:5432' // Reemplaza X.X con tu IP local
});

export const API_URL = DEV_API_URL;