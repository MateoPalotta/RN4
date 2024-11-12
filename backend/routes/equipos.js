const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equiposController');
const checkRole = require('../middleware/checkRole');

router.get('/', equiposController.getAll);
router.get('/:id', equiposController.getById);
router.post('/', equiposController.create);
router.put('/:id', equiposController.update);
router.delete('/:id', equiposController.delete);

module.exports = router;