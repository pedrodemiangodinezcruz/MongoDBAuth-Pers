var express = require('express');
const passport = require('../passport/setup');
var router = express.Router();

/* 

/auth prefix

passport must have been setup 
*/

router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/usuarios/login'
}))

router.get('/login', (req, res, next)=> {
    if (req.user) {
        res.redirect('/');
    }
    res.render('usuarios/login')
});

router.post('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

router.get('/register', (req, res, next) => {
    res.render('usuarios/create')
})


// possibly not used
router.post('/register', (req, res, next) => {
    if(req.body.password != req.body.confirm_password){
        res.render('usuarios/create', {errors: {confirm_password: {message: 'No coinciden los passwords '}},  usuario: new Usuario({nombre: req.body.nombre, email: req.body.email }) })
        return
    }

    // Mongoose hashes pwd for us
    Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password }, function(err, nuevoUsuario) {
        if(err){
            res.render('usuarios/create', {errors: {email: {message: 'Ya existe un usuario con ese password'}}, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email })})
        }
        else{
            nuevoUsuario.enviar_mail_bienvenida()
            res.redirect('/usuarios')
        }
    })
})

router.post("/register_login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(401).send({ errors: err })
        }

        if (!user) {
            return res.status(400).send({ errors: "No user found" })
        }

        // try logging in
        req.logIn(user, function (err) {
            if (err) {
                return res.status(401).send({ errors: err })
            }

            return res.status(200).send({
                success: `Iniciaste como ${user.id}`  // what is .id?
            })
        })

    })(req, res, next); // pass request to the next middleware
})


module.exports = router;