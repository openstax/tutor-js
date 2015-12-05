_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

NO_PERIODS_TEXT = 'Please add at least one period to the course.'

NoPeriods = React.createClass

  propTypes:
    noPanel:   React.PropTypes.bool

  render: ->
    text = <span className='-no-periods-text'>{NO_PERIODS_TEXT}</span>
    if @props.noPanel
      text
    else
      <BS.Panel>
        {text}
      </BS.Panel>

module.exports = NoPeriods
