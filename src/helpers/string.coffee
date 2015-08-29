_ = require 'underscore'

module.exports = {

  capitalize: (string) ->
    string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()

  getNumberAndStringOrder: (string) ->
    parsedInt = parseFloat(string)
    if _.isNaN(parsedInt) then string.toLowerCase() else parsedInt

}
