import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JugadorFormModal from '../components/JugadorFormModal';
import { API_URL } from '../config/api';

const JugadoresScreen = () => {
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    cargarJugadores();
    cargarEquipos();
    cargarRolUsuario();
  }, []);

  const cargarEquipos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://localhost:5432/api/equipos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar equipos');
      const data = await response.json();
      setEquipos(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
    }
  };

  const cargarRolUsuario = async () => {
    try {
      const rol = await AsyncStorage.getItem('userRol');
      setUserRol(rol);
    } catch (error) {
      console.error('Error al cargar rol del usuario:', error);
    }
  };

  const cargarJugadores = async () => {
    try {
      console.log('Intentando cargar jugadores desde:', `${API_URL}/api/jugadores`);
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/jugadores`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setJugadores(data);
    } catch (error) {
      console.error('Error detallado al cargar jugadores:', {
        message: error.message,
        stack: error.stack,
        url: `${API_URL}/api/jugadores`
      });
      Alert.alert('Error', 'No se pudieron cargar los jugadores');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = jugadorSeleccionado
        ? `${API_URL}/api/jugadores/${jugadorSeleccionado.id}`
        : `${API_URL}/api/jugadores`;
      
      const response = await fetch(url, {
        method: jugadorSeleccionado ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error en la operación');
      }

      setModalVisible(false);
      cargarJugadores();
      Alert.alert('Éxito', jugadorSeleccionado ? 'Jugador actualizado' : 'Jugador creado');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo guardar el jugador');
    }
  };

  const handleEliminar = async (id) => {
    try {
      console.log('Iniciando eliminación del jugador:', id);
      const token = await AsyncStorage.getItem('token');
      console.log('Token obtenido:', token ? 'Sí' : 'No');

      const url = `${API_URL}/api/jugadores/${id}`;
      console.log('URL de eliminación:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Código de respuesta:', response.status);
      const responseText = await response.text();
      console.log('Respuesta completa:', responseText);

      if (response.ok) {
        Alert.alert('Éxito', 'Jugador eliminado correctamente');
        await cargarJugadores();
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message;
        } catch (e) {
          errorMessage = responseText;
        }
        console.error('Error al eliminar:', errorMessage);
        Alert.alert('Error', errorMessage || 'No se pudo eliminar el jugador');
      }
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', 'No se pudo eliminar el jugador');
    }
  };

  const confirmarEliminar = (id) => {
    console.log('Rol actual:', userRol);
    console.log('ID del jugador a eliminar:', id);
    
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro que deseas eliminar este jugador?')) {
        console.log('Confirmación aceptada');
        handleEliminar(id);
      }
    } else {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro que deseas eliminar este jugador?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => console.log('Cancelado')
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              console.log('Confirmación aceptada');
              handleEliminar(id);
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  const jugadoresFiltrados = jugadores.filter(jugador => 
    equipoSeleccionado ? jugador.equipo_id.toString() === equipoSeleccionado : true
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por equipo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={equipoSeleccionado}
            onValueChange={(itemValue) => setEquipoSeleccionado(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Todos los equipos" value="" />
            {equipos.map(equipo => (
              <Picker.Item 
                key={equipo.id} 
                label={equipo.nombre} 
                value={equipo.id.toString()} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {userRol === 'admin' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setJugadorSeleccionado(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>+ Agregar Jugador</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scrollView}>
        {jugadoresFiltrados.map(jugador => (
          <View key={jugador.id} style={styles.jugadorCard}>
            <View style={styles.jugadorHeader}>
              {jugador.foto_url ? (
                <Image 
                  source={{ uri: jugador.foto_url }} 
                  style={styles.jugadorFoto} 
                />
              ) : (
                <View style={[styles.jugadorFoto, styles.jugadorFotoPlaceholder]}>
                  <Text>Sin foto</Text>
                </View>
              )}
              <View style={styles.jugadorInfo}>
                <Text style={styles.nombre}>
                  {`${jugador.nombre} ${jugador.apellido}`}
                </Text>
                <View style={styles.detallesContainer}>
                  <Text style={styles.detalles}>Edad: {jugador.edad} años</Text>
                  <Text style={styles.detalles}>Posición: {jugador.posicion}</Text>
                  <Text style={styles.detalles}>Número: {jugador.numero_casaca}</Text>
                  <Text style={styles.detalles}>Equipo: {jugador.equipo_nombre || 'Sin equipo'}</Text>
                </View>
              </View>
            </View>

            {userRol === 'admin' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => {
                    setJugadorSeleccionado(jugador);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => {
                    console.log('Botón eliminar presionado para jugador:', jugador.id);
                    confirmarEliminar(jugador.id);
                  }}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <JugadorFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        jugador={jugadorSeleccionado}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  jugadorCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  jugadorInfo: {
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  detallesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  detalles: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  jugadorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jugadorFoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  jugadorFotoPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JugadoresScreen;