var express = require('express')
var router = express.Router()

// this file deals with all paths starting /version_x
// How to use folder variable:
// res.redirect( '/' + folder + '/exemptions/add_exemptions');
var folder = "v1";

router.use(function (req, res, next) {
  res.locals.folder=folder;
  next();
});

// Guide page on GDS (start) links to permit category ==============

// Select permit ==============================================================

router.get('/selectpermit/permit-category', function (req, res) {
  res.render(folder + '/selectpermit/permit-category',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit"
  })
})

router.post('/selectpermit/choose-permit', function (req, res) {
  res.render(folder + '/selectpermit/choose-permit',{
    "formAction":"/"+ folder + "/selectpermit/check-permit",
    "chosenCategory":req.body['chosenCategory']
  })
})

router.post('/selectpermit/check-permit', function (req, res) {
  res.render(folder + '/selectpermit/check-permit',{
    "formAction":"/"+ folder + "/selectpermit/what-need-to-apply",
    "chosenPermitID":req.body['chosenPermitID'] })
})

router.post('/selectpermit/what-need-to-apply', function (req, res) {
  res.render(folder + '/selectpermit/what-need-to-apply',{
      "formAction":"/"+ folder + "/preapp/preapp-discussion",
      "chosenPermitID":req.body['chosenPermitID']
  })
})


// Pre-app ===================================================================

router.post('/preapp/preapp-discussion', function (req, res) {
  res.render(folder + '/preapp/preapp-discussion',{
      "formAction":"/"+ folder + "/operator/site-operator"
  })
})


// Operator ===================================================================

// TODO add conditional
router.post('/operator/site-operator', function (req, res) {
  res.render(folder + '/operator/site-operator',{
      "formAction":"/"+ folder + "/operator/company/company-name"
  })
})

router.post('/operator/company/company-name', function (req, res) {
  res.render(folder + '/operator/company/company-name',{
      "formAction":"/"+ folder + "/operator/company/check-company-details"
  })
})

router.post('/operator/company/check-company-details', function (req, res) {
  res.render(folder + '/operator/company/check-company-details',{
      "formAction":"/"+ folder + "/site/site-name"
  })
})


// Site ===================================================================

router.post('/site/site-name', function (req, res) {
  res.render(folder + '/site/site-name',{
      "formAction":"/"+ folder + "/site/grid-reference"
  })
})

router.post('/site/grid-reference', function (req, res) {
  res.render(folder + '/site/grid-reference',{
      "formAction":"/"+ folder + "/address/postcode"
  })
})

router.post('/address/postcode', function (req, res) {
  res.render(folder + '/address/postcode',{
      "formAction":"/"+ folder + "/address/address"
  })
})

router.post('/address/address', function (req, res) {
  res.render(folder + '/address/address',{
      "formAction":"/"+ folder + "/contact/contact-details"
  })
})

// Manual address is a link - so a GET
router.get('/address/address-manual', function (req, res) {
  res.render(folder + '/address/address-manual',{
      "formAction":"/"+ folder + "/contact/contact-details"
  })
})


// Contact ===================================================================

router.post('/contact/contact-details', function (req, res) {
  res.render(folder + '/contact/contact-details',{
      "formAction":"/"+ folder + "/upload/site-plan"
  })
})


// Contact ===================================================================

router.post('/evidence/upload-site-plan', function (req, res) {
  res.render(folder + '/evidence/upload-site-plan',{    // uses generic upload template
      "formAction":"/"+ folder + "/evidence/upload-fire-plan"
  })
})

router.post('/evidence/upload-fire-plan', function (req, res) {
  res.render(folder + '/upload-fire-plan',{    // uses generic upload template
      "formAction":"/"+ folder + "/evidence/industry-scheme"
  })
})

router.post('/evidence/industry-scheme', function (req, res) {
  res.render(folder + '/evidence/industry-scheme',{    // uses generic upload template
      "formAction":"/"+ folder + "/evidence/upload-technical-evidence"
  })
})

router.post('/evidence/upload-technical-evidence', function (req, res) {
  res.render(folder + '/evidence/upload-technical-evidence',{    // uses generic upload template
      "formAction":"/"+ folder + "/evidence/management-system"
  })
})

router.post('/evidence/management-system', function (req, res) {
  res.render(folder + '/evidence/management-system',{    // uses generic upload template
      "formAction":"/"+ folder + "/evidence/declare-offences"
  })
})

router.post('/evidence/declare-offences', function (req, res) {
  res.render(folder + '/evidence/declare-offences',{    // uses generic upload template
      "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency"
  })
})



router.post('/evidence/declare-offences', function (req, res) {
  if(req.body.offences=="yes"){
    // show details page
      res.render(folder + '/evidence/details-of-offence',{    // uses generic upload template
          "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency"
      })
  } else{
    // go on to bankruptcy
    res.render(folder + '/evidence/details-of-offence',{    // uses generic upload template
        "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency"
    })
  }
})

// <li><a href="/v1/evidence/declare-offences">Do you have any offences to declare?</a></li>
// <li><a href="/v1/evidence/details-of-offence">Details of the offence</a></li>
// <li><a href="/v1/evidence/bankruptcy-insolvency">Tell us about any bankruptcy or insolvency</a></li>

// <li><a href="/v1/check/claim-confidentiality">Do you want to claim confidentiality</a></li>
// <li><a href="/v1/check/check-answers">Check your answers</a></li>

// <li><a href="/v1/pay/payment-method">Choose how you want to pay</a></li>
// <li><a href="/v1/pay/pay-by-cheque">Pay by cheque</a></li>
// <li><a href="/v1/pay/enter-card-details">Pay - enter card details</a></li>
// <li><a href="/v1/pay/confirm-payment">Pay - confirm payment</a></li>

// <li><a href="/v1/done/index">Confirmation (done) page</a></li>
// <li><a href="/v1/done/email-confirm">Confirmation email</a></li>


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




module.exports = router
