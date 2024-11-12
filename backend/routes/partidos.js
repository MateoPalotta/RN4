const express = require('express');
const router = express.Router();
const partidosController = require('../controllers/partidosController');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/', partidosController.getPartidos);

// Rutas protegidas (requieren autenticación)
router.post('/', auth, partidosController.createPartido);
router.put('/:id', auth, partidosController.updatePartido);
router.delete('/:id', auth, partidosController.deletePartido);

module.exports = router;