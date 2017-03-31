var express = require('express')
var router = express.Router()

// this file deals with all paths starting /version_x
// How to use folder variable:
// res.redirect( '/' + folder + '/exemptions/add_exemptions');
var folder = "v2";

router.use(function (req, res, next) {
  // set a folder and store in locals
  // this can then be used in pages as {{folder}}
  res.locals.folder=folder
  
  // check for an existing permit object stored in session
  // if it does not exist, create it
  var permit = req.session.permit
  if (!permit) {
    permit = req.session.permit = {}
  }
  
  next()
});


// CLEAR SESSION ==============================================================
router.get('/cls', function (req, res) {
  req.session.destroy()
  res.render('index')
})


// Guide page on GDS (start) links to permit category ==============

// Select permit ==============================================================

router.get('/selectpermit/permit-category', function (req, res) {
  res.render(folder + '/selectpermit/permit-category',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit"
  })
})

router.post('/selectpermit/choose-permit', function (req, res) {
  if(typeof req.body['chosenCategory']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{ 
        "errorText":"Please say what you want the permit for"
    })
  } else {
    res.render(folder + '/selectpermit/choose-permit',{
      "formAction":"/"+ folder + "/selectpermit/check-permit",
      "chosenCategory":req.body['chosenCategory']
    })    
  }
})

// Check permit via POST is from previous selection page - there is also a GET route for links
router.post('/selectpermit/check-permit', function (req, res) {
  if(typeof req.body['chosenPermitID']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{ 
        "errorText":"Please select a permit"
    })
  } else {
    // save chosen Permit ID in session
    for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
    res.render(folder + '/selectpermit/check-permit',{
      "formAction":"/"+ folder + "/selectpermit/what-need-to-apply",
      "chosenPermitID":req.body['chosenPermitID'],
      "permit":req.session.permit // always send permit object to page
    })
}
})

// Check permit via GET route for links
// Example link:  http://localhost:3000/v2/selectpermit/check-permit?chosenPermitID=SR-2008-16
router.get('/selectpermit/check-permit', function (req, res) {
  if(typeof req.query['chosenPermitID']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{ 
        "errorText":"Please select a permit"
    })
  } else {
    // save chosen Permit ID in session
    // no form entries to add to session 
    res.render(folder + '/selectpermit/check-permit',{
      "formAction":"/"+ folder + "/selectpermit/what-need-to-apply",
      "chosenPermitID":req.query['chosenPermitID']
    })
}
})

router.post('/selectpermit/what-need-to-apply', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/selectpermit/what-need-to-apply',{
      "formAction":"/"+ folder + "/preapp/preapp-discussion",
      "chosenPermitID":req.body['chosenPermitID'],
      "permit":req.session.permit // always send permit object to page
  })
})


// Pre-app ===================================================================

router.post('/preapp/preapp-discussion', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/preapp/preapp-discussion',{
      "formAction":"/"+ folder + "/site/site-name",
      "permit":req.session.permit // always send permit object to page
  })
})


// Site ===================================================================

router.post('/site/site-name', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/site/site-name',{
      "formAction":"/"+ folder + "/site/grid-reference",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/site/grid-reference', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/site/grid-reference',{
      "formAction":"/"+ folder + "/address/postcode",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/address/postcode', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/address/postcode',{
      "formAction":"/"+ folder + "/address/address",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/address/address', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/address/address',{
      "formAction":"/"+ folder + "/check-special-cases",
      "permit":req.session.permit // always send permit object to page
  })
})

// Manual address is a link - so a GET
router.get('/address/address-manual', function (req, res) {
  res.render(folder + '/address/address-manual',{
      "formAction":"/"+ folder + "/check-special-cases",
      "permit":req.session.permit // always send permit object to page
  })
})



// Special cases ==============================================================


router.post('/check-special-cases', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session
  
  var nextPage =  "/evidence/upload-site-plan" // the next page after the special case pages with slash
  
  // check if there is a special case for this permit
  if(req.session.permit['permitID'] == "SR-2009-4"){
    res.render(folder + '/specialcases/sr-2009-4',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2009-8") {
    res.render(folder + '/specialcases/sr-2009-8',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2010-2") {
    res.render(folder + '/specialcases/sr-2010-2_3',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2010-3") {
    res.render(folder + '/specialcases/sr-2010-2_3',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2014-2") {
    res.render(folder + '/specialcases/sr-2014-2',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2015-17") {
    res.render(folder + '/specialcases/sr-2015-17_18',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2015-18") {
    res.render(folder + '/specialcases/sr-2015-17_18',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['permitID'] == "SR-2015-39") {
    res.render(folder + '/specialcases/sr-2015-39',{
        "formAction":"/"+ folder + nextPage,
        "permit":req.session.permit // always send permit object to page
    })
  } else { // NO SPECIAL CASES
    res.redirect('/'+folder+'/evidence/check-site-plan')
  }
})

// Evidence ===================================================================

// Site plan conditional routing
router.get('/evidence/check-site-plan', function (req, res) {
  // check if site plan is needed for this permit 
  if(req.session.permit['sitePlanNeeded'] == "No"){
      res.redirect('/'+folder + '/evidence/upload-fire-plan')
  } else {
      res.redirect('/'+folder + '/evidence/upload-site-plan')
  }
})


router.post('/evidence/upload-site-plan', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session
    res.render(folder + '/evidence/upload-site-plan',{
        "formAction":"/"+ folder + "/evidence/upload-fire-plan",
        "permit":req.session.permit // always send permit object to page
    })
})

router.post('/evidence/upload-fire-plan', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  // check if a fire plan is needed for this permit
  if(req.session.permit['permitFirePlanNeeded'] == "No"){
    // jump to industry scheme
    res.render(folder + '/evidence/industry-scheme',{
        "formAction":"/"+ folder + "/evidence/upload-technical-evidence",
        "permit":req.session.permit // always send permit object to page
    })
  } else {
    res.render(folder + '/evidence/upload-fire-plan',{ 
        "formAction":"/"+ folder + "/evidence/industry-scheme",
        "permit":req.session.permit // always send permit object to page
    })
  }
})

router.post('/evidence/industry-scheme', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/industry-scheme',{
      "formAction":"/"+ folder + "/evidence/upload-technical-evidence",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/evidence/upload-technical-evidence', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/upload-technical-evidence',{
      "formAction":"/"+ folder + "/evidence/management-system",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/evidence/management-system', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/management-system',{
      "formAction":"/"+ folder + "/operator/site-operator",
      "permit":req.session.permit // always send permit object to page
  })
})



// Operator ===================================================================

router.post('/operator/site-operator', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/operator/site-operator',{
      "formAction":"/"+ folder + "/operator/checkoperator",
      "permit":req.session.permit // always send permit object to page
  })
})

