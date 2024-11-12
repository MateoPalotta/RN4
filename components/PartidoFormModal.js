import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const PartidoFormModal = ({ visible, onClose, onSubmit, partido }) => {
  const [equipos, setEquipos] = useState([]);
  const [formData, setFormData] = useState({
    equipo_local_id: '',
    equipo_visitante_id: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '12:00',
    lugar: '',
    goles_local: '',
    goles_visitante: ''
  });

  useEffect(() => {
    cargarEquipos();
  }, []);

  useEffect(() => {
    if (visible && partido) {
      setFormData({
        equipo_local_id: partido.equipo_local_id.toString(),
        equipo_visitante_id: partido.equipo_visitante_id.toString(),
        fecha: partido.fecha ? new Date(partido.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        hora: partido.hora || '12:00',
        lugar: partido.lugar || '',
        goles_local: partido.goles_local?.toString() || '',
        goles_visitante: partido.goles_visitante?.toString() || ''
      });
    }
  }, [visible, partido]);

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

  const handleDateChange = (value) => {
    setFormData(prev => ({ ...prev, fecha: value }));
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
              {partido ? 'Editar Partido' : 'Nuevo Partido'}
            </Text>

            {/* Equipo Local */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Equipo Local</Text>
              <Picker
                selectedValue={formData.equipo_local_id}
                onValueChange={(itemValue) =>
                  setFormData(prev => ({ ...prev, equipo_local_id: itemValue }))
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

            {/* Equipo Visitante */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Equipo Visitante</Text>
              <Picker
                selectedValue={formData.equipo_visitante_id}
                onValueChange={(itemValue) =>
                  setFormData(prev => ({ ...prev, equipo_visitante_id: itemValue }))
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

            {/* Fecha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha</Text>
              <TextInput
                style={styles.input}
                type="date"
                value={formData.fecha}
                onChange={(e) => handleDateChange(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* Hora */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hora</Text>
              <TextInput
                style={styles.input}
                value={formData.hora}
                onChangeText={(text) => setFormData(prev => ({ ...prev, hora: text }))}
                placeholder="HH:MM"
              />
            </View>

            {/* Lugar */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Lugar</Text>
              <TextInput
                style={styles.input}
                value={formData.lugar}
                onChangeText={(text) => setFormData(prev => ({ ...prev, lugar: text }))}
                placeholder="Ingrese el lugar del partido"
              />
            </View>

            {/* Agregar campos para el resultado */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Goles Local</Text>
              <TextInput
                style={styles.input}
                value={formData.goles_local}
                onChangeText={(text) => setFormData(prev => ({ ...prev, goles_local: text }))}
                keyboardType="numeric"
                placeholder="Goles equipo local"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Goles Visitante</Text>
              <TextInput
                style={styles.input}
                value={formData.goles_visitante}
                onChangeText={(text) => setFormData(prev => ({ ...prev, goles_visitante: text }))}
                keyboardType="numeric"
                placeholder="Goles equipo visitante"
              />
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSubmit]}
                onPress={() => onSubmit(formData)}
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
});

export default PartidoFormModal;