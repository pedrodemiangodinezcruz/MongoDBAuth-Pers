const Reserva = require('../models/reserva')

exports.create_get = function (req, res) {
    if (!req.user) {
        console.log("Not authenticated");
        res.redirect('/usuarios/login');
        return;
    }

    res.render('reservas/create', {usuario: req.user})
}

exports.create = function (req, res) {
    
}

exports.delete = async function(req, res, next) {
    const {id} = req.params;
    console.log("Deleting reserva", id);
    try {
        await Reserva.findByIdAndDelete(id)
        return res.redirect('/');
    } catch (e) {
        console.error(e);
        return res.status(500).redirect('/');
    }
}

