var express = require('express')
var router = express.Router()

// this file deals with all paths starting /version_x
// How to use folder variable:
// res.redirect( '/' + folder + '/exemptions/add_exemptions');
var folder = "v3";

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

// Start or resume ============================================================

router.get('/start/start-or-resume', function (req, res) {
  res.render(folder + '/start/start-or-resume',{
    "formAction":"/"+ folder + "/selectpermit/permit-category"
  })
})

// Before you begin ===========================================================

router.post('/returncode/before-you-begin', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/returncode/before-you-begin',{
    "formAction":"/"+ folder + "/selectpermit/permit-category",
    "permit":req.session.permit // always send permit object to page
  })
})

router.get('/returncode/continue-application', function (req, res) {
  res.render(folder + '/returncode/continue-application',{
    "formAction":"/"+ folder + "/check/overview",
    "permit":req.session.permit // always send permit object to page
  })
})

router.get('/returncode/email-code', function (req, res) {
  res.render(folder + '/returncode/email-code',{
    "rtnCode":req.query["rtnCode"],
    "permit":req.session.permit // always send permit object to page
  })
})



// Select permit ==============================================================

router.post('/selectpermit/permit-category', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/selectpermit/permit-category',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit",
    "permit":req.session.permit // always send permit object to page
  })
})

router.post('/selectpermit/choose-permit', function (req, res) {
  if(typeof req.body['chosenCategory']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{ 
        "errorText":"Please say what you want the permit for"
    })
  } else {
    res.render(folder + '/selectpermit/choose-permit',{
      "formAction":"/"+ folder + "/selectpermit/cost",
      "chosenCategory":req.body['chosenCategory']
    })    
  }
})

router.post('/selectpermit/cost', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/selectpermit/cost',{
    "formAction":"/"+ folder + "/selectpermit/time",
    "chosenPermitID":req.body['chosenPermitID'],
    "permit":req.session.permit // always send permit object to page
  })
})

router.post('/selectpermit/time', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/selectpermit/time',{
    "formAction":"/"+ folder + "/check/task-list",   // just to task list
    "chosenPermitID":req.body['chosenPermitID'],
    "permit":req.session.permit // always send permit object to page
  })
})


// Save and return ==============================================================

router.post('/save-and-return/save-option', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/save-and-return/save-option',{
      "formAction":"/"+ folder + "/save-and-return/save-choice",
      "permit":req.session.permit // always send permit object to page
  })
})

// This is not a real page, just a URL for the route
router.post('/save-and-return/save-choice', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  if(req.body['wants_save_and_return']=="no"){ // think you need square bracket for radios
    // show task-list
      res.render(folder + '/check/task-list',{
          "formAction":"/"+ folder + "/check/declaration",
          "permit":req.session.permit // always send permit object to page
      })
  } else {
        // show email-or-phone
      res.render(folder + '/save-and-return/email-or-phone',{
          "formAction":"/"+ folder + "/save-and-return/confirm",
          "permit":req.session.permit // always send permit object to page
      })
  }
})

router.post('/check/task-list', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // form to session
  
  if(req.body['previousPage']=="time"){ 
    // they've already seen the same and return option so go to task list
    res.render(folder + '/check/task-list',{
      "formAction":"/"+ folder + "/NOT-NEEDED",
      "permit":req.session.permit // always send permit object to page
    })
  } else if (req.session.permit['seenSaveReturn']=="yes"){
    res.render(folder + '/check/task-list',{
      "formAction":"/"+ folder + "/NOT-NEEDED",
      "permit":req.session.permit // always send permit object to page
    })
  } else {
    res.render(folder + '/save-and-return/save-option',{ // show save and return pages
        "formAction":"/"+ folder + "/save-and-return/save-choice",
        "permit":req.session.permit // always send permit object to page
    })
  }
})

router.post('/save-and-return/confirm', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/save-and-return/confirm',{
    "formAction":"/"+ folder + "/save-and-return/sent",
    "permit":req.session.permit // always send permit object to page
  })
})

router.post('/save-and-return/sent', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/save-and-return/sent',{
    "formAction":"/"+ folder + "/check/task-list",
    "permit":req.session.permit // always send permit object to page
  })
})

// Task-list ===================================================================

// Read rules ===================================================================

router.get('/read-rules/index', function (req, res) {
  res.render(folder + '/read-rules/index',{
      "formAction":"/"+ folder + "/check/task-list", 
      "permit":req.session.permit
  })
})

// Pre-app ===================================================================

router.get('/preapp/preapp-discussion', function (req, res) {
  res.render(folder + '/preapp/preapp-discussion',{
      "formAction":"/"+ folder + "/check/task-list",
      "permit":req.session.permit
  })
})


// Screening =================================================================

router.get('/screening/conservation-screening', function (req, res) {
  res.render(folder + '/screening/conservation-screening',{
      "formAction":"/"+ folder + "/check/task-list", 
      "permit":req.session.permit
  })
})


// Contact ===================================================================

router.get('/contact/contact-details', function (req, res) {
  res.render(folder + '/contact/contact-details',{
      "formAction":"/"+ folder + "/check/task-list", 
      "permit":req.session.permit
  })
})


// Site ===================================================================

// site/site-name > /site/grid-reference > /address/postcode > /address/address 
// > /evidence/check-site-plan > /check/task-list

