_ = require 'underscore'
React = require 'react'
classnames = require 'classnames'
WindowHelper = require '../helpers/window'

CountdownRedirect = React.createClass

  getDefaultProps: ->
    secondsDelay: 10
    message: "Redirecting"
    windowImpl: window
    redirectType: 'replace'

  getInitialState: ->
    secondsRemaining: @props.secondsDelay

  propTypes:
    delay: React.PropTypes.number
    className: React.PropTypes.string
    destinationUrl: React.PropTypes.string.isRequired
    redirectType: React.PropTypes.oneOf(['replace', 'assign'])
    message: React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.element
    ])

  onCounterTick: ->
    secondsRemaining = @state.secondsRemaining - 1
    if secondsRemaining <= 0
      @props.windowImpl.location[@props.redirectType](@props.destinationUrl)
    else
      @setState({secondsRemaining})

  componentWillMount: ->
    @setState( updateInterval: @props.windowImpl.setInterval(@onCounterTick, @props.secondsDelay * 100) )
  componentWillUnmount: ->
    @props.windowImpl.clearInterval(@state.updateInterval)

  render: ->
    <div className={classnames('countdown-redirect', @props.className)}>
      <div className="message">{@props.message} in {@state.secondsRemaining} seconds</div>
      {@props.children}
    </div>


module.exports = CountdownRedirect
