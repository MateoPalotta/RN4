import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import EstadisticaFormModal from '../components/EstadisticaFormModal';
import { Ionicons } from '@expo/vector-icons';

const EstadisticasScreen = () => {
  const [estadisticas, setEstadisticas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState(null);
  const [userRol, setUserRol] = useState(null);
  const [userId, setUserId] = useState(null);
  const [jugadorId, setJugadorId] = useState(null);

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const rol = await AsyncStorage.getItem('userRol');
        const id = await AsyncStorage.getItem('userId');
        const jugId = await AsyncStorage.getItem('jugadorId');
        
        console.log('Datos cargados:', { rol, id, jugadorId: jugId });
        setUserRol(rol);
        setUserId(id);
        setJugadorId(jugId);
        
        await cargarEstadisticas();
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    inicializarDatos();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/estadisticas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = estadisticaSeleccionada
        ? `${API_URL}/api/estadisticas/${estadisticaSeleccionada.id}`
        : `${API_URL}/api/estadisticas`;
      
      const response = await fetch(url, {
        method: estadisticaSeleccionada ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al guardar estadísticas');
      }

      setModalVisible(false);
      await cargarEstadisticas();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = `${API_URL}/api/estadisticas/${id}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Estadística eliminada correctamente');
        await cargarEstadisticas();
      } else {
        throw new Error('Error al eliminar la estadística');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la estadística');
    }
  };

  const confirmarEliminacion = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro que deseas eliminar esta estadística?')) {
        handleDelete(id);
      }
    } else {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro que deseas eliminar esta estadística?',
        [
          {
            text: 'No',
            style: 'cancel'
          },
          {
            text: 'Sí',
            style: 'destructive',
            onPress: () => handleDelete(id)
          }
        ],
        { cancelable: false }
      );
    }
  };

  const renderEstadistica = (estadistica) => {
    const userJugadorId = jugadorId ? parseInt(jugadorId) : null;
    const estadisticaJugadorId = estadistica.jugador_id ? parseInt(estadistica.jugador_id) : null;
    
    const canEdit = 
        userRol === 'admin' || 
        (userRol === 'jugador' && userJugadorId === estadisticaJugadorId);

    return (
        <View key={estadistica.id} style={styles.card}>
            <View style={styles.jugadorInfo}>
                {estadistica.foto_url ? (
                    <Image 
                        source={{ uri: estadistica.foto_url }} 
                        style={styles.jugadorFoto} 
                    />
                ) : (
                    <View style={[styles.jugadorFoto, styles.jugadorFotoPlaceholder]}>
                        <Text>Sin foto</Text>
                    </View>
                )}
                <View style={styles.infoContainer}>
                    <Text style={styles.nombre}>
                        {`${estadistica.nombre} ${estadistica.apellido}`}
                    </Text>
                    <Text style={styles.equipo}>{estadistica.equipo_nombre}</Text>
                </View>
            </View>
            
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Goles</Text>
                    <Text style={styles.statValue}>{estadistica.goles}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Asistencias</Text>
                    <Text style={styles.statValue}>{estadistica.asistencias}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Tarjetas Amarillas</Text>
                    <Text style={styles.statValue}>{estadistica.tarjetas_amarillas}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Tarjetas Rojas</Text>
                    <Text style={styles.statValue}>{estadistica.tarjetas_rojas}</Text>
                </View>
            </View>

            {canEdit && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => {
                            setEstadisticaSeleccionada(estadistica);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>

                    {userRol === 'admin' && (
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => confirmarEliminacion(estadistica.id)}
                        >
                            <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {!canEdit && userRol === 'jugador' && (
                <Text style={styles.noEditText}>
                    Solo puedes editar tus propias estadísticas
                </Text>
            )}
        </View>
    );
  };

  return (
    <View style={styles.container}>
      {userRol === 'admin' && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setEstadisticaSeleccionada(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>
            + Agregar Estadística
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView>
        {estadisticas.map(renderEstadistica)}
      </ScrollView>

      <EstadisticaFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        estadistica={estadisticaSeleccionada}
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
  addButton: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  jugadorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  equipo: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 70,
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noEditText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  }
});

export default EstadisticasScreen;