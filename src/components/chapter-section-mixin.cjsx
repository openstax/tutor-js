
module.exports =
  getInitialState: ->
    sectionSeparator: '.'

  sectionFormat: (section, separator) ->
    if section instanceof Array
      subsection = if section[1]? then separator + section[1] else ''
      section[0] + subsection
    else
      section
