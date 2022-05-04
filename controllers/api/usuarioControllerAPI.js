let Usuario = require('../../models/usuario')
let Reserva = require('../../models/reserva')

exports.usuarios_list = function(req, res){
    Usuario.find({}, function(err, usuarios){
        res.status(200).json({
            usuarios: usuarios
        })
    })
}

exports.usuarios_create = function(req, res){
    let usuario = new Usuario({nombre: req.body.nombre})

    usuario.save(function(err){
        res.status(200).json(usuario)
    })

}


