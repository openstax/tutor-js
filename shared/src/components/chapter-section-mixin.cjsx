{formatSection, defaults} = require '../helpers/step-content'

module.exports =
  getDefaultProps: ->
    defaults

  sectionFormat: (section, separator) ->
    formatSection(section, separator, @props)
