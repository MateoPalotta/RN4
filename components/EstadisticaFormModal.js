import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const EstadisticaFormModal = ({ visible, onClose, onSubmit, estadistica }) => {
  const [formData, setFormData] = useState({
    jugador_id: '',
    goles: '',
    asistencias: '',
    tarjetas_amarillas: '',
    tarjetas_rojas: ''
  });
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    if (visible) {
      cargarJugadores();
      if (estadistica) {
        setFormData({
          jugador_id: estadistica.jugador_id?.toString() || '',
          goles: estadistica.goles?.toString() || '',
          asistencias: estadistica.asistencias?.toString() || '',
          tarjetas_amarillas: estadistica.tarjetas_amarillas?.toString() || '',
          tarjetas_rojas: estadistica.tarjetas_rojas?.toString() || ''
        });
      } else {
        setFormData({
          jugador_id: '',
          goles: '',
          asistencias: '',
          tarjetas_amarillas: '',
          tarjetas_rojas: ''
        });
      }
    }
  }, [visible, estadistica]);

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
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {estadistica ? 'Editar Estadísticas' : 'Nuevas Estadísticas'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Jugador</Text>
            <Picker
              selectedValue={formData.jugador_id}
              onValueChange={(itemValue) =>
                setFormData(prev => ({ ...prev, jugador_id: itemValue }))
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un jugador" value="" />
              {jugadores.map(jugador => (
                <Picker.Item
                  key={jugador.id}
                  label={`${jugador.nombre} ${jugador.apellido}`}
                  value={jugador.id.toString()}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Goles</Text>
            <TextInput
              style={styles.input}
              value={formData.goles}
              onChangeText={(text) => setFormData(prev => ({ ...prev, goles: text }))}
              keyboardType="numeric"
              placeholder="Número de goles"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Asistencias</Text>
            <TextInput
              style={styles.input}
              value={formData.asistencias}
              onChangeText={(text) => setFormData(prev => ({ ...prev, asistencias: text }))}
              keyboardType="numeric"
              placeholder="Número de asistencias"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tarjetas Amarillas</Text>
            <TextInput
              style={styles.input}
              value={formData.tarjetas_amarillas}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tarjetas_amarillas: text }))}
              keyboardType="numeric"
              placeholder="Número de tarjetas amarillas"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tarjetas Rojas</Text>
            <TextInput
              style={styles.input}
              value={formData.tarjetas_rojas}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tarjetas_rojas: text }))}
              keyboardType="numeric"
              placeholder="Número de tarjetas rojas"
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
              onPress={() => onSubmit(formData)}
            >
              <Text style={styles.buttonText}>Guardar</Text>
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
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
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

export default EstadisticaFormModal;