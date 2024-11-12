import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EquiposScreen from '../screens/EquiposScreen';
import JugadoresScreen from '../screens/JugadoresScreen';
import PartidosScreen from '../screens/PartidosScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import AdminUsuariosScreen from '../screens/AdminUsuariosScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const cargarRolUsuario = async () => {
      try {
        const rol = await AsyncStorage.getItem('userRol');
        setUserRol(rol);
      } catch (error) {
        console.error('Error al cargar rol:', error);
      }
    };
    
    cargarRolUsuario();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Equipos') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Jugadores') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Partidos') {
            iconName = focused ? 'football' : 'football-outline';
          } else if (route.name === 'Estadisticas') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'AdminUsuarios') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Equipos" component={EquiposScreen} />
      <Tab.Screen name="Jugadores" component={JugadoresScreen} />
      <Tab.Screen name="Partidos" component={PartidosScreen} />
      <Tab.Screen name="Estadisticas" component={EstadisticasScreen} />
      {userRol === 'admin' && (
        <Tab.Screen 
          name="AdminUsuarios" 
          component={AdminUsuariosScreen}
          options={{
            title: 'Administrar Usuarios'
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AdminUsuarios" 
        component={AdminUsuariosScreen}
        options={{
          title: 'Administrar Usuarios',
          headerStyle: {
            backgroundColor: '#2ecc71',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;