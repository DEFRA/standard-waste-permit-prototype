module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  var filters = {}

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  filters.nl2br = function(textStr) {
      return textStr.replace(/\r|\n|\r\n/g, '<br />')
  }
  
  filters.typeof = function(textStr) {
      return typeof textStr
  }
  
  filters.formatnumber = function(num) {
      var formattedNum = num.toLocaleString('en',{ style: 'currency', currency: 'GBP' })
      var returnNum = formattedNum
      if(formattedNum.endsWith(".00")) returnNum = formattedNum.substring( 0, (formattedNum.length-3) )
      return returnNum
  }

  filters.reverseName = function(textStr) {
     var parts = textStr.split(',')
     if(parts[1]===undefined){
       return parts[0]
     } else {
       return parts[1] + ' ' + parts[0]
     }
   }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
