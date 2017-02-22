_ = require 'underscore'

SMALL_WORDS = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i

module.exports = {

  ellipsis: (string, maxlen) ->
    if string and string.length > maxlen
      string.substring(0, maxlen) + '…'
    else
      string

  capitalize: (string, lowerOthers = true) ->
    other = if lowerOthers then string.substring(1).toLowerCase() else string.substring(1)
    string.charAt(0).toUpperCase() + other

  replaceAt: (string, index, character) ->
    string.substr(0, index) + character + string.substr(index + character.length)

  insertAt: (string, index, character) ->
    string.substr(0, index) + character + string.substr(index)

  removeAt: (string, index, length = 1) ->
    string.substr(0, index) + string.substr(index + length)

  getNumberAndStringOrder: (string) ->
    parsedInt = parseFloat(string)
    if _.isNaN(parsedInt) then string.toLowerCase() else parsedInt

  # from http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
  dasherize: (string) ->
    string.replace(/\W+/g, '').replace /([A-Z])/g, ($1) -> "-#{$1.toLowerCase()}"

  # originated from http://individed.com/code/to-title-case/
  titleize: (string = '') ->
    string
      .replace(/_/g, ' ')
      .replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match, index, title) ->
        if index > 0 and index + match.length isnt title.length and
        match.search(SMALL_WORDS) > -1 and
        title.charAt(index - 2) isnt ":" and
        ( title.charAt(index + match.length) isnt '-' or title.charAt(index - 1) is '-' ) and
        title.charAt(index - 1).search(/[^\s-]/) < 0

          return match.toLowerCase()

        if match.substr(1).search(/[A-Z]|\../) > -1
          return match

        return match.charAt(0).toUpperCase() + match.substr(1)
  )
}
