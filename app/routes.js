var express = require('express')
var router = express.Router()

// anything beginning with "/vn" will go into this
router.use('/v1', require('./routes_v1'));
router.use('/v2', require('./routes_v2'));
router.use('/v2a', require('./routes_v2a'));
router.use('/v3', require('./routes_v3'));

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

module.exports = router
