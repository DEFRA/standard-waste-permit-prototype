var express = require('express')
var router = express.Router()

var request = require('request')

// this file deals with all paths starting /version_x
// How to use folder variable:
// res.redirect( '/' + folder + '/exemptions/add_exemptions');
var folder = "v7";
var servicename = "Apply for a standard rules waste permit";

var sample = require('./views/'+folder+'/custom_inc/sample-permit.js')
//console.log(sample.permit)


var backlink = '<a href="javascript:history.back()" class="link-back">Back</a>'

router.use(function (req, res, next) {
  // set a folder and store in locals
  // this can then be used in pages as {{folder}}
  res.locals.folder=folder
  res.locals.backlink=backlink
  // permit and autostore data set in all statement at bottom
  res.locals.permit=res.locals.data
  
  next()
});

// CLEAR SESSION ==============================================================
router.get('/cls', function (req, res) {
  req.session.destroy()
  res.render('index')
})


var wc = require('which-country-ea');

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

// Rules page from list ==============================================================

router.get('/start/rules-page', function (req, res) {
  res.render(folder + '/start/rules-page',{
      "chosenPermitID":req.query['chosenPermitID']
  })
})

// This page should not show for long - it just saves permit data
router.get('/check/process-link', function (req, res) {
    res.render(folder + '/check/process-link',{ // show save and return pages
       "formAction":"/"+ folder + "/start/start-or-resume",
       "chosenPermitID":req.query['chosenPermitID']
    })
})

// Start or resume ==============================================================

router.get('/start/start-or-resume', function (req, res) {
  res.render(folder + '/start/start-or-resume',{
      "formAction":"/"+ folder + "/selectpermit/permit-category2"
  })
})

router.post('/start/start-or-resume', function (req, res) {
  res.render(folder + '/start/start-or-resume',{
      "formAction":"/"+ folder + "/selectpermit/permit-category2"
  })
})

// This is not a real page, just a URL for the route
router.post('/save-and-return/save-choice', function (req, res) {
  if(req.body['started-application']=="no"){ // think you need square bracket for radios
      res.render(folder + '/save-and-return/email-or-phone',{
          "formAction":"/"+ folder + "/save-and-return/confirm"
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
  res.render(folder + '/save-and-return/sent',{
    "formAction":"/"+ folder + "/selectpermit/permit-category2"
  })
})


router.get('save-and-return/email-save-link', function (req, res) {
  res.render(folder + 'save-and-return/email-save-link',{
  })
})



// Select permit ==============================================================

// Expanding section method

// required for 'select a different permit' via task list
router.get('/selectpermit/permit-category2', function (req, res) {
    res.render(folder + '/selectpermit/permit-category2',{
      "formAction":"/"+ folder + "/selectpermit/choose-permit2",
      "chosenPermitID":req.body['chosenPermitID']
    }) 
})

// The POST version
router.post('/selectpermit/permit-category2', function (req, res) {
    // permit NOT YET selected
    if( req.session.data['chosenPermitID']==null ) {
      res.render(folder + '/selectpermit/permit-category2',{
        "formAction":"/"+ folder + "/selectpermit/choose-permit2"
      })
    // permit set via link on a GOV.UK page so skip this page
    } else {
      res.render(folder + '/check/task-list',{ // show save and return pages
         "formAction":"/"+ folder + "/check/check-answers",
         "chosenPermitID":req.body['chosenPermitID']
      })
    }
})


// Alternative category page
router.post('/selectpermit/choose-expanding-sections-new-cats', function (req, res) {
    // permit NOT YET selected
    if( req.session.data['chosenPermitID']==null ) {
      res.render(folder + '/selectpermit/choose-expanding-sections-new-cats',{
        "formAction":"/"+ folder + "/check/save-permit-details"
      })
    // permit set via link on a GOV.UK page so skip this page
    } else {
      res.render(folder + '/check/task-list',{ // show save and return pages
         "formAction":"/"+ folder + "/check/check-answers",
         "chosenPermitID":req.body['chosenPermitID']
      })
    }
})

// required for 'select a different permit' via task list
router.get('/selectpermit/choose-expanding-sections-new-cats', function (req, res) {
    res.render(folder + '/selectpermit/choose-expanding-sections-new-cats',{
      "formAction":"/"+ folder + "/check/save-permit-details",
      "chosenPermitID":req.body['chosenPermitID']
    }) 
})


// This page should not show for long - it just saves permit data
router.post('/check/save-permit-details', function (req, res) {
      res.render(folder + '/check/save-permit-details',{
        "formAction":"/"+ folder + "/check/task-list",
        "chosenPermitID":req.body['chosenPermitID']
      })
})


router.post('/check/task-list', function (req, res) {
  if( res.locals.data.saveProgress=='task-list-visited' ) {
    // Show save screen
    res.render(folder + '/save-and-return/email-or-phone',{
        "formAction":"/"+ folder + "/save-and-return/confirm"
    })
  } else {
    // Show task list
    res.render(folder + '/check/task-list',{ 
       "chosenPermitID":req.body['chosenPermitID']
    })
  }
})

// Called by task list page via AJAX to log the first visit
router.get('/task-list-visit', function (req, res) {
  // if this is the first visit, 'saveProgress' will be set to started-application
  if(req.session.data.saveProgress='started-application'){
    req.session.data.saveProgress='task-list-visited'
  }
  res.sendStatus(200)
})


// Check permit via GET route for links
router.get('/check/task-list', function (req, res) {
  if(typeof req.query['chosenPermitID']==='undefined' && typeof     req.query['testmode']==='undefined'){  // simple error handling
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
  } else {
    // save chosen Permit ID in session
    // no form entries to add to session 
    res.render(folder + '/check/task-list',{
      "formAction":"/"+ folder + "/check/check-answers",
      "chosenPermitID":req.query['chosenPermitID']
    })
  }
})



// Category method
router.post('/selectpermit/permit-category', function (req, res) {
  res.render(folder + '/selectpermit/permit-category',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit"
  })
})

// also a get
router.get('/selectpermit/permit-category', function (req, res) {
  res.render(folder + '/selectpermit/permit-category',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit"
  })
})

router.post('/selectpermit/permit-category2', function (req, res) {
  res.render(folder + '/selectpermit/permit-category2',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit2"
  })
})

