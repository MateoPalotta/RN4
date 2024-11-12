const express = require('express');
const router = express.Router();
const jugadoresController = require('../controllers/jugadoresController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/jugadores/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'jugador-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', jugadoresController.getAll);

router.post('/', auth, checkRole(['admin']), jugadoresController.create);
router.put('/:id', auth, checkRole(['admin']), jugadoresController.update);
router.delete('/:id', 
  (req, res, next) => {
    console.log('Recibida solicitud DELETE para jugador:', req.params.id);
    next();
  },
  auth, 
  (req, res, next) => {
    console.log('Usuario autenticado:', req.user);
    next();
  },
  checkRole(['admin']),
  (req, res, next) => {
    console.log('Rol verificado, procediendo a eliminar');
    next();
  },
  jugadoresController.remove
);

router.post('/:id/foto', 
  auth, 
  upload.single('foto'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const fotoUrl = `/uploads/jugadores/${req.file.filename}`;
      
      const [result] = await pool.query(
        'UPDATE jugadores SET foto_url = ? WHERE id = ?',
        [fotoUrl, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Jugador no encontrado' });
      }
      
      res.json({ 
        foto_url: fotoUrl,
        message: 'Foto actualizada exitosamente' 
      });
    } catch (error) {
      console.error('Error al subir foto:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get('/perfil/:userId', auth, jugadoresController.getPerfil);

module.exports = router;