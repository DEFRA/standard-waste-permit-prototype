/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
  
  // On pages with multiple details, close all when new one is opened
  $('details.closeOnOpen').click(function(){
    $('details.closeOnOpen').not(this).removeAttr('open');
  })
  
  $( "form#autoSubmit" ).submit();
  
  // Set complete later link to submit form
  $( "#completeLater" ).click(function() {
    $( "form" ).submit()
    // event.preventDefault()
  });

  // Hide new tab span
  //$("span.newtab").toggleClass('visually-hidden');
  // Show new tab message on click
  //$("a[target='_blank']").one("click", function(e){
  //    e.preventDefault();
  //    $(this).blur();
  //    $(this).children( 'span.newtab' ).toggleClass('visually-hidden').addClass('bold-small');
  //});

})
