const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', estadisticasController.getAll);
router.post('/', auth, checkRole(['admin']), estadisticasController.create);
router.put('/:id', auth, checkRole(['admin', 'jugador']), estadisticasController.update);
router.delete('/:id', auth, checkRole(['admin']), estadisticasController.eliminar);

module.exports = router;