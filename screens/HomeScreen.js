import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userRol, setUserRol] = useState('');

  useEffect(() => {
    const getUserRol = async () => {
      const rol = await AsyncStorage.getItem('userRol');
      setUserRol(rol);
    };
    getUserRol();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Equipos')}
      >
        <Text style={styles.buttonText}>Equipos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Jugadores')}
      >
        <Text style={styles.buttonText}>Jugadores</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Partidos')}
      >
        <Text style={styles.buttonText}>Partidos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Estadisticas')}
      >
        <Text style={styles.buttonText}>Estadísticas</Text>
      </TouchableOpacity>

      {/* Botón de administración de usuarios solo visible para admin */}
      {userRol === 'admin' && (
        <TouchableOpacity 
          style={[styles.button, styles.adminButton]} 
          onPress={() => navigation.navigate('AdminUsuarios')}
        >
          <Text style={styles.buttonText}>Administrar Usuarios</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#2c3e50',
    textAlign: 'center',
  },
});

export default HomeScreen;