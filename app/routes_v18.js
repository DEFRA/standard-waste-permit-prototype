var express = require('express')
var router = express.Router()

const request = require('request')
const async = require('async')

// this file deals with all paths starting /version_x
// How to use folder variable:
// res.redirect( '/' + folder + '/exemptions/add_exemptions');

var folder = "v18"
var servicename = "Apply for an environmental permit"
var paymentMethod = "govpay"  // or "govpay"

var sample = require('./views/'+folder+'/custom_inc/sample-permit.js')
//console.log(sample.permit)

// HTML for standard buttons
var backlink = '<a href="javascript:history.back()" class="link-back">Back</a>'
var submitButton = '<button type="submit" class="button" name="Continue">Continue</button>'
var completeLink = ''
// completeLink WAS <span id="completeLink"><a href="#" id="completeLater">Complete later</a></span>

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

router.use(function (req, res, next) {
  // set a folder and store in locals
  // this can then be used in pages as {{folder}}
  res.locals.folder=folder
  res.locals.backlink=backlink
  res.locals.submitButton=submitButton
  res.locals.completeLink=completeLink
  res.locals.paymentMethod=paymentMethod
  res.locals.serviceName=servicename
  // permit and autostore data set in all statement at bottom
  res.locals.permit=res.locals.data

  next()
});

// CLEAR SESSION ==============================================================
router.get('/cls', function (req, res) {
  req.session.destroy()
  res.render('index')
})


// Start or resume ==============================================================

router.get('/start/start-or-resume', function (req, res) {
  res.render(folder + '/start/start-or-resume',{
      "formAction":"/"+ folder + "/save-and-return/save-choice"
  })
})

router.post('/start/start-or-resume', function (req, res) {
  res.render(folder + '/start/start-or-resume',{
      "formAction":"/"+ folder + "/save-and-return/save-choice"
  })
})

// This is not a real page, just a URL for the route
router.post('/save-and-return/save-choice', function (req, res) {
  if(req.body['started-application']=="no"){ // think you need square bracket for radios

      res.render(folder + '/operator/site-operator',{
          // "formAction":"/"+ folder + "/selectpermit/permit-category2"
        "formAction":"/"+ folder + "/selectpermit/bespoke-or-standard"
      })
  } else {
      res.render(folder + '/save-and-return/already-started',{
          "formAction":"/"+ folder + "/save-and-return/link-resent"
      })
  }
})

router.post('/save-and-return/confirm', function (req, res) {
  res.render(folder + '/save-and-return/confirm',{
    "formAction":"/"+ folder + "/save-and-return/sent"
  })
})

router.post('/save-and-return/sent', function (req, res) {
  // IF EMAIL WAS RECEIVED GO TO TASK LIST
  if(req.body.GOTEMAIL == "YES"){
    res.render(folder + '/check/task-list',{
        "formAction":"/"+ folder + "/check/check-answers"
    })
  // EMAIL NOT RECEIVED SHOW PAGE AGAIN
  } else {
    res.render(folder + '/save-and-return/sent',{
        "formAction":"/"+ folder + "/save-and-return/sent_again",
        "resent":"resent"  // use this to change the heading
    })
  }
})

router.post('/save-and-return/sent_again', function (req, res) {
  // IF EMAIL WAS RECEIVED GO TO TASK LIST
  if(req.body.GOTEMAIL == "YES"){
    res.render(folder + '/check/task-list',{
        "formAction":"/"+ folder + "/check/check-answers"
    })
  // EMAIL NOT RECEIVED SHOW PAGE AGAIN
  } else {
    res.render(folder + '/save-and-return/sent_again',{
        "formAction":"/"+ folder + "/save-and-return/sent_again",
        "resent":"resent"  // use this to change the heading
    })
  }
})

router.post('/save-and-return/email-or-phone', function (req, res) {
  // IF EMAIL WAS RECEIVED GO TO TASK LIST
  if(req.body.GOTEMAIL == "YES"){
    res.render(folder + '/check/task-list',{
        "formAction":"/"+ folder + "/check/check-answers"
    })
  // EMAIL NOT RECEIVED SHOW PAGE AGAIN
  } else {
    res.render(folder + '/save-and-return/email-or-phone',{
        "formAction":"/"+ folder + "/save-and-return/email-or-phone",
        "resent":"resent"  // use this to change the heading
    })
  }
})

router.get('save-and-return/email-save-link', function (req, res) {
  res.render(folder + 'save-and-return/email-save-link',{
  })
})

// Confirm operator type=======================================================

router.get('/operator/company/company-decision', function (req, res) {
  // get the answer from the query string (eg. Limited company, individual, sole trader)
  var operatorType = req.query.operatorType

  if (operatorType === 'Limited company') {
    // redirect to the relevant page
    res.redirect("/"+ folder + '/operator/company/company-name')

  } else if (operatorType === 'Individual') {
      // redirect to the relevant page
    res.redirect("/"+ folder + '/operator/individual/individual-details')

  } else if (operatorType === 'Sole trader') {
    // if operator type is sole trader (or is missing) redirect to the page requested
    res.redirect("/"+ folder + '/operator/sole-trader/sole-trader')

  } else if (operatorType === 'Limited liability partnership') {
    // if operator type is limited liability partnership (or is missing) redirect to the page requested
    res.redirect("/"+ folder + '/operator/limited-liability-partnership/limited-liability-partnership-reference-no')
  }
})

module.exports = router

// Select permit ==============================================================

// required for 'select a different permit' via start page or task list
router.get('/selectpermit/permit-category2', function (req, res) {
    res.render(folder + '/selectpermit/permit-category2',{
      "formAction":"/"+ folder + "/selectpermit/choose-permit2",
      "chosenPermitID":req.body['chosenPermitID']
    })
})

// The POST version
router.post('/selectpermit/permit-category2', function (req, res) {
  console.log(req.body['permit-type'])
    // permit NOT YET selected
    if( req.session.data['chosenPermitID']==null ) {
      res.render(folder + '/selectpermit/permit-category2',{
        "formAction":"/"+ folder + "/selectpermit/check-category"
      })
    // permit set via link on a GOV.UK page so skip this page
    } else {
      res.render(folder + '/check/task-list',{ // show save and return pages
         "formAction":"/"+ folder + "/check/check-answers",
         "chosenPermitID":req.body['chosenPermitID']
      })
    }
})


// Check category is in-scope ============================

// required for 'select a different permit' via start page or task list
router.post('/selectpermit/bespoke-or-standard', function (req, res) {
    res.render(folder + '/selectpermit/bespoke-or-standard',{
      "formAction":"/"+ folder + "/selectpermit/select-bespoke-or-standard"
      // "chosenPermitID":req.body['chosenPermitID']
    })
})

