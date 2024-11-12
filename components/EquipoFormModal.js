import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const EquipoFormModal = ({ visible, onClose, onSubmit, equipo }) => {
  const [nombre, setNombre] = useState(equipo ? equipo.nombre : '');
  const [escudoUrl, setEscudoUrl] = useState(equipo ? equipo.escudo_url : '');

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = equipo 
        ? `${API_URL}/api/equipos/${equipo.id}`
        : `${API_URL}/api/equipos`;
      
      const response = await fetch(url, {
        method: equipo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, escudo_url: escudoUrl })
      });

      if (response.ok) {
        const data = await response.json();
        onSubmit({ 
          id: equipo ? equipo.id : data.id,
          nombre, 
          escudo_url: escudoUrl 
        });
        setNombre('');
        setEscudoUrl('');
      } else {
        Alert.alert('Error', 'No se pudo guardar el equipo');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el formulario');
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
            {equipo ? 'Editar Equipo' : 'Nuevo Equipo'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre del equipo"
            value={nombre}
            onChangeText={setNombre}
          />
          
          <TextInput
            style={styles.input}
            placeholder="URL del escudo"
            value={escudoUrl}
            onChangeText={setEscudoUrl}
          />

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
                {equipo ? 'Actualizar' : 'Crear'}
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
  },
});

export default EquipoFormModal;