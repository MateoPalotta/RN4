import PerfilScreen from '../screens/PerfilScreen';

// En tu Tab.Navigator
<Tab.Screen 
  name="Perfil" 
  component={PerfilScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Icon name="person" size={size} color={color} />
    ),
  }}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      // Verificar si el usuario tiene rol de jugador
      if (user?.rol !== 'jugador') {
        e.preventDefault();
        // Opcional: mostrar mensaje de error
        Alert.alert('Acceso denegado', 'Solo los jugadores pueden acceder al perfil');
      }
    },
  })}
/> 