router.get('/selectpermit/bespoke-or-standard', function (req, res) {
    res.render(folder + '/selectpermit/bespoke-or-standard',{
      "formAction":"/"+ folder + "/selectpermit/select-bespoke-or-standard"
      // "chosenPermitID":req.body['chosenPermitID']
    })
})

// required for 'select an activity for bespoke' via start page or task list
router.post('/selectpermit/select-bespoke-or-standard', function (req, res) {
  if(req.body['bespokePermit']=="standard"){ // think you need square bracket for radios
      res.render(folder + '/selectpermit/permit-category2',{
        "formAction":"/"+ folder + "/selectpermit/choose-permit2",
        "chosenPermitID":req.body['chosenPermitID']
      })
  } else if(req.body['bespokePermit']=="bespoke-other") {
      res.render(folder + '/selectpermit/bespoke-offline')
  } else {
      res.render(folder + '/bespoke/v3-activities/bespoke-category',{
          "formAction":"/"+ folder + "/bespoke/v3-activities/bespoke-choose-activity"
      })
  }
})



router.post('/selectpermit/check-category', function (req, res) {
  switch (req.body['chosenCategory']) {
    // These categories are NOT online
    case 'Flood risk activities':
    case 'Radioactive substances for non-nuclear sites':
    case 'Water discharges':
      // go on to 'paper' form page'
      return res.render(folder + '/selectpermit/permit-not-in-service',{})
  }

  switch (req.body['operatorType']) {
    case 'Limited company':
    case 'Sole trader':
    case 'Limited liability partnership':
    case 'Individual':
      // go on to choose permit
      return res.render(folder + '/selectpermit/choose-permit2',{
        "formAction":"/"+ folder + "/check/save-permit-details",
        "chosenCategory":req.body['chosenCategory']
      })
  }

  res.render(folder + '/selectpermit/permit-not-in-service',{})
})

// Choose permit ============================

router.post('/selectpermit/choose-permit2', function (req, res) {
  if(typeof req.body['chosenCategory']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{
        "errorText":"Please say what you want the permit for"
    })
  } else {
    res.render(folder + '/selectpermit/choose-permit2',{
      "formAction":"/"+ folder + "/check/save-permit-details",
      "chosenCategory":req.body['chosenCategory']
    })
  }
})



// Select Bespoke activity permit v1 ===============================================

