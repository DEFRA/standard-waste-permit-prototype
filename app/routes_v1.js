var express = require('express')
var router = express.Router()




// this file deals with all paths starting /version_x
var folder = "v1";

router.use(function (req, res, next) {
  res.locals.folder=folder;
  next();
});


// How to use folder
//  res.redirect( '/' + folder + '/exemptions/add_exemptions');


// add your routes here

// About you ***************************************

// router.get URL must match the HTML form action URL
/*
router.get('/about-you/applicant-type/application-from-a-company', function (req, res) {
  // get the answer from the query string
  var applicantType = req.query.applicantType

  if (applicantType === 'An individual') {
    res.redirect('/' + folder +'/about-you/applicant-type/application-from-individual')
  } 

  else if (applicantType === 'An organisation of individuals') {
    res.redirect('/' + folder +'/about-you/applicant-type/application-from-org-of-individuals')
  } 

  else if (applicantType === 'A public body') {
    res.redirect('/' + folder +'/about-you/applicant-type/application-from-public-body')
  } 

  else {
    // if applicantType is any other value (or is missing) render the page requested. 
    // Important - don't include the slash at the start
    res.render('/' + folder +'about-you/applicant-type/application-from-a-company')
  }
})
*/


  // Is your main UK business address different from above?

router.get('/about-you/contact-application', function (req, res) {
  // get the answer from the query string (eg. ?UKBusinessAddress=no)
  var UKBusinessAddress = req.query.UKBusinessAddress

  if (UKBusinessAddress === 'Yes') {
    // redirect to the relevant page
    res.redirect('/' + folder +'/about-you/main-UK-business-address')
  } else {
    // if UKBusinessAddress is any other value (or is missing) render the page requested.
    // Remember to omit the forward-slash at the start
    res.render('/' + folder +'about-you/contact-application')
  }
})


  // Who can we contact about your operation?

router.get('/about-you/contact-billing', function (req, res) {
  // get the answer from the query string (eg. ?OperationContact=no)
  var OperationContact = req.query.OperationContact

  if (OperationContact === 'different') {
    // redirect to the relevant page
    res.redirect('/' + folder +'/about-you/contact-operation')
  } else {
    // if OperationContact is any other value (or is missing) render the page requested.
    // Remember to omit the forward-slash at the start
    res.render('/' + folder +'about-you/contact-billing')
  }
})


router.post('/selectpermit/choose-permit', function (req, res) {
  res.render(folder + "/" + 'selectpermit/choose-permit',{"chosenCategory":req.body['chosenCategory']})
})

router.post('/selectpermit/permit-details', function (req, res) {
  res.render(folder + "/" +'selectpermit/permit-details',{
    "chosenPermitID":req.body['chosenPermitID']})
})

router.post('/selectpermit/check-permit', function (req, res) {
  res.render(folder + "/" +'selectpermit/check-permit',{
    "chosenPermitID":req.body['chosenPermitID'] })
})

router.post('/selectpermit/what-need-to-apply', function (req, res) {
  res.render(folder + "/" +'selectpermit/what-need-to-apply',{"chosenPermitID":req.body['chosenPermitID']})
})

module.exports = router
