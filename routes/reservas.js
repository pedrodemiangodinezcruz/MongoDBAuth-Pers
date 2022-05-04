let express = require('express');
let router = express.Router();
let usuariosController = require('../controllers/usuarios')
let bicicletas = require('../controllers/bicicleta')
let reservasController = require('../controllers/reservas')

router.post('/create', usuariosController.reservar);
router.get('/create', bicicletas.fetchBicicletas, reservasController.create_get)
router.post('/delete/:id', reservasController.delete)

module.exports = router;