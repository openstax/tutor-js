_ = require 'underscore'
React = require 'react'

NO_PERIODS_TEXT = 'Please add at least one period to the course.'

NoPeriods = React.createClass

  render: ->
    <span className='-no-periods-text'>{NO_PERIODS_TEXT}</span>

module.exports = NoPeriods
