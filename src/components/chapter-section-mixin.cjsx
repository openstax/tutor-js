_ = require 'underscore'

module.exports =
  getInitialState: ->
    sectionSeparator: '.'

  sectionFormat: (section, separator) ->
    # prevent mutation
    section = _.clone(section)
    # ignore 0 in chapter sections
    section.pop() if _.last(section) is 0

    if section instanceof Array
      subsection = if section[1]? then separator + section[1] else ''
      section[0] + subsection
    else
      section