// Add new page site/reason. Link from task-list will be a get
//router.get('/site/reason', function (req, res) {
//  res.render(folder + '/site/reason',{
//      "formAction":"/"+ folder + "/site/site-name",
//      "permit":req.session.permit // always send permit object to page
//  })
//})

// first site name visit is a get
router.get('/site/site-name', function (req, res) {
  res.render(folder + '/site/site-name',{
      "formAction":"/"+ folder + "/site/grid-reference",
      "permit":req.session.permit // always send permit object to page
  })
})

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
      "formAction":"/"+ folder + "/evidence/check-site-plan", 
      "permit":req.session.permit // always send permit object to page
  })
})

// Manual address is a link - so a GET
router.get('/address/address-manual', function (req, res) {
  res.render(folder + '/address/address-manual',{
      "formAction":"/"+ folder + "/evidence/check-site-plan", 
      "permit":req.session.permit // always send permit object to page
  })
})

// Site plan conditional routing
router.post('/evidence/check-site-plan', function (req, res) {
  // check if site plan is needed for this permit 
  if(req.session.permit['sitePlanNeeded'] == "No"){
      res.redirect('/'+folder + '/check/task-list')
  } else {
      for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session
      res.render(folder + '/evidence/upload-site-plan',{
          "formAction":"/"+ folder + "/check/task-list",
          "permit":req.session.permit // always send permit object to page
      })
  }
})


// Technical ability ==========================================================

router.get('/evidence/industry-scheme', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/industry-scheme',{
      "formAction":"/"+ folder + "/evidence/upload-technical-evidence",
      "permit":req.session.permit // always send permit object to page
  })
})

router.post('/evidence/upload-technical-evidence', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/upload-technical-evidence',{
      "formAction":"/"+ folder + "/check/task-list",
      "permit":req.session.permit // always send permit object to page
  })
})


// Management system ==========================================================

router.get('/evidence/management-system', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/management-system',{
      "formAction":"/"+ folder + "/check/task-list",
      "permit":req.session.permit // always send permit object to page
  })
})


// Operator ===================================================================

// Add new page site/reason. Link from task-list will be a get
//router.get('/operator/reason', function (req, res) {
//  res.render(folder + '/operator/reason',{
//      "formAction":"/"+ folder + "/operator/site-operator",
//      "permit":req.session.permit // always send permit object to page
//  })
//})

router.get('/operator/site-operator', function (req, res) {
  res.render(folder + '/operator/site-operator',{
      "formAction":"/"+ folder + "/operator/checkoperator",
      "permit":req.session.permit // always send permit object to page
  })
})

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
      "formAction":"/"+ folder + "/check/task-list",
      "permit":req.session.permit // always send permit object to page
  })
})

// Relevant offences ===========================================================

router.get('/evidence/declare-offences', function (req, res) {
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
          "formAction":"/"+ folder + "/check/task-list",
          "permit":req.session.permit // always send permit object to page
      })
  } else {
      res.redirect('/'+folder+'/check/task-list')
  }
})

// Bankruptcy insolvency ========================================================

router.get('/evidence/bankruptcy-insolvency', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/bankruptcy-insolvency',{
      "formAction":"/"+ folder + "/check/task-list",
      "permit":req.session.permit // always send permit object to page
  })
})


// Fire prevention plan ========================================================

router.get('/evidence/upload-fire-plan', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/evidence/upload-fire-plan',{ 
        "formAction":"/"+ folder + "/check/task-list",
        "permit":req.session.permit // always send permit object to page
    })
})


// Submit and pay ======================================================
router.get('/check/declaration', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/check/declaration',{ 
        "formAction":"/"+ folder + "/pay/payment-method",
        "permit":req.session.permit // always send permit object to page
    })
})

router.post('/check/declaration', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/check/declaration',{
      "formAction":"/"+ folder + "/pay/payment-method",
      "permit":req.session.permit // always send permit object to page
  })
})


// Claim confidentiality ========================================================

router.get('/check/claim-confidentiality', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session 
  res.render(folder + '/check/claim-confidentiality',{
      "formAction":"/"+ folder + "/check/task-list",
      "permit":req.session.permit // always send permit object to page
  })
})

// Special cases ==============================================================

router.get('/check-special-cases', function (req, res) {
  for(var input in req.body) req.session.permit[input] = req.body[input] // add form entries to session
  
  var nextPage =  "/check/task-list" // the next page after the special case pages with slash
  
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
    res.redirect('/'+folder+'/check/overview')
  }
})


// Check answers ===================================================================

router.get('/check/check-answers', function (req, res) {
  res.render(folder + '/check/check-answers',{
      "formAction":"/"+ folder + "/pay/payment-method",
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


// Pay ===================================================================

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

// Permit search ===================================================================

router.get('/search-permit/index', function (req, res) {
    res.render(folder + '/search-permit/index',{ 
      "formAction":"/"+ folder + "/search-permit/index"
    })
})

router.post('/search-permit/index', function (req, res) {
    res.render(folder + '/search-permit/index',{ 
      "formAction":"/"+ folder + "/search-permit/index",
      "searchTerm":req.body.searchTerm 
    })
})

// Send permit data in session to every page ==================================
router.all('*', function (req, res, next) {
  // set a folder and store in locals
  // this can then be used in pages as {{folder}}
  res.locals.permit=req.session.permit
  next()
});


module.exports = router