// also a get
router.get('/selectpermit/permit-category2', function (req, res) {
  res.render(folder + '/selectpermit/permit-category2',{
    "formAction":"/"+ folder + "/selectpermit/choose-permit2"
  })
})


router.post('/selectpermit/choose-permit', function (req, res) {
  if(typeof req.body['chosenCategory']==='undefined'){  // simple error handling
    res.render(folder + '/error/index',{ 
        "errorText":"Please say what you want the permit for"
    })
  } else {
    res.render(folder + '/selectpermit/choose-permit',{
      "formAction":"/"+ folder + "/check/save-permit-details",
      "chosenCategory":req.body['chosenCategory']
    })    
  }
})

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


// Screening =================================================================

router.get('/screening/conservation-screening', function (req, res) {
  res.render(folder + '/screening/conservation-screening',{
      "formAction":"/"+ folder + "/check/task-list"
  })
})


// Contact ===================================================================

router.get('/contact/contact-details', function (req, res) {
  res.render(folder + '/contact/contact-details',{
      "formAction":"/"+ folder + "/check/task-list"
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
      "formAction":"/"+ folder + "/site/grid-reference"
  })
})

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
      "formAction":"/"+ folder + "/check/task-list"
  })
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


// Technical ability ==========================================================

router.get('/evidence/industry-scheme', function (req, res) {
  res.render(folder + '/evidence/industry-scheme',{
      "formAction":"/"+ folder + "/evidence/upload-scheme-certificate"
  })
})

router.post('/evidence/upload-scheme-certificate', function (req, res) {
  res.render(folder + '/evidence/upload-scheme-certificate',{
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

router.get('/operator/site-operator', function (req, res) {
  res.render(folder + '/operator/site-operator',{
      "formAction":"/"+ folder + "/operator/checkoperator"
  })
})

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
  } else if (req.body['operatorType']=="Individual") {
    // show individual page
      res.render(folder + '/operator/individual/individual-details',{
          "formAction":"/"+ folder + "/operator/individual/postcode"
      })
  } else {
    // go on to error
    res.render(folder + '/error/index',{ 
        "errorText":"We only cover limited companies and individuals in this prototype"
    })
  }
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
                "formAction":"/"+ folder + "/operator/company/check-officers",
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
      "formAction":"/"+ folder + "/operator/company/check-company-details"
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
      "formAction":"/"+ folder + "/evidence/offencescheck"
  })
})

// Relevant offences & Bankruptcy insolvency ====================

router.get('/evidence/declare-offences', function (req, res) {
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


// Fire prevention plan ========================================================

router.get('/evidence/upload-fire-plan', function (req, res) {
  res.render(folder + '/evidence/upload-fire-plan',{ 
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


// Claim confidentiality ========================================================

router.get('/check/claim-confidentiality', function (req, res) {
  res.render(folder + '/check/claim-confidentiality',{
      "formAction":"/"+ folder + "/check/task-list"
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
  } else if (req.session.data['permitID'] == "SR-2009-8") {
    res.render(folder + '/specialcases/sr-2009-8',{
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


// Vehicle storage drainage =========================================================

// This is not a real page, just a URL for the route
router.post('/specialcases/check-sr-2015-17_18', function (req, res) {
  if(req.body['drainage']=="Water body"){ // think you need square bracket for radios
    // show Water body question
      res.render(folder + '/specialcases/sr-2015-17_18-waterbody',{
          "formAction":"/"+ folder + "/specialcases/check-waterbody"
      })
  } else {
   res.render(folder + '/check/task-list',{
    })
  }
})

// This is not a real page, just a URL for the route
router.post('/specialcases/check-waterbody', function (req, res) {
  if(req.body['waterBodyDrainage']=="No"){ // think you need square bracket for radios
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
  if(req.body['complete']=="" || req.body['complete']==null){ 
    res.render(folder + '/check/check-answers',{
        // "formAction":"/"+ folder + "/pay/payment-method", THIS WAS FOR PAYMENT METHOD
        "formAction":"/"+ folder + "/pay/enter-card-details"
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
      "formAction":"/"+ folder + "/printcopy/index"
  })
})

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

// Send permit data in session to every page ==================================
router.all('*', function (req, res, next) {
  res.locals.permit=res.locals.data
  next()
});


module.exports = router
