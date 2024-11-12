import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

const EditarPartidoScreen = ({ route, navigation }) => {
  const { partido } = route.params;
  const [golesLocal, setGolesLocal] = useState(partido.goles_local?.toString() || '');
  const [golesVisitante, setGolesVisitante] = useState(partido.goles_visitante?.toString() || '');

  const handleGuardar = async () => {
    try {
      const response = await fetch(`http://localhost:5432/api/partidos/${partido.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goles_local: parseInt(golesLocal) || 0,
          goles_visitante: parseInt(golesVisitante) || 0,
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Resultado actualizado correctamente');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el resultado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Resultado</Text>

      <View style={styles.resultadoContainer}>
        <View style={styles.equipoContainer}>
          <Text style={styles.equipoNombre}>{partido.equipo_local}</Text>
          <TextInput
            style={styles.input}
            value={golesLocal}
            onChangeText={setGolesLocal}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.equipoContainer}>
          <Text style={styles.equipoNombre}>{partido.equipo_visitante}</Text>
          <TextInput
            style={styles.input}
            value={golesVisitante}
            onChangeText={setGolesVisitante}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.guardarButton} onPress={handleGuardar}>
        <Text style={styles.guardarButtonText}>Guardar Resultado</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    ...FONTS.title,
    color: COLORS.text.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  resultadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  equipoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  equipoNombre: {
    ...FONTS.body,
    color: COLORS.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
    borderRadius: 8,
    padding: 10,
    width: 60,
    textAlign: 'center',
    fontSize: 24,
  },
  vs: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    marginHorizontal: 20,
  },
  guardarButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  guardarButtonText: {
    color: COLORS.white,
    ...FONTS.subtitle,
  },
});

export default EditarPartidoScreen; 