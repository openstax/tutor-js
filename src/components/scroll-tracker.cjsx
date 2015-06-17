React = require 'react'

ScrollTracker =
  propTypes:
    setScrollPoint: React.PropTypes.func.isRequired
    unsetScrollPoint: React.PropTypes.func
    scrollState: React.PropTypes.object.isRequired

  getInitialState: ->
    scrollPoint: 0

  setScrollPoint: ->
    {setScrollPoint, scrollState} = @props

    scrollPoint = @getPosition(@getDOMNode())
    @setState({scrollPoint})

    setScrollPoint(scrollPoint, scrollState)

  unsetScrollPoint: ->
    {unsetScrollPoint} = @props
    unsetScrollPoint?(@state.scrollPoint)

  componentDidMount: ->
    @setScrollPoint()

  componentWillUnmount: ->
    @unsetScrollPoint()

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

module.exports = ScrollTracker
