const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Ruta temporal para crear el primer admin
router.post('/register-admin', usuariosController.register);

// Ruta pública para login
router.post('/login', usuariosController.login);

// Ruta para registro de usuarios (protegida, solo admin)
router.post('/register', auth, checkRole(['admin']), usuariosController.register);

// Ruta para obtener todos los usuarios (solo admin)
router.get('/', auth, checkRole(['admin']), usuariosController.getAll);

// Ruta para eliminar usuarios (solo admin)
router.delete('/:id', auth, checkRole(['admin']), usuariosController.delete);

// Agregar nueva ruta para verificar token
router.get('/verify-token', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;