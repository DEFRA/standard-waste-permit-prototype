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

router.post('/operator/site-operator', function (req, res) {
  res.render(folder + '/operator/site-operator',{
      "formAction":"/"+ folder + "/operator/checkoperator"
  })
})

// This is not a real page, just a URL for the route
router.post('/operator/checkoperator', function (req, res) {
  if(req.body['operatorType']=="Limited company"){ // think you need square bracket for radios
    // show company page
      res.render(folder + '/operator/company/company-name',{
          "formAction":"/"+ folder + "/operator/company/check-company-details"
      })
  } else {
    // go on to error
    res.render(folder + '/error/index',{ 
        "errorText":"We only cover limited companies in this prototype"
    })
  }
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
      "formAction":"/"+ folder + "/evidence/upload-site-plan"
  })
})


// Evidence ===================================================================

router.post('/evidence/upload-site-plan', function (req, res) {
  res.render(folder + '/evidence/upload-site-plan',{
      "formAction":"/"+ folder + "/evidence/upload-fire-plan"
  })
})

router.post('/evidence/upload-fire-plan', function (req, res) {
  res.render(folder + '/evidence/upload-fire-plan',{ 
      "formAction":"/"+ folder + "/evidence/industry-scheme"
  })
})

router.post('/evidence/industry-scheme', function (req, res) {
  res.render(folder + '/evidence/industry-scheme',{
      "formAction":"/"+ folder + "/evidence/upload-technical-evidence"
  })
})

router.post('/evidence/upload-technical-evidence', function (req, res) {
  res.render(folder + '/evidence/upload-technical-evidence',{
      "formAction":"/"+ folder + "/evidence/management-system"
  })
})

router.post('/evidence/management-system', function (req, res) {
  res.render(folder + '/evidence/management-system',{
      "formAction":"/"+ folder + "/evidence/declare-offences"
  })
})

router.post('/evidence/declare-offences', function (req, res) {
  res.render(folder + '/evidence/declare-offences',{
      "formAction":"/"+ folder + "/evidence/offencescheck"
  })
})

// This is not a real page, just a URL for the route
router.post('/evidence/offencescheck', function (req, res) {
  if(req.body['offences']=="yes"){ // think you need square bracket for radios
    // show details page
      res.render(folder + '/evidence/details-of-offence',{
          "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency"
      })
  } else {
    // go on to bankruptcy
    res.render(folder + '/evidence/bankruptcy-insolvency',{ 
        "formAction":"/"+ folder + "/check/claim-confidentiality"
    })
  }
})

router.post('/evidence/bankruptcy-insolvency', function (req, res) {
  res.render(folder + '/evidence/bankruptcy-insolvency',{
      "formAction":"/"+ folder + "/check/claim-confidentiality"
  })
})

router.post('/check/claim-confidentiality', function (req, res) {
  res.render(folder + '/check/claim-confidentiality',{
      "formAction":"/"+ folder + "/check/check-answers"
  })
})

router.post('/check/check-answers', function (req, res) {
  res.render(folder + '/check/check-answers',{
      "formAction":"/"+ folder + "/pay/payment-method"
  })
})

router.post('/pay/payment-method', function (req, res) {
  res.render(folder + '/pay/payment-method',{
      "formAction":"/"+ folder + "/pay/how-to-pay"
  })
})

// This is not a real page, just a URL for the route
router.post('/pay/how-to-pay', function (req, res) {
  if(req.body['paymentMethod']=="Debit or credit card"){ // think you need square bracket for radios
    // show details page
      res.render(folder + '/pay/enter-card-details',{
          "formAction":"/"+ folder + "/pay/confirm-payment"
      })
  } else if(req.body['paymentMethod']=="Bank transfer") {
    // go on to bankruptcy
    res.render(folder + '/pay/pay-by-bank-transfer',{ 
        "formAction":"/"+ folder + "/done/index"
    })
  } else {
    // go on to cheque
    res.render(folder + '/pay/pay-by-cheque',{ 
        "formAction":"/"+ folder + "/done/index"
    })
  }
})

router.post('/pay/confirm-payment', function (req, res) {
  res.render(folder + '/pay/confirm-payment',{
      "formAction":"/"+ folder + "/done/index"
  })
})

router.post('/done/index', function (req, res) {
  res.render(folder + '/done/index',{
      "formAction":"NOT_NEEDED"
  })
})

// No route needed for /v1/done/email-confirm">Confirmation email



module.exports = router
