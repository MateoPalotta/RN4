import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Picker
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const UsuarioFormModal = ({ visible, onClose, onSubmit, usuario }) => {
  const [email, setEmail] = useState(usuario ? usuario.email : '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(usuario ? usuario.rol : 'usuario');
  const [jugadorId, setJugadorId] = useState(usuario ? usuario.jugador_id : '');
  const [jugadores, setJugadores] = useState([]); // Lista de jugadores disponibles

  // Cargar jugadores cuando el modal se abre
  useEffect(() => {
    if (visible) {
      cargarJugadores();
    }
  }, [visible]);

  const cargarJugadores = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/jugadores`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setJugadores(data);
    } catch (error) {
      console.error('Error al cargar jugadores:', error);
      Alert.alert('Error', 'No se pudieron cargar los jugadores');
    }
  };

  const handleSubmit = () => {
    const userData = {
      email,
      password,
      rol,
      jugador_id: rol === 'jugador' ? jugadorId : null
    };
    onSubmit(userData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          {!usuario && (
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          )}

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rol}
              onValueChange={(itemValue) => setRol(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Usuario" value="usuario" />
              <Picker.Item label="Jugador" value="jugador" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>

          {rol === 'jugador' && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={jugadorId}
                onValueChange={(itemValue) => setJugadorId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccionar Jugador" value="" />
                {jugadores.map(jugador => (
                  <Picker.Item 
                    key={jugador.id}
                    label={`${jugador.nombre} ${jugador.apellido}`}
                    value={jugador.id}
                  />
                ))}
              </Picker>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {usuario ? 'Actualizar' : 'Crear'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#95a5a6',
  },
  buttonSubmit: {
    backgroundColor: '#2c3e50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default UsuarioFormModal; 