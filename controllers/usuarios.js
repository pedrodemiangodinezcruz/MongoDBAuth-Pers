const moment = require('moment')


let Usuario = require('../models/usuario')
let Reserva = require('../models/reserva')

module.exports = {

    list: function(req, res, next){
        Usuario.find({}, (err, usuarios) => {
            res.render('usuarios/index', {usuarios: usuarios})
        })
    },

    update_get: function(req, res, next){
        Usuario.findById(req.params.id, function(err, usuario){
            res.render('usuarios/update', {errors:{}, usuario: usuario})
        })
    },

    update: function(req, res, next){
        let update_values = {nombre: req.body.nombre}
        Usuario.findByIdAndUpdate(req.params.id, update_values, function(err, usuario){
            if(err) {
                console.log(err)
                res.render('usuario/update', {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email })})
            }
            else{
                res.redirect('/usuarios')
                return
            }
        })
    },

    create_get: function(req, res){
        res.render('usuarios/create', { errors:{}, usuario: new Usuario() } )
    },

    login_get: function(req, res){
        if (req.user) {
            res.redirect('/');
        }
        const message = req.flash('message');
        res.render('usuarios/login', { message } )
    },

    create: function(req, res, next){
        if(req.body.password != req.body.confirm_password){
            res.render('usuarios/create', {errors: {confirm_password: {message: 'No coinciden los passwords '}},  usuario: new Usuario({nombre: req.body.nombre, email: req.body.email }) })
            return
        }
        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password }, function(err, nuevoUsuario) {
            if(err){
                res.render('usuarios/create', {errors: {email: {message: 'Ya existe un usuario con ese password'}}, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email })})
            }
            else{
                nuevoUsuario.enviar_mail_bienvenida()
                res.redirect('/usuarios')
            }
        })
    },


    delete: function(req, res, next){
        Usuario.findByIdAndDelete(req.body.id, function(err){
            if(err)
                next(err)
            else
                res.redirect('/usuarios')
        })
    },

    login: function(req, res, next) {
        console.log("login", req.body);

        res.render('usuarios/login', {errors:{
            general: 'Credenciales incorrectas',
        }})
    },

    fetchReservas: function(req, res, next) {
        // Retrieve reservas
        const {id} = req.user;
        Reserva.find({usuario: id})
        .populate('bicicleta')
        .then(reservas => {
            moment.locale('es-mx');
            res.locals.reservas = reservas.map(reserva => {
                return {
                    ...reserva._doc,
                    desde: moment(reserva.desde).format('LL'),
                    hasta: moment(reserva.hasta).format('LL'),
                    duracion: reserva.diasDeReserva()
                }
            });  // should be available in template

            next();
        })
        .catch(err => {
            next(err)
        })
    },

    reservar: function(req, res){
        Usuario.findById(req.body.id, async function(err, usuario){
            if (err) {
                res.status(404).redirect('/usuarios/login');
            }
            console.log(usuario)
            try {
                await usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta);
                console.log("Reserva existosa")
                res.status(200).redirect('/');
            } catch (e) {
                console.error("Error creating reservation", e);
                res.status(500).redirect('/reservas/create');
            }
        })
    }
}

