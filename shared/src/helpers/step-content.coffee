_ = require 'underscore'

defaultSettings =
  sectionSeparator: '.'
  skipZeros: true
  inputStringSeparator: '.'

stepContentHelper =
  defaults:
    defaultSettings

  formatSection: (section, separator, settings = defaultSettings) ->
    {inputStringSeparator, skipZeros, sectionSeparator} = settings

    if _.isString(section)
      sectionArray = section.split(inputStringSeparator)

    sectionArray = section if _.isArray(section)
    # prevent mutation
    sectionArray = _.clone(sectionArray)
    # ignore 0 in chapter sections
    sectionArray.pop() if skipZeros and _.last(sectionArray) is 0

    if sectionArray instanceof Array
      sectionArray.join(separator or sectionSeparator)
    else
      section

module.exports = stepContentHelper
