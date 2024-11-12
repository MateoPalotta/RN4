import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const JugadorFormModal = ({ visible, onClose, onSubmit, jugador }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    posicion: '',
    numero_casaca: '',
    equipo_id: '',
    foto_url: ''
  });
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    if (visible) {
      cargarEquipos();
      if (jugador) {
        setFormData({
          nombre: jugador.nombre || '',
          apellido: jugador.apellido || '',
          edad: jugador.edad?.toString() || '',
          posicion: jugador.posicion || '',
          numero_casaca: jugador.numero_casaca?.toString() || '',
          equipo_id: jugador.equipo_id?.toString() || '',
          foto_url: jugador.foto_url || ''
        });
      } else {
        setFormData({
          nombre: '',
          apellido: '',
          edad: '',
          posicion: '',
          numero_casaca: '',
          equipo_id: '',
          foto_url: ''
        });
      }
    }
  }, [visible, jugador]);

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
      console.error('Error al cargar equipos:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los datos');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {jugador ? 'Editar Jugador' : 'Nuevo Jugador'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={formData.nombre}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
                placeholder="Nombre del jugador"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                value={formData.apellido}
                onChangeText={(text) => setFormData(prev => ({ ...prev, apellido: text }))}
                placeholder="Apellido del jugador"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Edad</Text>
              <TextInput
                style={styles.input}
                value={formData.edad}
                onChangeText={(text) => setFormData(prev => ({ ...prev, edad: text }))}
                keyboardType="numeric"
                placeholder="Edad del jugador"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Posición</Text>
              <Picker
                selectedValue={formData.posicion}
                onValueChange={(itemValue) =>
                  setFormData(prev => ({ ...prev, posicion: itemValue }))
                }
                style={styles.picker}
              >
                <Picker.Item label="Seleccione una posición" value="" />
                <Picker.Item label="Arquero" value="Arquero" />
                <Picker.Item label="Defensor" value="Defensor" />
                <Picker.Item label="Mediocampista" value="Mediocampista" />
                <Picker.Item label="Delantero" value="Delantero" />
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Equipo</Text>
              <Picker
                selectedValue={formData.equipo_id}
                onValueChange={(itemValue) =>
                  setFormData(prev => ({ ...prev, equipo_id: itemValue }))
                }
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un equipo" value="" />
                {equipos.map(equipo => (
                  <Picker.Item
                    key={equipo.id}
                    label={equipo.nombre}
                    value={equipo.id.toString()}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Número de Casaca</Text>
              <TextInput
                style={styles.input}
                value={formData.numero_casaca}
                onChangeText={(text) => setFormData(prev => ({ ...prev, numero_casaca: text }))}
                keyboardType="numeric"
                placeholder="Número de casaca"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>URL de la Foto</Text>
              <TextInput
                style={styles.input}
                value={formData.foto_url}
                onChangeText={(text) => setFormData(prev => ({ ...prev, foto_url: text }))}
                placeholder="URL de la foto del jugador"
              />
            </View>

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
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    width: '100%',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
    elevation: 5,
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
  },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: '#e74c3c',
  },
  buttonSubmit: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  fotoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JugadorFormModal;