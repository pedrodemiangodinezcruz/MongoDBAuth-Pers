let express = require('express');
let router = express.Router();
let usuariosController = require('../controllers/usuarios')


router.get('/', usuariosController.list)
router.get('/create', usuariosController.create_get)
router.post('/create', usuariosController.create)
router.get('/login', usuariosController.login_get)
router.post('/login', usuariosController.login)
router.get('/update/:id', usuariosController.update_get)
router.post('/update/:id', usuariosController.update)
router.post('/delete/:id', usuariosController.delete)


module.exports = router;