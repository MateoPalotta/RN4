const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();

// Permitir conexiones desde cualquier origen en desarrollo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// O específicamente desde tu app
app.use(cors({
  origin: [
    'http://localhost:8081', // Expo web
    'exp://192.168.1.39:8081', // Tu IP local - actualizar con tu IP
    'http://192.168.1.39:8081', // Tu IP local web - actualizar con tu IP
  ],
  credentials: true
}));

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Importar rutas
const equiposRoutes = require('./routes/equipos');
const jugadoresRoutes = require('./routes/jugadores');
const partidosRoutes = require('./routes/partidos');
const estadisticasRouter = require('./routes/estadisticas');
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/equipos', equiposRoutes);
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/estadisticas', estadisticasRouter);
app.use('/api/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
    res.send('API de Torneo de Fútbol');
});

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});