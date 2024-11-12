import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator } from 'react-native';

export default function TabLayout() {
  const [userRol, setUserRol] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRol() {
      try {
        const rol = await AsyncStorage.getItem('userRol');
        console.log('TabLayout - Rol cargado:', rol);
        setUserRol(rol);
      } catch (error) {
        console.error('Error cargando rol:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRol();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  console.log('TabLayout - Renderizando con rol:', userRol);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2c3e50',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="jugadores"
        options={{
          title: 'Jugadores',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="equipos"
        options={{
          title: 'Equipos',
          tabBarIcon: ({ color }) => <Ionicons name="football" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="partidos"
        options={{
          title: 'Partidos',
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />

      {userRol === 'admin' ? (
        <Tabs.Screen
          name="AdminUsuariosScreen"
          options={{
            title: 'Usuarios',
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          }}
        />
      ) : null}
    </Tabs>
  );
} 