var express = require('express')
var router = express.Router()

router.use(function (req, res, next) {
  res.locals.hostname=process.env.THISHOST
  next()
});


// anything beginning with "/vn" will go into this
router.use('/v1', require('./routes_v1'))
router.use('/v2', require('./routes_v2'))
router.use('/v2a', require('./routes_v2a'))
router.use('/v3', require('./routes_v3'))
router.use('/v4', require('./routes_v4'))
router.use('/v5', require('./routes_v5'))
router.use('/v6', require('./routes_v6'))
router.use('/v7', require('./routes_v7'))
router.use('/v8', require('./routes_v8'))
router.use('/v9', require('./routes_v9'))
router.use('/v10', require('./routes_v10'))
router.use('/v11', require('./routes_v11'))
router.use('/v12', require('./routes_v12'))
router.use('/v13', require('./routes_v13'))
router.use('/v14', require('./routes_v14'))
router.use('/v15', require('./routes_v15'))
router.use('/v16', require('./routes_v16'))
router.use('/v17', require('./routes_v17'))
router.use('/v18', require('./routes_v18'))
router.use('/v19', require('./routes_v19'))
router.use('/v20', require('./routes_v20'))
router.use('/v21', require('./routes_v21'))
router.use('/v22', require('./routes_v22'))
router.use('/v23', require('./routes_v23'))


// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

module.exports = router
