var express = require('express');
var router = express.Router();
let bicicletaController = require('../controllers/bicicleta')
 
//Listar las bicicletas
router.get('/', bicicletaController.bicicleta_list);

//Añadir nueva bicicleta
router.get('/create', bicicletaController.bicicleta_create_get)
router.post('/create', bicicletaController.bicicleta_create_post)

//Eliminar bici
router.post('/delete/:id', bicicletaController.bicicleta_delete_post)

//Update bici
router.get('/update/:id', bicicletaController.bicicleta_update_get)
router.post('/update/:id', bicicletaController.bicicleta_update_post)


module.exports = router;
