React  = require 'react'

PieProgress = React.createClass

  propTypes:
    size: React.PropTypes.number.isRequired
    value: React.PropTypes.number.isRequired

  buildCircle: (value) ->
    size = @props.size
    radius = size / 2
    value = parseInt(value)
    value = Math.min(Math.max(value, 0), 100)
    x = Math.cos((2 * Math.PI) / (100 / value))
    y = Math.sin((2 * Math.PI) / (100 / value))
    longArc = if value <= 50 then 0 else 1
    arcX = radius + (y * radius)
    arcY = radius - (x * radius)
    d =
      "M#{radius} #{radius} L#{radius} 0 A#{radius} #{radius} 0 #{longArc} 1 #{arcX} #{arcY} z"

  render: ->
    {size, value} = @props
    radius = size / 2
    circle = <circle r="#{radius}" cx="#{radius}" cy="#{radius}" className='slice'></circle>
    path = <path d="#{@buildCircle(@props.value)}" className='slice' />
    blank = null
    svg =
      <svg width="#{@props.size}" height="#{@props.size}" className='pie-progress'>
        {path}
      </svg> 
    finished = <i className="fa fa-check-circle"/>
    notStarted = <i className="fa fa-minus"/>
    
    if value >= 100
      finished
    else if value <= 0
      notStarted
    else
      svg



module.exports = PieProgress
