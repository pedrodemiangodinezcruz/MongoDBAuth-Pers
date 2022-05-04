var express = require('express');
const { fetchReservas } = require('../controllers/usuarios');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // authentication occurs as first step always and user is set
  // on the request object

  if (!req.user) {
    return res.render('index');
  }
  next()
  //res.render('index', { title: 'Express' });
},
  fetchReservas,
  (req, res, next) => {
    res.render('home', { user: req.user })
  }
);



module.exports = router;
