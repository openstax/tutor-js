React = require 'react'

ScrollTracker =
  propTypes:
    setScrollPoint: React.PropTypes.func.isRequired
    onScrollPoint: React.PropTypes.func.isRequired

  setScrollPoint: ->
    offset = @getPosition(@getDOMNode())
    @props.setScrollPoint(offset, @onScrollPoint)

  componentDidMount: ->
    @setScrollPoint()

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

module.exports = ScrollTracker
