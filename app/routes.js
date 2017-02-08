var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here

// About you
// The if, else if method is pretty basic. No doubt there is a more elegant way but it works for now. 

// router.get URL must match the HTML form action URL
router.get('/applicant-type/application-from-a-company', function (req, res) {
  // get the answer from the query string
  var applicantType = req.query.applicantType

  if (applicantType === 'An individual') {
    res.redirect('/applicant-type/application-from-individual')
  } 

  else if (applicantType === 'An organisation of individuals') {
    res.redirect('/applicant-type/application-from-org-of-individuals')
  } 

  else if (applicantType === 'A public body') {
    res.redirect('/applicant-type/application-from-public-body')
  } 

  else {
    // if applicantType is any other value (or is missing) render the page requested. 
    // Important - don't include the slash at the start
    res.render('applicant-type/application-from-a-company')
  }
})


  // Is your main UK business address different from above?

router.get('/contact-application', function (req, res) {
  // get the answer from the query string (eg. ?UKBusinessAddress=no)
  var UKBusinessAddress = req.query.UKBusinessAddress

  if (UKBusinessAddress === 'Yes') {
    // redirect to the relevant page
    res.redirect('/main-UK-business-address')
  } else {
    // if UKBusinessAddress is any other value (or is missing) render the page requested.
    // Remember to omit the forward-slash at the start
    res.render('contact-application')
  }
})


  // Who can we contact about your operation?

router.get('/contact-billing', function (req, res) {
  // get the answer from the query string (eg. ?OperationContact=no)
  var OperationContact = req.query.OperationContact

  if (OperationContact === 'different') {
    // redirect to the relevant page
    res.redirect('/contact-operation')
  } else {
    // if OperationContact is any other value (or is missing) render the page requested.
    // Remember to omit the forward-slash at the start
    res.render('contact-billing')
  }
})






module.exports = router
