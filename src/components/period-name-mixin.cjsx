_ = require 'underscore'

module.exports =
  getDefaultProps: ->
    valid: true
    error: ''
    maxLength: 20

  validatePeriodName: (name, periods) ->
    {valid, error, maxLength} = @props
    for period in periods
      if period.name is name
        valid = false
        error = 'Period name already exists.'
    if not name? or name is ''
      valid = false
      error = 'Period name is required.'
    if name?.length > maxLength
      valid = false
      error = "Period name must be #{maxLength} characters or less."
    if valid and name?.match(/[^A-Z0-9-.]+/ig)
      valid = false
      error = "Period name must contain only letters, numbers, periods or hyphens."
    {valid, error}