// Select type - GET
router.get('/bespoke/v1-activities/bespoke-category', function (req, res) {
    res.render(folder + '/bespoke/v1-activities/bespoke-category',{
      "formAction":"/"+ folder + "/bespoke/v1-activities/bespoke-choose-activity",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select type POST version
router.post('/bespoke/v1-activities/bespoke-category', function (req, res) {
    res.render(folder + '/bespoke/v1-activities/bespoke-category',{
      "formAction":"/"+ folder + "/bespoke/v1-activities/bespoke-choose-activity",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select activity page
router.post('/bespoke/v1-activities/bespoke-choose-activity', function (req, res) {
    res.render(folder + '/bespoke/v1-activities/bespoke-choose-activity',{
      "formAction":"/"+ folder + "/bespoke/v1-activities/select-assessments",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select an assessment for bespoke
router.post('/bespoke/v1-activities/select-assessments', function (req, res) {
    res.render(folder + '/bespoke/v1-activities/select-assessments',{
        "formAction":"/"+ folder + "xxxxxxxxxx",
        "chosenPermitID":req.session.data['chosenPermitID']
    })
})


// Select Bespoke activity permit v2 ===============================================

// Select type - GET
router.get('/bespoke/v2-activities/bespoke-category', function (req, res) {
    res.render(folder + '/bespoke/v2-activities/bespoke-category',{
      "formAction":"/"+ folder + "/bespoke/v2-activities/bespoke-choose-activity",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select type POST version
router.post('/bespoke/v2-activities/bespoke-category', function (req, res) {
    res.render(folder + '/bespoke/v2-activities/bespoke-category',{
      "formAction":"/"+ folder + "/bespoke/v2-activities/bespoke-choose-activity",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select activity page
router.post('/bespoke/v2-activities/bespoke-choose-activity', function (req, res) {
    res.render(folder + '/bespoke/v2-activities/bespoke-choose-activity',{
      "formAction":"/"+ folder + "/bespoke/v2-activities/select-assessments",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select an assessment for bespoke
router.post('/bespoke/v2-activities/select-assessments', function (req, res) {
    res.render(folder + '/bespoke/v2-activities/select-assessments',{
        "formAction":"/"+ folder + "xxxxxxxxxx",
        "chosenPermitID":req.session.data['chosenPermitID']
    })
})


// Select Bespoke activity permit v3 ===============================================

// Select type - GET
router.get('/bespoke/v3-activities/bespoke-category', function (req, res) {
    res.render(folder + '/bespoke/v3-activities/bespoke-category',{
      "formAction":"/"+ folder + "/bespoke/v3-activities/bespoke-choose-activity",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select type POST version
router.post('/bespoke/v3-activities/bespoke-category', function (req, res) {
    res.render(folder + '/bespoke/v3-activities/bespoke-category',{
      "formAction":"/"+ folder + "/bespoke/v3-activities/bespoke-choose-activity",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select activity page
router.post('/bespoke/v3-activities/bespoke-choose-activity', function (req, res) {
    res.render(folder + '/bespoke/v3-activities/bespoke-choose-activity',{
      "formAction":"/"+ folder + "/bespoke/v3-activities/select-assessments",
      "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select an assessment for bespoke
router.post('/bespoke/v3-activities/select-assessments', function (req, res) {
    res.render(folder + '/bespoke/v3-activities/select-assessments',{
        "formAction":"/"+ folder + "/bespoke/v3-activities/summary",
        "chosenPermitID":req.session.data['chosenPermitID']
    })
})

// Select an assessment for bespoke
router.post('/bespoke/v3-activities/summary', function (req, res) {
    res.render(folder + '/bespoke/v3-activities/summary',{
        "formAction":"/"+ folder + '/check/task-list',
        "chosenPermitID":req.session.data['chosenPermitID']
    })
})



// save permit details is an autosubmit page ========================================
// used to store all the data from the matrix
router.post('/check/save-permit-details', function (req, res) {
    res.render(folder + '/check/save-permit-details',{
      "formAction":"/"+ folder + "/check/task-list",
      "chosenPermitID":req.body['chosenPermitID']
    })
})




// Rules page from list ==============================================================

router.get('/start/rules-page', function (req, res) {
  res.render(folder + '/start/rules-page',{
      "chosenPermitID":req.query['chosenPermitID']
  })
})

// This page should not show for long - it just saves permit data
router.get('/check/process-link', function (req, res) {
    res.render(folder + '/check/process-link',{ // show save and return pages
       "formAction":"/"+ folder + "/selectpermit/permit-category2",
       "chosenPermitID":req.query['chosenPermitID']
    })
})


// permit holder screen
router.post('/operator/site-operator', function (req, res) {
  res.render(folder + '/operator/site-operator',{
      "formAction":"/"+ folder + "/operator/checkoperator"
  })
})

 router.get('/operator/site-operator', function (req, res) {
   res.render(folder + '/operator/site-operator',{
       "formAction":"/"+ folder + "/operator/checkoperator"
   })
 })


// before you start pages
router.post('/selectpermit/before-you-start', function (req, res) {
    res.render(folder + '/selectpermit/before-you-start',{
      "formAction":"/"+ folder + "/check/task-list",
       "chosenPermitID":req.body['chosenPermitID']
    })
})



// Check permit via GET route for links
router.get('/check/task-list', function (req, res) {
  if(typeof req.query['chosenPermitID']==='undefined' && typeof     req.query['testmode']==='undefined'  && typeof     req.query['return']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{
        "errorText":"Please select a permit"
    })
  } else if(req.query['testmode']=='y') { // use sample data for permit
    req.session.data = sample.permit
    res.render(folder + '/check/task-list',{
      "formAction":"/"+ folder + "/check/check-answers",
      "chosenPermitID":sample.permit['chosenPermitID'],
      "permit":sample.permit
    })
  } else if(req.query['return']=='y') { // from return or screening email
    res.render(folder + '/check/task-list',{
      "formAction":"/"+ folder + "/check/check-answers"
    })
  } else {
    // save chosen Permit ID in session
    // no form entries to add to session
    res.render(folder + '/check/task-list',{
      "formAction":"/"+ folder + "/check/check-answers",
      "chosenPermitID":req.query['chosenPermitID']
    })
  }
})



// Task List

router.post('/check/task-list', function (req, res) {
    res.render(folder + '/check/task-list',{
       "chosenPermitID":req.body['chosenPermitID']
    })
})

// R & D codes ===========================================================

router.get('/RDcodes/list_recovery_codes', function (req, res) {
  res.render(folder + '/RDcodes/list_recovery_codes',{
    "formAction":"/"+ folder + "/RDcodes/list_disposal_codes"
  })
})

router.get('/RDcodes/list_disposal_codes', function (req, res) {
  res.render(folder + '/RDcodes/list_disposal_codes',{
    "formAction":"/"+ folder + "/check/task-list"
  })
})

// Before you begin ===========================================================

router.post('/returncode/before-you-begin', function (req, res) {
  res.render(folder + '/returncode/before-you-begin',{
    "formAction":"/"+ folder + "/selectpermit/permit-category"
  })
})

router.get('/returncode/continue-application', function (req, res) {
  res.render(folder + '/returncode/continue-application',{
    "formAction":"/"+ folder + "/check/overview"
  })
})

router.get('/returncode/email-code', function (req, res) {
  res.render(folder + '/returncode/email-code',{
    "rtnCode":req.query["rtnCode"]
  })
})

// Download ==============================================================
router.get('/bespoke/download-forms', function (req, res) {
  res.render(folder + '/bespoke/download-forms',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// Call us for costs ==============================================================
router.get('/bespoke/give-cost-and-time', function (req, res) {
  res.render(folder + '/bespoke/give-cost-and-time',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// Cost and time ==============================================================
router.get('/selectpermit/cost-and-time', function (req, res) {
  res.render(folder + '/selectpermit/cost-and-time',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// What you need to apply ==============================================================
router.get('/selectpermit/what-need-to-apply', function (req, res) {
  res.render(folder + '/selectpermit/what-need-to-apply',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// Read rules ===================================================================

router.get('/read-rules/index', function (req, res) {
  res.render(folder + '/read-rules/index',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// Pre-app ===================================================================

router.get('/preapp/preapp-discussion', function (req, res) {
  res.render(folder + '/preapp/preapp-discussion',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})




// Contact ===================================================================

router.get('/contact/contact-details', function (req, res) {
  res.render(folder + '/contact/contact-details',{
      "formAction":"/"+ folder + "/site/site-contact"
  })
})

router.post('/site/site-contact', function (req, res) {
  res.render(folder + '/site/site-contact',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Location check
router.post('/contact/contact-details', function (req, res) {
  if(req.session.data['locationCheck']=="Yes"){
      res.render(folder + '/contact/contact-details',{
          "formAction":"/"+ folder + "/screening/check-your-answers"
      })
  } else {
  res.render(folder + '/contact/contact-details',{
      "formAction":"/"+ folder + "/check/task-list"
   })
  }
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

router.get('/site/site-name', function (req, res) {
  res.render(folder + '/site/site-name',{
      "formAction":"/"+ folder + "/site/grid-reference"
  })
})

router.post('/site/grid-reference', function (req, res) {
  if(req.session.data['locationCheck']=="Yes"){
      res.render(folder + '/site/grid-reference',{
          "formAction":"/"+ folder + "/screening/screening-site-plan"
      })
  } else {
  res.render(folder + '/site/grid-reference',{
      "formAction":"/"+ folder + "/address/postcode"
   })
  }
})

// Location check
router.post('/screening/screening-site-plan', function (req, res) {
  res.render(folder + '/screening/screening-site-plan',{
      "formAction":"/"+ folder + "/screening/site-plan-check"
 })
})

// This is not a real page, just a URL for the route
router.post('/screening/site-plan-check', function (req, res) {
  if(req.body['screeningSitePlan']=="Yes"){
      res.render(folder + '/evidence/upload-site-plan',{
          "formAction":"/"+ folder + "/address/postcode"
      })
  } else {
    res.render(folder + '/screening/distance-to-boundary',{
      "formAction":"/"+ folder + "/address/postcode"
   })
  }
})


router.post('/address/postcode', function (req, res) {
  res.render(folder + '/address/postcode',{
      "formAction":"/"+ folder + "/address/address"
  })
})

// Location check
router.post('/address/address', function (req, res) {
  if(req.session.data['locationCheck']=="Yes"){
    res.render(folder + '/address/address',{
        "formAction":"/"+ folder + "/contact/contact-details"
    })
  } else {
    res.render(folder + '/address/address',{
        "formAction":"/"+ folder + "/check/task-list"
    })
  }
})


// Manual address is a link - so a GET
router.get('/address/address-manual', function (req, res) {
  res.render(folder + '/address/address-manual',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// Upload a site plan ==========================================================

router.get('/evidence/upload-site-plan', function (req, res) {
  res.render(folder + '/evidence/upload-site-plan',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// This is not a real page, just a URL for the route
router.get('/evidence/site-plan-check', function (req, res) {
  if(req.session.data['locationCheck']=="Yes"){
    res.render(folder + '/evidence/make-site-plan',{
      "formAction":"/"+ folder + "/evidence/upload-site-plan"
    })
  } else {
    res.render(folder + '/evidence/upload-site-plan',{
      "formAction":"/"+ folder + "/check/task-list"
   })
  }
})




// Technical ability ==========================================================



router.get('/evidence/techcomp/industry-scheme', function (req, res) {
  res.render(folder + '/evidence/techcomp/industry-scheme',{
      "formAction":"/"+ folder + "/evidence/techcomp/get-evidence"
  })
})

// Not a page - juts a route to process the form
router.post('/evidence/techcomp/get-evidence', function (req, res) {
  if( req.body.industryScheme=='WAMITAB' ) {
    // /evidence/techcomp/wamitab-details
    res.render(folder + '/evidence/techcomp/wamitab-details',{
        "formAction":"/"+ folder + "/evidence/techcomp/check-file"
    })
  } else if( req.body.industryScheme=='ESA-EU' ) {
    // /evidence/techcomp/esa-eu-details
    res.render(folder + '/evidence/techcomp/esa-eu-details',{
        "formAction":"/"+ folder + "/evidence/techcomp/manager-details"
    })
  } else if( req.body.industryScheme=='deemed' ) {
    // /evidence/techcomp/deemed
    res.render(folder + '/evidence/techcomp/deemed',{
        "formAction":"/"+ folder + "/evidence/techcomp/manager-details"
    })
  } else if( req.body.industryScheme=='getting-qualification' ) {
    // /evidence/techcomp/getting-it
    res.render(folder + '/evidence/techcomp/getting-it',{
        "formAction":"/"+ folder + "/evidence/techcomp/manager-details"
    })
  }
})

// Not a page - just a route to process the form
router.post('/evidence/techcomp/check-file', function (req, res) {
      res.render(folder + '/evidence/techcomp/wamitab-details',{
          "formAction":"/"+ folder + "/evidence/techcomp/manager-details"
      })
})

router.get('/evidence/techcomp/manager-details', function (req, res) {
  res.render(folder + '/evidence/techcomp/manager-details',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// The 4 options with GET then go back to task list

router.get('/evidence/techcomp/wamitab-details', function (req, res) {
  res.render(folder + '/evidence/techcomp/wamitab-details',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/techcomp/esa-eu-details', function (req, res) {
  res.render(folder + '/evidence/techcomp/esa-eu-details',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/techcomp/deemed', function (req, res) {
  res.render(folder + '/evidence/techcomp/deemed',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/techcomp/getting-it', function (req, res) {
  res.render(folder + '/evidence/techcomp/getting-it',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Check answers GET
router.get('/evidence/techcomp/industry-check-answer', function (req, res) {
  res.render(folder + '/evidence/techcomp/industry-check-answer',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// EWC waste codes upload =====================================================

router.get('/bespoke/waste-codes', function (req, res) {
  res.render(folder + '/bespoke/waste-codes',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.post('/bespoke/waste-codes', function (req, res) {
  res.render(folder + '/bespoke/waste-codes',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})




// Management system ==========================================================

router.get('/evidence/management-system', function (req, res) {
  res.render(folder + '/evidence/management-system',{
      "formAction":"/"+ folder + "/check/task-list"
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


router.get('/operator/company/company-name', function (req, res) {
  res.render(folder + '/operator/company/company-name',{
      "formAction":"/"+ folder + "/operator/company/check-company-details"
  })
})

router.get('/operator/ll-partnership/limited-liability-partnership', function (req, res) {
  res.render(folder + '/operator/ll-partnership/limited-liability-partnership',{
      "formAction":"/"+ folder + "/operator/ll-partnership/check-llp-details"
  })
})



router.post('/operator/partnerships/postcode', function (req, res) {
  res.render(folder + '/operator/partnerships/postcode',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})



/* limited company API PAGE ====================== */
router.post('/operator/company/check-company-details', function (req, res) {
    request({
        url: 'https://api.companieshouse.gov.uk/search/companies', //URL to hit
        qs: { q:req.body.companyRegNum, items_per_page:99 }, //Query string data
        method: 'GET',
        auth: {'username':process.env.COMP_HOUSE_API_KEY,'password':''},
    }, function(error, response, body){
        if(error) {
            console.log(error)
        } else {
            //console.log(response.statusCode)
            //console.log("=============================")
            //console.log(body)
            //console.log("=============================")
            var companyJSON = JSON.parse(body)
            var company = companyJSON.items[0]
            res.render(folder + '/operator/company/check-company-details',{
                "formAction":"/"+ folder + "/operator/company/go-to-check-officers",
                "company":company,
                "searchTerm":req.body.companyRegNum,
                "numberResults":companyJSON.total_results
            })
        }
    })
})
/* limited liability partnership API PAGE ====================== */

router.post('/operator/ll-partnership/check-llp-details', function (req, res) {
    request({
        url: 'https://api.companieshouse.gov.uk/search/companies', //URL to hit
        qs: { q:req.body.companyRegNum, items_per_page:99 }, //Query string data
        method: 'GET',
        auth: {'username':process.env.COMP_HOUSE_API_KEY,'password':''},
    }, function(error, response, body){
        if(error) {
            console.log(error)
        } else {
            //console.log(response.statusCode)
            //console.log("=============================")
            //console.log(body)
            //console.log("=============================")
            var companyJSON = JSON.parse(body)
            var company = companyJSON.items[0]
            res.render(folder + '/operator/ll-partnership/check-llp-details',{
                "formAction":"/"+ folder + "/operator/ll-partnership/go-to-check-officers",
                "company":company,
                "searchTerm":req.body.companyRegNum,
                "numberResults":companyJSON.total_results
            })
        }
    })
})

// route for link back from company api search results
router.get('/operator/company/company-name', function (req, res) {
  res.render(folder + '/operator/company/company-name',{
      "formAction":"/"+ folder + "/operator/company/go-to-check-officers"
  })
})


/* Company address - NOT USED IN MVP ====================== */

router.post('/operator/company/company-addresses', function (req, res) {
  res.render(folder + '/operator/company/company-addresses',{
      "formAction":"/"+ folder + "/operator/company/go-to-check-officers"
  })
})

/* go-to-check-officers is not a page ====================== */

router.post('/operator/company/company-secretary', function (req, res) {
  res.render(folder + '/operator/company/company-secretary',{
      "formAction":"/"+ folder + "/operator/company/go-to-check-officers"
  })
})

// auto-submitting pass-through page to ensure check officers page is posted
router.post('/operator/company/go-to-check-officers', function (req, res) {
  res.render(folder + '/operator/company/go-to-check-officers',{
      "formAction":"/"+ folder + "/operator/company/check-officers"
  })
})

// auto-submitting pass-through page to ensure check officers page is posted
router.post('/operator/ll-partnership/go-to-check-officers', function (req, res) {
  res.render(folder + '/operator/ll-partnership/go-to-check-officers',{
      "formAction":"/"+ folder + "/operator/ll-partnership/check-officers"
  })
})


/* limited company OFFICERS ====================== */

router.post('/operator/company/check-officers', function (req, res) {

    request({
        url: 'https://api.companieshouse.gov.uk/company/'+req.session.data['companyNumber']+'/officers', //URL to hit
        qs: { items_per_page:99 }, //Query string data
        method: 'GET',
        auth: {'username':process.env.COMP_HOUSE_API_KEY,'password':''},
    }, function(error, response, body){
        if(error) {
            console.log(error)
        } else {
            //console.log(response.statusCode)
            //console.log("=============================")
            //console.log(body)
            //console.log("=============================")
            var officersJSON = JSON.parse(body)
            var officers = officersJSON.items
            res.render(folder + '/operator/company/check-officers',{
                "officers":officers,
                "searchTerm":req.body.companyRegNum,
                "numberResults":officersJSON.total_results,
                "resigned_count":officersJSON.resigned_count,
                "total_results":officersJSON.total_results,
                "active_count":officersJSON.active_count,
                "formAction":"/"+ folder + "/evidence/declare-offences"
            })
        }
    })
})

/* limited liability partnership OFFICERS ====================== */

router.post('/operator/ll-partnership/check-officers', function (req, res) {

    request({
        url: 'https://api.companieshouse.gov.uk/company/'+req.session.data['companyNumber']+'/officers', //URL to hit
        qs: { items_per_page:99 }, //Query string data
        method: 'GET',
        auth: {'username':process.env.COMP_HOUSE_API_KEY,'password':''},
    }, function(error, response, body){
        if(error) {
            console.log(error)
        } else {
            //console.log(response.statusCode)
            //console.log("=============================")
            //console.log(body)
            //console.log("=============================")
            var officersJSON = JSON.parse(body)
            var officers = officersJSON.items
            res.render(folder + '/operator/ll-partnership/check-officers',{
                "officers":officers,
                "searchTerm":req.body.companyRegNum,
                "numberResults":officersJSON.total_results,
                "resigned_count":officersJSON.resigned_count,
                "total_results":officersJSON.total_results,
                "active_count":officersJSON.active_count,
                "formAction":"/"+ folder + "/evidence/declare-offences"
            })
        }
    })
})

router.post('/operator/ll-partnership/officer-email', function (req, res) {

    request({
        url: 'https://api.companieshouse.gov.uk/company/'+req.session.data['companyNumber']+'/officers', //URL to hit
        qs: { items_per_page:99 }, //Query string data
        method: 'GET',
        auth: {'username':process.env.COMP_HOUSE_API_KEY,'password':''},
    }, function(error, response, body){
        if(error) {
            console.log(error)
        } else {
            //console.log(response.statusCode)
            //console.log("=============================")
            //console.log(body)
            //console.log("=============================")
            var officersJSON = JSON.parse(body)
            var officers = officersJSON.items
            res.render(folder + '/operator/ll-partnership/officer-email',{
                "officers":officers,
                "searchTerm":req.body.companyRegNum,
                "numberResults":officersJSON.total_results,
                "resigned_count":officersJSON.resigned_count,
                "total_results":officersJSON.total_results,
                "active_count":officersJSON.active_count,
                "formAction":"/"+ folder + "/evidence/declare-offences"
            })
        }
    })
})


router.get('/operator/company/check-officers', function (req, res) {
  res.render(folder + '/operator/company/check-officers',{
      "formAction":"/"+ folder + "/operator/company/check-officers"
  })
})



/* individual */

router.post('/operator/individual/postcode', function (req, res) {
  res.render(folder + '/operator/individual/postcode',{
      "formAction":"/"+ folder + "/operator/individual/address"
  })
})

router.post('/operator/individual/address', function (req, res) {
  res.render(folder + '/operator/individual/address',{
      "formAction":"/"+ folder + "/operator/individual/check-individual-details"
  })
})

// Manual address is a link - so a GET
router.get('/operator/individual/address-manual', function (req, res) {
  res.render(folder + '/operator/individual/address-manual',{
      "formAction":"/"+ folder + "/operator/individual/check-individual-details"
  })
})

router.post('/operator/individual/check-individual-details', function (req, res) {
  res.render(folder + '/operator/individual/check-individual-details',{
      "formAction":"/"+ folder + "/evidence/declare-offences"
  })
})

/* offences */

router.post('/evidence/declare-offences', function (req, res) {
  res.render(folder + '/evidence/declare-offences',{
      "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency" // previously /evidence/offencescheck
  })
})

// Relevant offences & Bankruptcy insolvency ====================

router.get('/evidence/declare-offences', function (req, res) {
  res.render(folder + '/evidence/declare-offences',{
      "formAction":"/"+ folder + "/evidence/bankruptcy-insolvency" // previously /evidence/offencescheck
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
  res.render(folder + '/evidence/bankruptcy-insolvency',{
      "formAction":"/"+ folder + "/check/task-list"
   })
  }
})

router.post('/evidence/bankruptcy-insolvency', function (req, res) {
  res.render(folder + '/evidence/bankruptcy-insolvency',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/bankruptcy-insolvency', function (req, res) {
  res.render(folder + '/evidence/bankruptcy-insolvency',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Upload B2 and B4 forms ========================================================

router.get('/bespoke/upload-B12-forms', function (req, res) {
  res.render(folder + '/bespoke/upload-B12-forms',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/bespoke/upload-B4-forms', function (req, res) {
  res.render(folder + '/bespoke/upload-B4-forms',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})





// Upload supporting docs ========================================================

router.get('/bespoke/upload-supporting-docs', function (req, res) {
  if(req.session.data['sDocFile2']!="") { // no file uploaded so send to first route
    res.render(folder + '/bespoke/upload-supporting-docs',{
          "formAction":"/"+ folder + "/check-supporting-docs"
    })
  } else { // file uploaded so send to second route
    res.render(folder + '/bespoke/upload-supporting-docs',{
          "formAction":"/"+ folder + "/check-supporting-docs2"
    })
  }

})

// fake route for first check of file uploads
router.post('/check-supporting-docs', function (req, res) {

  // cleanup any blank files - set because hidden field is set on post
  if(req.session.data['sDocFile2']=="") delete req.session.data['sDocFile2']
  if(req.session.data['sDocFile3']=="") delete req.session.data['sDocFile3']
  if(req.session.data['sDocFile4']=="") delete req.session.data['sDocFile4']
  if(req.session.data['sDocFile5']=="") delete req.session.data['sDocFile5']
  if(req.session.data['sDocFile6']=="") delete req.session.data['sDocFile6']
  if(req.session.data['sDocFile7']=="") delete req.session.data['sDocFile7']
  if(req.session.data['sDocFile8']=="") delete req.session.data['sDocFile8']
  if(req.session.data['sDocFile9']=="") delete req.session.data['sDocFile9']

    res.render(folder + '/bespoke/upload-supporting-docs',{
      "formAction":"/"+ folder + "/check-supporting-docs2"
    })
})

// fake route for second check of file uploads
router.post('/check-supporting-docs2', function (req, res) {

  // cleanup any blank files - set because hidden field is set on post
  if(req.session.data['sDocFile2']=="") delete req.session.data['sDocFile2']
  if(req.session.data['sDocFile3']=="") delete req.session.data['sDocFile3']
  if(req.session.data['sDocFile4']=="") delete req.session.data['sDocFile4']
  if(req.session.data['sDocFile5']=="") delete req.session.data['sDocFile5']
  if(req.session.data['sDocFile6']=="") delete req.session.data['sDocFile6']
  if(req.session.data['sDocFile7']=="") delete req.session.data['sDocFile7']
  if(req.session.data['sDocFile8']=="") delete req.session.data['sDocFile8']
  if(req.session.data['sDocFile9']=="") delete req.session.data['sDocFile9']

  if(req.session.data['uploadOtherFile']=="yes"){
    res.render(folder + '/bespoke/upload-supporting-docs',{
      "formAction":"/"+ folder + "/check-supporting-docs2"
    })
  } else {
    // Display task list
    res.render(folder + '/check/task-list',{
        "formAction":"/"+ folder + "/check/task-list"
    })
  }
})

// Remove file from LIST - fake route
router.get('/remove-supporting-doc', nocache, function (req, res) {
    // remove selected file (in query string)
    // stored in req.query.removeFile
    var removeFile = req.query['removeFile']
    var fileNumber  = removeFile.substr(removeFile.length-1, 1)   // last part of sDocFile1
    var titleStr = "sDocTitle"+fileNumber  // eg 2
    var finished = false

    if(req.query['removeFile']!="") {
      // have to repeat deletion as it is stored in both session and locals objects
      delete res.locals.data[removeFile] // remove filename string
          delete req.session.data[removeFile] // remove filename string
      delete res.locals.data[titleStr]   // and remove title string
          delete req.session.data[titleStr]   // and remove title string
      delete res.locals.data.removeFile // clean up
          delete req.session.data.removeFile // clean up
      var finished = true
    }
   console.log(res.locals.data)

    // then re-display page
    if(finished){
      res.render(folder + '/bespoke/upload-supporting-docs',{
        "formAction":"/"+ folder + "/check-supporting-docs"
      })
    }

})


// Remove B2 file from LIST - fake route
router.get('/remove-b2', nocache, function (req, res) {
    // remove selected file (in query string)
    // stored in req.query.removeFile
    var removeFile = req.query['removeFile']

    if(req.query['removeFile']!="") {
      // have to repeat deletion as it is stored in both session and locals objects
      delete res.locals.data[removeFile] // remove filename string
          delete req.session.data[removeFile] // remove filename string
      delete res.locals.data.removeFile // clean up
          delete req.session.data.removeFile // clean up
      var finished = true
    }

    // then re-display page
    if(finished){
      res.render(folder + '/bespoke/upload-B2-forms',{
        "formAction":"/"+ folder + "/check/task-list"
      })
    }

})

// Remove B4 file from LIST - fake route
router.get('/remove-b4', nocache, function (req, res) {
    // remove selected file (in query string)
    // stored in req.query.removeFile
    var removeFile = req.query['removeFile']

    if(req.query['removeFile']!="") {
      // have to repeat deletion as it is stored in both session and locals objects
      delete res.locals.data[removeFile] // remove filename string
          delete req.session.data[removeFile] // remove filename string
      delete res.locals.data.removeFile // clean up
          delete req.session.data.removeFile // clean up
      var finished = true
    }

    // then re-display page
    if(finished){
      res.render(folder + '/bespoke/upload-B4-forms',{
        "formAction":"/"+ folder + "/check/task-list"
      })
    }

})

// Remove any from LIST - fake route
router.get('/remove-file', nocache, function (req, res) {
    // remove selected file (in query string)
    // stored in req.query.removeFile
    var removeFile = req.query['removeFile']
    var returnPath = req.query['returnPath']

    if(req.query['removeFile']!="") {
      // have to repeat deletion as it is stored in both session and locals objects
      delete res.locals.data[removeFile] // remove filename string
          delete req.session.data[removeFile] // remove filename string
      delete res.locals.data.removeFile // clean up
          delete req.session.data.removeFile // clean up
      var finished = true
    }

    // then re-display page
    if(finished){
      res.render(folder + returnPath,{
        "formAction":"/"+ folder + "/check/task-list"
      })
    }

})


// Fire prevention plan ========================================================

router.get('/evidence/upload-fire-plan', function (req, res) {
  res.render(folder + '/evidence/upload-fire-plan',{
        "formAction":"/"+ folder + "/check-fire-plan"
    })
})

// fake route for first check of file uploads
router.post('/check-fire-plan', function (req, res) {
    res.render(folder + '/evidence/upload-fire-plan',{
      "formAction":"/"+ folder + "/check-fire-plan2"
    })
})

// fake route for second check of file uploads
router.post('/check-fire-plan2', function (req, res) {
  if(req.session.data['uploadOtherFile']=="yes"){
    res.render(folder + '/evidence/upload-fire-plan',{
      "formAction":"/"+ folder + "/check-fire-plan2"
    })
  } else {
    // Display task list
    res.render(folder + '/check/task-list',{
        "formAction":"/"+ folder + "/check/task-list"
    })
  }
})

// Claim confidentiality ========================================================

router.get('/check/claim-confidentiality', function (req, res) {
  res.render(folder + '/check/claim-confidentiality',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Invoicing / billing ========================================================



// This is not a real page, just a URL for the route
router.get('/billing/invoice-options-check', function (req, res) {
   if( req.session.data['siteAddress']==null && req.session.data['companyAddress']==null ) {
       res.render(folder + '/billing/invoice-postcode',{
       "formAction":"/"+ folder + "/billing/invoice-address"
       })
   } else {
       res.render(folder + '/billing/invoice-address-options',{
       "formAction":"/"+ folder + "/billing/invoice-option"
    })
   }
 })

// This is not a real page, just a URL for the route
// Give a different invoice address or select registered office / site address
router.post('/billing/invoice-option', function (req, res) {
   if( req.session.data['invoiceAddress'] == "Different address" ) {
       res.render(folder + '/billing/invoice-postcode',{
       "formAction":"/"+ folder + "/billing/invoice-address"
       })
   } else {
       res.render(folder + '/billing/invoice-contact',{
       "formAction":"/"+ folder + "/check/task-list"
    })
   }
 })

router.get('/billing/invoice-postcode', function (req, res) {
  res.render(folder + '/billing/invoice-postcode',{
      "formAction":"/"+ folder + "/billing/invoice-address"
  })
})


router.post('/billing/invoice-postcode', function (req, res) {
  res.render(folder + '/billing/invoice-postcode',{
      "formAction":"/"+ folder + "/billing/invoice-address"
  })
})

router.post('/billing/invoice-address', function (req, res) {
  res.render(folder + '/billing/invoice-address',{
      "formAction":"/"+ folder + "/billing/invoice-contact"
  })
})

router.post('/billing/invoice-contact', function (req, res) {
  res.render(folder + '/billing/invoice-contact',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

// Submit and pay ======================================================
router.get('/check/declaration', function (req, res) {
  res.render(folder + '/check/declaration',{
        "formAction":"/"+ folder + "/pay/payment-method"
    })
})

router.post('/check/declaration', function (req, res) {
  res.render(folder + '/check/declaration',{
      "formAction":"/"+ folder + "/pay/payment-method"
  })
})

// Special cases ==============================================================

router.get('/check-special-cases', function (req, res) {
  var nextPage =  "/check/task-list" // the next page after the special case pages with slash

  // check if there is a special case for this permit
  if(req.session.data['permitID'] == "SR-2009-4"){
    res.render(folder + '/specialcases/sr-2009-4',{
        "formAction":"/"+ folder + nextPage
    })
  } else if (req.session.data['permitID'] == "SR-2010-2") {
    res.render(folder + '/specialcases/sr-2010-2_3',{
        "formAction":"/"+ folder + nextPage
    })
  } else if (req.session.data['permitID'] == "SR-2010-3") {
    res.render(folder + '/specialcases/sr-2010-2_3',{
        "formAction":"/"+ folder + nextPage
    })
  } else if (req.session.data['permitID'] == "SR-2014-2") {
    res.render(folder + '/specialcases/sr-2014-2',{
        "formAction":"/"+ folder + nextPage
    })
  } else if (req.session.data['permitID'] == "SR-2015-13") {
    res.render(folder + '/specialcases/sr-2015-17_18',{
        // send to a page for routes
        "formAction":"/"+ folder + "/specialcases/check-sr-2015-17_18"
    })
  } else if (req.session.data['permitID'] == "SR-2015-17") {
    res.render(folder + '/specialcases/sr-2015-17_18',{
        // send to a page for routes
        "formAction":"/"+ folder + "/specialcases/check-sr-2015-17_18"
    })
  } else if (req.session.data['permitID'] == "SR-2015-18") {
    res.render(folder + '/specialcases/sr-2015-17_18',{
        // send to a page for routes
        "formAction":"/"+ folder + "/specialcases/check-sr-2015-17_18"
    })
  } else if (req.session.data['permitID'] == "SR-2015-39") {
    res.render(folder + '/specialcases/sr-2015-39',{
        "formAction":"/"+ folder + nextPage
    })
  } else { // NO SPECIAL CASES
    res.redirect('/'+folder+'/check/overview')
  }
})

// Mining waste plan for 2009-8 =========================================================

router.get('/specialcases/2009-8/sr-2009-8', function (req, res) {
  res.render(folder + '/specialcases/2009-8/sr-2009-8',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Vehicle storage drainage =========================================================

// This is not a real page, just a URL for the route
router.post('/specialcases/check-sr-2015-17_18', function (req, res) {
  if(req.body['drainage']=="a water body"){ // think you need square bracket for radios
    // show Contact us page
      res.render(folder + '/specialcases/sr-2015-17_18-contact-us',{
      })
  } else if(req.session.data['permitID'] == "SR-2015-13" && req.body['drainage']=="an interceptor"){ // think you need square bracket for radios
    // show Contact us page
      res.render(folder + '/specialcases/sr-2015-17_18-contact-us',{
      })
  } else {
   res.render(folder + '/check/task-list',{
    })
  }
})


// Check answers ===================================================================

router.get('/check/check-answers', function (req, res) {
  res.render(folder + '/check/check-answers',{
      "formAction":"/"+ folder + "/pay/enter-card-details"
  })
})

router.post('/check/check-answers', function (req, res) {
  var payPath = ""
  if(paymentMethod=="govpay"){  // yes I know this is ugly
    payPath = "/pay/payment-method"
  }
  if(paymentMethod=="worldpay"){
    payPath = "/pay/payment-method"
  }

  if(req.body['complete']=="" || req.body['complete']==null){
    res.render(folder + '/check/check-answers',{
        // "formAction":"/"+ folder + "/pay/payment-method", THIS WAS FOR PAYMENT METHOD
        "formAction":"/"+ folder + payPath
    })
  } else {
    var taskListError = true
    // show error
    // instead of /check/not-complete, render task list again
    res.render(folder + '/check/task-list',{
        'taskListError': taskListError,
        // "formAction":"/"+ folder + "/check/task-list"
    })
  }
})

router.get('/check/not-complete', function (req, res) {
  res.render(folder + '/check/not-complete',{
  })
})


// Sections: check your answers

router.get('/preapp/check-your-answers', function (req, res) {
  res.render(folder + '/preapp/check-your-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/contact/check-your-answers', function (req, res) {
  res.render(folder + '/contact/check-your-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/operator/check-your-answers', function (req, res) {
  res.render(folder + '/operator/check-your-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/site/check-your-answers', function (req, res) {
  res.render(folder + '/site/check-your-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/site/site-plan-check-your-answers', function (req, res) {
  res.render(folder + '/site/site-plan-check-your-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/industry-check-answers', function (req, res) {
  res.render(folder + '/evidence/industry-check-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/management-check-answers', function (req, res) {
  res.render(folder + '/evidence/management-check-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/evidence/fire-plan-check-answers', function (req, res) {
  res.render(folder + '/evidence/fire-plan-check-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/check/confidentiality-check-answers', function (req, res) {
  res.render(folder + '/check/confidentiality-check-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})

router.get('/billing/check-your-answers', function (req, res) {
  res.render(folder + '/billing/check-your-answers',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Pay ===================================================================

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

// ENTER CARD DETAILS
router.post('/pay/enter-card-details', function (req, res) {
  res.render(folder + '/pay/enter-card-details',{
      "formAction":"/"+ folder + "/pay/confirm-payment"
  })
})

router.post('/pay/confirm-payment', function (req, res) {
  res.render(folder + '/pay/confirm-payment',{
      "formAction":"/"+ folder + "/done/index"
  })
})


// for worldpay instead of gov pay
router.get('/pay/worldpay/worldpay-card-details', function (req, res) {
  res.render(folder + '/pay/worldpay/worldpay-card-details',{
      "formAction":"/"+ folder + "/pay/worldpay/worldpay-success"
  })
})

router.get('/pay/worldpay/worldpay-success', function (req, res) {
  res.render(folder + '/pay/worldpay/worldpay-success',{
      "formAction":"/"+ folder + "/done/index" // previously /printcopy/index
  })
})



// Get copy of application

router.post('/printcopy/index', function (req, res) {
  res.render(folder + '/printcopy/index',{
      "formAction":"/"+ folder + "/done/index"
  })
})

// fake PDF
router.get('/printcopy/app-pdf', function (req, res) {
  res.render(folder + '/printcopy/app-pdf',{
  })
})

router.post('/done/index', function (req, res) {
  res.render(folder + '/done/index',{
      "formAction":"NOT_NEEDED"
  })
})

// /v2/done/email-confirm Confirmation email

router.get('/done/email-confirm', function (req, res) {
  res.render(folder + '/done/email-confirm',{
      "formAction":"NOT_NEEDED"
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

router.get('/search-permit/sr-permits', function (req, res) {
    res.render(folder + '/search-permit/sr-permits',{
      "formAction":"/"+ folder + "/search-permit/sr-permits"
    })
})

router.post('/search-permit/sr-permits', function (req, res) {
    res.render(folder + '/search-permit/sr-permits',{
      "formAction":"/"+ folder + "/search-permit/sr-permits",
      "searchTerm":req.body.searchTerm
    })
})



var wc = require('which-country');

// England lat long check
router.get('/site/grid-reference-eng', function (req, res) {
  res.render(folder + '/site/grid-reference-eng',{
     "formAction":"/"+ folder + "/site/grid-reference-eng"
  })
})
router.post('/site/grid-reference-eng', function (req, res) {
  var lat = req.body['lat']
  var lng = req.body['lng']
  var siteGridRef = req.body['siteGridRef']
  var country="NOT SET"
  country = wc([lng, lat])
  if(country==null) country="NOT-ENG"
  console.log('Country started')
  console.log(country)
  res.render(folder + '/site/grid-reference-eng',{
     "formAction":"/"+ folder + "/site/grid-reference-eng",
     "country": country,
     "siteGridRef":siteGridRef
  })
})




// Screening test ####################################################

router.get('/testscreen/index', function (req, res) {
  res.render(folder + '/testscreen/index',{
     "formAction":"/"+ folder + "/testscreen/choose-permit"
  })
})

router.post('/testscreen/choose-permit', function (req, res) {
  res.render(folder + '/testscreen/choose-permit',{
     "formAction":"/"+ folder + "/testscreen/grid-reference"
  })
})

router.post('/testscreen/grid-reference', function (req, res) {
  res.render(folder + '/testscreen/grid-reference',{
     "formAction":"/"+ folder + "/testscreen/check-map"
  })
})

router.post('/testscreen/check-map', function (req, res) {
  res.render(folder + '/testscreen/check-map',{
     "formAction":"/"+ folder + "/testscreen/check-location"
  })
})

// Function to assemble query string
function makeGISQuery(type,lat,long,distance){
  var s1 = "https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/"
  var s2 = "/FeatureServer/0/query?where=1%3D1&outFields=*&geometry="
  var s3 = "%2C"
  var s4 = "&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance="
  var s5 = "&units=esriSRUnit_Meter&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
  var URLString = s1+type+s2+long+s3+lat+s4+distance+s5
  return URLString
}

function doScreening(type, lat, long, distance) {

  return new Promise(function(resolve, reject) {

    request({
      url: makeGISQuery(type, lat, long, distance),
      method: "GET"
    }, function (error, response, body) {
       if (error){
         console.log(error)
       } else {
          var responseJSON = JSON.parse(body)
          numSites=responseJSON.count
          resolve(numSites)
       } // end request
    }) // end request

  }) // end promise

} // end function

// router.post('/testscreen/check-location', function (req, res) {
//   var screening = req.body['screening']
//   var lat = req.body['lat']
//   var long = req.body['long']
//   var gridref = req.body['gridref']
//   var distance = req.body['distance']
//
//   var screeningTypes = [
//     {name:"Special Conservation Area", url:"Special_Areas_of_Conservation_England"},
//     {name:"Proposed Ramsar site", url:"Proposed_Ramsar_England"},
//     {name:"Area of Outstanding Natural Beauty", url:"Areas_of_Outstanding_Natural_Beauty_England"},
//     {name:"Special Protection Area", url:"Special_Protection_Areas_England"},
//     {name:"Ramsar site", url:"Ramsar_England"},
//     {name:"Site of Special Scientific Interest", url:"SSSI_England"}
//   ]
//
//   var screeningResults = []
//
//   async function getResults() {
//     await Promise.all(screeningTypes.map(async (type) => {
//       screeningResults[type.name] = doScreening(type.url, lat, long, distance)
//     }))
//   }
//
//   getResults()
//
//   if(screeningResults.length>2){
//     console.info(screeningResults)
//     res.render(folder + '/testscreen/check-location',{
//       "screening": screening,
//       "lat": lat,
//       "long": long,
//       "gridref": gridref,
//       "distance": distance,
//       "formAction":"/"+ folder + "/testscreen/check-location",
//       "screeningResults": screeningResults
//     })
//   }
//
//
// }) // end post


// Send permit data in session to every page ==================================
router.all('*', function (req, res, next) {
  res.locals.permit=res.locals.data
  next()
})


module.exports = router