// This is not a real page, just a URL for the route
router.post('/operator/checkoperator', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  if(req.body['operatorType']=="Limited company"){ // think you need square bracket for radios
    // show company page
      res.render(folder + '/operator/company/company-name',{
          "formAction":"/"+ folder + "/operator/company/check-company-details",
          "permit":req.session.permit // always send permit object to page
      })
  } else {
    // go on to error
    res.render(folder + '/error/index',{ 
        "errorText":"We only cover limited companies in this prototype"
    })
  }
})

router.post('/operator/company/check-company-details', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/operator/company/check-company-details',{
      "formAction":"/"+ folder + "/contact/contact-details",
      "permit":req.session.permit // always send permit object to page
  })
})




// Contact ===================================================================

router.post('/contact/contact-details', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/contact/contact-details',{
      "formAction":"/"+ folder + "/evidence/declare-offences",
      "permit":req.session.permit // always send permit object to page
  })
})


// Offences ===================================================================

router.post('/evidence/declare-offences', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/declare-offences',{
      "formAction":"/"+ folder + "/evidence/offencescheck",
      "permit":req.session.permit // always send permit object to page
  })
})

// This is not a real page, just a URL for the route
router.post('/evidence/offencescheck', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  if(req.body['offences']=="yes"){ // think you need square bracket for radios
    // show details page
      res.render(folder + '/evidence/details-of-offence',{
          "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency",
          "permit":req.session.permit // always send permit object to page
      })
  } else {
    // go on to bankruptcy
    res.render(folder + '/evidence/bankruptcy-insolvency',{ 
        "formAction":"/"+ folder + "/check/claim-confidentiality",
        "permit":req.session.permit // always send permit object to page
    })
  }
})

router.post('/evidence/bankruptcy-insolvency', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/bankruptcy-insolvency',{
      "formAction":"/"+ folder + "/check/claim-confidentiality",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/check/claim-confidentiality', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/check/claim-confidentiality',{
      "formAction":"/"+ folder + "/check/check-answers",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/check/check-answers', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/check/check-answers',{
      "formAction":"/"+ folder + "/pay/payment-method",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/pay/payment-method', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/pay/payment-method',{
      "formAction":"/"+ folder + "/pay/how-to-pay",
      "permit":req.session.permit // always send permit object to page
  })
})

// This is not a real page, just a URL for the route
router.post('/pay/how-to-pay', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  if(req.body['paymentMethod']=="Debit or credit card"){ // think you need square bracket for radios
    // show details page
      res.render(folder + '/pay/enter-card-details',{
          "formAction":"/"+ folder + "/pay/confirm-payment",
          "permit":req.session.permit // always send permit object to page
      })
  } else if(req.body['paymentMethod']=="Bank transfer") {
    // go on to bankruptcy
    res.render(folder + '/pay/pay-by-bank-transfer',{ 
        "formAction":"/"+ folder + "/done/index",
        "permit":req.session.permit // always send permit object to page
    })
  } else {
    // go on to cheque
    res.render(folder + '/pay/pay-by-cheque',{ 
        "formAction":"/"+ folder + "/done/index",
        "permit":req.session.permit // always send permit object to page
    })
  }
})

router.post('/pay/confirm-payment', function (req, res) {
  res.render(folder + '/pay/confirm-payment',{
      "formAction":"/"+ folder + "/done/index",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/done/index', function (req, res) {
  res.render(folder + '/done/index',{
      "formAction":"NOT_NEEDED",
      "permit":req.session.permit // always send permit object to page
  })
})

// /v2/done/email-confirm Confirmation email

router.get('/done/email-confirm', function (req, res) {
  res.render(folder + '/done/email-confirm',{
      "formAction":"NOT_NEEDED",
      "permit":req.session.permit // always send permit object to page
  })
})


// Errors ===================================================================

router.get('/error/wrong-company-details', function (req, res) {
    res.render(folder + '/error/index',{ 
        "errorText":"If the company details are not correct you can't apply online. Please contact us."
    })
})


module.exports = router
