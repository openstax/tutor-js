React  = require 'react'

PieProgress = React.createClass

  propTypes:
    size: React.PropTypes.number.isRequired
    value: React.PropTypes.number.isRequired
    roundToQuarters: React.PropTypes.bool

  radius: (size) ->
    size / 2

  buildCircle: (value) ->
    size = @props.size
    radius = @radius(size)
    value = parseInt(value)
    value = Math.min(Math.max(value, 0), 100)
    x = Math.cos((2 * Math.PI) / (100 / value))
    y = Math.sin((2 * Math.PI) / (100 / value))
    longArc = if value <= 50 then 0 else 1
    arcX = radius + (y * radius)
    arcY = radius - (x * radius)
    d =
      "M#{radius} #{radius} L#{radius} 0 A#{radius} #{radius} 0 #{longArc} 1 #{arcX} #{arcY} z"

  roundToQuarters: (value) ->
    if value <= 49
      25
    else if value >= 50 and value < 75
      50
    else
      75

  render: ->
    {size, value, roundToQuarters} = @props
    radius = @radius(size)
    fullCircle = <circle r="#{radius}" cx="#{radius}" cy="#{radius}" className='slice'></circle>
    circle = if roundToQuarters? then @buildCircle(@roundToQuarters(value)) else @buildCircle(value)
    path = <path d="#{circle}" className='slice' />
    pieCircle =
      <svg width="#{size}" height="#{size}" className='pie-progress'>
        {path}
      </svg>
    finished =
      <svg className='finished'>
        <path
        d="M12 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 12 12c6.628 0 12-5.373 12-12C24 5.373 18.628 0 12 0z
          M10.557 19.455l-7.042-7.042l2.828-2.828l4.243 4.242l7.07-7.071l2.829 2.829L10.557 19.455z" />
      </svg>
    notStarted = <i className="fa fa-minus"/>
    
    if value >= 100
      finished
    else if value <= 0
      notStarted
    else
      pieCircle



module.exports = PieProgress
