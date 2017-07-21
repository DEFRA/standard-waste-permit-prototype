/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
  window.sessionStorage.setItem('prototypeWarning', true)
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

    

  $(".linkalert a").on("click", function(e) {
      var link = this;

      e.preventDefault();

      $("<div>Are you sure you want to continue?</div>").dialog({
          buttons: {
              "Ok": function() {
                  window.location = link.href;
              },
              "Cancel": function() {
                  $(this).dialog("close");
              }
          }
      });
  });


})
