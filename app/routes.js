var express = require('express')
var router = express.Router()
var request = require('request')

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here

// About you ***************************************

// router.get URL must match the HTML form action URL
router.get('/about-you/applicant-type/application-from-a-company', function (req, res) {
  // get the answer from the query string
  var applicantType = req.query.applicantType

  if (applicantType === 'An individual') {
    res.redirect('/about-you/applicant-type/application-from-individual')
  } 

  else if (applicantType === 'An organisation of individuals') {
    res.redirect('/about-you/applicant-type/application-from-org-of-individuals')
  } 

  else if (applicantType === 'A public body') {
    res.redirect('/about-you/applicant-type/application-from-public-body')
  } 

  else {
    // if applicantType is any other value (or is missing) render the page requested. 
    // Important - don't include the slash at the start
    res.render('about-you/applicant-type/application-from-a-company')
  }
})


  // Is your main UK business address different from above?

router.get('/about-you/contact-application', function (req, res) {
  // get the answer from the query string (eg. ?UKBusinessAddress=no)
  var UKBusinessAddress = req.query.UKBusinessAddress

  if (UKBusinessAddress === 'Yes') {
    // redirect to the relevant page
    res.redirect('/about-you/main-UK-business-address')
  } else {
    // if UKBusinessAddress is any other value (or is missing) render the page requested.
    // Remember to omit the forward-slash at the start
    res.render('about-you/contact-application')
  }
})


  // Who can we contact about your operation?

router.get('/about-you/contact-billing', function (req, res) {
  // get the answer from the query string (eg. ?OperationContact=no)
  var OperationContact = req.query.OperationContact

  if (OperationContact === 'different') {
    // redirect to the relevant page
    res.redirect('/about-you/contact-operation')
  } else {
    // if OperationContact is any other value (or is missing) render the page requested.
    // Remember to omit the forward-slash at the start
    res.render('about-you/contact-billing')
  }
})


router.post('/select-permit/choose-permit', function (req, res) {
  res.render('select-permit/choose-permit',{"chosenCategory":req.body['chosenCategory']})
})

router.post('/select-permit/permit-details', function (req, res) {
  res.render('select-permit/permit-details',{"chosenPermitID":req.body['chosenPermitID']})
})



router.get('/company', function(req, res) {
  request({
    url: 'https://api.companieshouse.gov.uk/company/09894423',
    auth: {
      user: 'B6gG6zj0r_w1K6mOqBiW6GGvoe4ygQwQBoFTfxZo',
      pass: '',
      sendImmediately: false
      }
  }, function(err, res, json) {
    if (err) {
      throw err
    }
    console.log(json)
  })
})

module.exports = router
