import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EquipoFormModal from '../components/EquipoFormModal';
import { API_URL } from '../config/api';

const EquiposScreen = () => {
  const [equipos, setEquipos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [userRol, setUserRol] = useState('');

  useEffect(() => {
    cargarEquipos();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      const rol = await AsyncStorage.getItem('userRol');
      setUserRol(rol);
    };
    getUserInfo();
  }, []);

  const canEdit = () => {
    return userRol === 'admin';
  };

  const cargarEquipos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/equipos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEquipos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los equipos');
    }
  };

  const handleCrearEquipo = async (nuevoEquipo) => {
    try {
      setEquipos(equiposActuales => [...equiposActuales, nuevoEquipo]);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Error al crear el equipo');
    }
  };

  const handleEditarEquipo = async (equipoActualizado) => {
    try {
      setEquipos(equiposActuales => 
        equiposActuales.map(equipo => 
          equipo.id === equipoActualizado.id ? equipoActualizado : equipo
        )
      );
      setModalVisible(false);
      setEquipoSeleccionado(null);
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el equipo');
    }
  };

  const handleEliminarEquipo = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/equipos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        setEquipos(equiposActuales => 
          equiposActuales.filter(equipo => equipo.id !== id)
        );
        Alert.alert('Éxito', 'Equipo eliminado correctamente');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'No se pudo eliminar el equipo');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al eliminar el equipo');
    }
  };

  const renderEquipo = ({ item }) => (
    <View style={styles.equipoCard}>
      <TouchableOpacity 
        style={styles.equipoInfo}
        onPress={() => {
          setEquipoSeleccionado(item);
          setModalVisible(true);
        }}
      >
        {item.escudo_url && (
          <Image
            source={{ uri: item.escudo_url }}
            style={styles.escudo}
          />
        )}
        <Text style={styles.equipoNombre}>{item.nombre}</Text>
      </TouchableOpacity>
      
      {canEdit() && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditarEquipo(item)}
          >
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleEliminarEquipo(item.id)}
          >
            <Text style={styles.buttonTextEliminar}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {userRol === 'admin' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setEquipoSeleccionado(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>+ Agregar Equipo</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={equipos}
        renderItem={renderEquipo}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {canEdit() && (
        <EquipoFormModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEquipoSeleccionado(null);
          }}
          onSubmit={equipoSeleccionado ? handleEditarEquipo : handleCrearEquipo}
          equipo={equipoSeleccionado}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  equipoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  equipoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  escudo: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 25,
  },
  equipoNombre: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c3e50',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonTextEliminar: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EquiposScreen;