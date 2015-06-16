React = require 'react'

ScrollTracker =
  propTypes:
    setScrollPoint: React.PropTypes.func.isRequired
    scrollState: React.PropTypes.object.isRequired

  setScrollPoint: ->
    {setScrollPoint, scrollState} = @props

    scrollPoint = @getPosition(@getDOMNode())
    setScrollPoint(scrollPoint, scrollState)

  componentDidMount: ->
    @setScrollPoint()

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

module.exports = ScrollTracker
