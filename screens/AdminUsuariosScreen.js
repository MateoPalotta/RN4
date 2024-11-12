import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UsuarioFormModal from '../components/UsuarioFormModal';
import { commonStyles } from '../styles/commonStyles';
import { API_URL } from '../config/api';

const AdminUsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    }
  };

  const handleEliminar = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Usuario eliminado correctamente');
        cargarUsuarios();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  const handleSubmit = async (usuario) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/usuarios/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Usuario guardado correctamente');
        setModalVisible(false);
        cargarUsuarios();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', 'No se pudo guardar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setUsuarioSeleccionado(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Agregar Usuario</Text>
      </TouchableOpacity>

      <FlatList
        data={usuarios}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.usuarioCard}>
            <View style={styles.usuarioInfo}>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.rol}>Rol: {item.rol}</Text>
              {item.jugador_nombre && (
                <Text style={styles.jugador}>
                  Jugador: {item.jugador_nombre} {item.jugador_apellido}
                </Text>
              )}
            </View>

            <View style={commonStyles.actionButtons}>
              <TouchableOpacity 
                style={commonStyles.editButton}
                onPress={() => {
                  setUsuarioSeleccionado(item);
                  setModalVisible(true);
                }}
              >
                <Text style={commonStyles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={commonStyles.deleteButton}
                onPress={() => handleEliminar(item.id)}
              >
                <Text style={commonStyles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <UsuarioFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        usuario={usuarioSeleccionado}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f6fa'
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usuarioCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  usuarioInfo: {
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  rol: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  jugador: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
});

export default AdminUsuariosScreen; 