React = require 'react'

Icon = require '../../icon'

Loading = React.createClass

  propTypes:
    planType: React.PropTypes.string.isRequired
    position: React.PropTypes.shape(
      x: React.PropTypes.number
      y: React.PropTypes.number
    ).isRequired

  render: ->
    <div className="loading"
      data-assignment-type={@props.planType}
      style={left: @props.position.x, top: @props.position.y}
    >
      <label>
        <Icon type='spinner' spin /> Loading…
      </label>
    </div>



module.exports = Loading
