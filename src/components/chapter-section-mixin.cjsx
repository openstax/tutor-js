_ = require 'underscore'

module.exports =
  getInitialState: ->
    sectionSeparator: '.'
    skipZeros: true
    inputStringSeparator: '.'

  sectionFormat: (section, separator) ->
    {inputStringSeparator, skipZeros, sectionSeparator} = @state

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
