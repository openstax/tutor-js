_ = require 'underscore'

module.exports =
  getDefaultProps: ->
    error: ''
    maxLength: 20

  validatePeriodName: (name, periods) ->
    {error, maxLength} = @props
    for period in periods
      if period.name is name
        error = 'Period name already exists.'
    if not name? or name is ''
      error = 'Period name is required.'
    if name?.length > maxLength
      error = "Period name must be #{maxLength} characters or less."
    if not error and name?.match(/[^A-Z0-9-.]+/ig)
      error = "Period name must contain only letters, numbers, periods or hyphens."
    {error}
