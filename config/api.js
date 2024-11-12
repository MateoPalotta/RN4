import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5432';
  }
  
  return 'http://192.168.1.39:5432';
};

export const API_URL = getApiUrl();

// Para debug
console.log('API URL:', API_URL); 