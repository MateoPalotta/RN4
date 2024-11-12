import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EquiposScreen from '../screens/EquiposScreen';
import JugadoresScreen from '../screens/JugadoresScreen';
import PartidosScreen from '../screens/PartidosScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import AdminUsuariosScreen from '../screens/AdminUsuariosScreen';
import { API_URL } from '@/config/api';

const Stack = createStackNavigator();

const HomeHeader = ({ navigation }: { navigation: any }) => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (role) {
          const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
          setUserRole(formattedRole);
        }
      } catch (error) {
        console.error('Error al obtener el rol:', error);
      }
    };
    getUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('isLoggedIn');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Torneo de Fútbol</Text>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRol, setUserRol] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const rol = await AsyncStorage.getItem('userRol');
        // Verificar si el token es válido haciendo una petición al backend
        if (token) {
          const response = await fetch(`${API_URL}/api/usuarios/verify-token`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setIsLoggedIn(true);
            setUserRol(rol || '');
          } else {
            // Si el token no es válido, limpiar el almacenamiento
            await AsyncStorage.multiRemove(['token', 'userRol', 'isLoggedIn']);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Error al verificar el estado de la sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'Home' : 'Login'}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2c3e50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              header: (props) => <HomeHeader {...props} />,
              headerLeft: () => null 
            }}
          />
          <Stack.Screen 
            name="Equipos" 
            component={EquiposScreen} 
            options={{ title: 'Equipos' }}
          />
          <Stack.Screen 
            name="Jugadores" 
            component={JugadoresScreen} 
            options={{ title: 'Jugadores' }}
          />
          <Stack.Screen 
            name="Partidos" 
            component={PartidosScreen} 
            options={{ title: 'Partidos' }}
          />
          <Stack.Screen 
            name="Estadisticas" 
            component={EstadisticasScreen} 
            options={{ title: 'Estadísticas' }}
          />
          {userRol === 'admin' && (
            <Stack.Screen 
              name="AdminUsuarios" 
              component={AdminUsuariosScreen}
              options={{ title: 'Administrar Usuarios' }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    overflow: 'scroll'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c3e50',
    height: 60,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 15,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  }
});