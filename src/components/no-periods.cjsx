_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

NO_PERIODS_TEXT = 'Please add at least one period to the course.'

NoPeriods = React.createClass

  render: ->
    <BS.Panel>
      <span className='-no-periods-text'>{NO_PERIODS_TEXT}</span>
    </BS.Panel>

module.exports = NoPeriods
