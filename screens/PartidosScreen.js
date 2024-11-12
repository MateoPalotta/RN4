import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PartidoFormModal from '../components/PartidoFormModal';
import { API_URL } from '../config/api';

const PartidosScreen = () => {
  const [partidos, setPartidos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    cargarPartidos();
    cargarRolUsuario();
  }, []);

  const cargarRolUsuario = async () => {
    try {
      const rol = await AsyncStorage.getItem('userRol');
      setUserRol(rol);
    } catch (error) {
      console.error('Error al cargar rol del usuario:', error);
    }
  };

  const cargarPartidos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/partidos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPartidos(data);
    } catch (error) {
      console.error('Error al cargar partidos:', error);
      Alert.alert('Error', 'No se pudieron cargar los partidos');
      setPartidos([]);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = partidoSeleccionado
        ? `http://localhost:5432/api/partidos/${partidoSeleccionado.id}`
        : 'http://localhost:5432/api/partidos';
      
      const response = await fetch(url, {
        method: partidoSeleccionado ? 'PUT' : 'POST',
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
      cargarPartidos();
      Alert.alert('Éxito', partidoSeleccionado ? 'Partido actualizado' : 'Partido creado');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo guardar el partido');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://localhost:5432/api/partidos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        cargarPartidos(); // Recargar la lista después de eliminar
        Alert.alert('Éxito', 'Partido eliminado correctamente');
      } else {
        Alert.alert('Error', 'No se pudo eliminar el partido');
      }
    } catch (error) {
      console.error('Error al eliminar partido:', error);
      Alert.alert('Error', 'No se pudo eliminar el partido');
    }
  };

  return (
    <View style={styles.container}>
      {userRol === 'admin' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setPartidoSeleccionado(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>+ Agregar Partido</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scrollView}>
        {partidos.map(partido => (
          <View key={partido.id} style={styles.partidoCard}>
            <View style={styles.partidoInfo}>
              <View style={styles.equiposContainer}>
                <View style={styles.equipoInfo}>
                  <Image 
                    source={{ uri: partido.escudo_local }} 
                    style={styles.escudo}
                  />
                  <Text style={styles.equipoNombre}>{partido.equipo_local}</Text>
                </View>

                <View style={styles.resultadoContainer}>
                  <Text style={styles.golesNumero}>
                    {partido.goles_local !== null ? partido.goles_local : '-'}
                  </Text>
                  <Text style={styles.vs}> vs </Text>
                  <Text style={styles.golesNumero}>
                    {partido.goles_visitante !== null ? partido.goles_visitante : '-'}
                  </Text>
                </View>

                <View style={[styles.equipoInfo, styles.equipoVisitante]}>
                  <Text style={styles.equipoNombre}>{partido.equipo_visitante}</Text>
                  <Image 
                    source={{ uri: partido.escudo_visitante }} 
                    style={styles.escudo}
                  />
                </View>
              </View>

              <View style={styles.detallesContainer}>
                <Text style={styles.detalles}>
                  Fecha: {new Date(partido.fecha).toLocaleDateString()}
                </Text>
                <Text style={styles.detalles}>
                  Hora: {partido.hora || 'No especificada'}
                </Text>
                <Text style={styles.detalles}>
                  Lugar: {partido.lugar || 'Por definir'}
                </Text>
              </View>
            </View>

            {userRol === 'admin' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => {
                    setPartidoSeleccionado(partido);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDelete(partido.id)}
                >
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <PartidoFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        partido={partidoSeleccionado}
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
  scrollView: {
    flex: 1,
  },
  partidoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  partidoInfo: {
    width: '100%',
  },
  equiposContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  equipoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  equipoVisitante: {
    justifyContent: 'flex-end',
  },
  escudo: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  equipoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  vs: {
    fontSize: 14,
    color: '#7f8c8d',
    marginHorizontal: 8,
  },
  golesNumero: {
    fontSize: 20,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  detallesContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detalles: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
    textAlign: 'center',
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
  noPartidos: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  resultado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
});

export default PartidosScreen;