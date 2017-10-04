var express = require('express')
var router = express.Router()

var os = require('os')
var hostname = os.hostname()
router.use(function (req, res, next) {
  res.locals.hostname=hostname
  next()
});

// anything beginning with "/vn" will go into this
router.use('/v1', require('./routes_v1'));
router.use('/v2', require('./routes_v2'));
router.use('/v2a', require('./routes_v2a'));
router.use('/v3', require('./routes_v3'));
router.use('/v4', require('./routes_v4'));
router.use('/v5', require('./routes_v5'));
router.use('/v6', require('./routes_v6'));
router.use('/v7', require('./routes_v7'));
router.use('/v8', require('./routes_v8'));


// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

module.exports = router
