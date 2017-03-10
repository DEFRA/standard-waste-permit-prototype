var express = require('express')
var router = express.Router()


// anything beginning with "/vn" will go into this
router.use('/v1', require('./routes_v1'));

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

module.exports = router
