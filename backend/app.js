const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
const jugadoresDir = path.join(uploadsDir, 'jugadores');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(jugadoresDir)) {
    fs.mkdirSync(jugadoresDir);
}

// Configurar express para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ... rutas existentes ...

// Ruta para subir foto de jugador
router.post('/:id/foto', 
  auth, 
  upload.single('foto'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const fotoUrl = `/uploads/jugadores/${req.file.filename}`;
      
      await pool.query(
        'UPDATE jugadores SET foto_url = ? WHERE id = ?',
        [fotoUrl, id]
      );
      
      res.json({ foto_url: fotoUrl });
    } catch (error) {
      console.error('Error al subir foto:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

const estadisticasRouter = require('./routes/estadisticas');
app.use('/api/estadisticas', estadisticasRouter);