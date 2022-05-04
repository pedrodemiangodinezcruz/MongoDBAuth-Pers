const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario')
const passport = require('passport')
const LocalStrategy = require('passport-local');

// returns the user id, provided the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// returns the user or an error, provided the id
passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, user) => {
        done(err, user);
    })
})


/* 
Our strategy handles both registration and log in in a single endpoint, with the
caveat of dropping the mandatory 'name' field upon User Document creation.
*/
passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:true,
    }, (req, email, password, done) => {
        // Match a user
        Usuario.findOne({email: email})
        .then(user => {
            if (!user) {

                return done(null, false, req.flash('message', 'El usuario no existe' ))
            }  // else, return existing user
            else {
                if (!user.verificado) {
                    return done(null, false, req.flash('message', 'Usuario no verificado. Revisa tu correo'))
                }

                bcrypt.compare(password, user.password, (err, success) => {
                    if (err) throw err;

                    if (success) {
                        console.log("Login SUCESS", email);
                        return done(null, user);
                    } else {
                        console.log("Login FAIL", email );
                        return done(null, false, req.flash('message', 'Usuario / Contraseña incorrectos'))
                    }
                });
            }
        })
        .catch(err => {
            return done(null, false, {message: err});
        })
    })
)


module.exports = passport;