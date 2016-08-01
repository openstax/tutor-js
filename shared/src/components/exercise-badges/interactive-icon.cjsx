# coffeelint: disable=max_line_length

React = require 'react'

# Basically just an icon,
# create as plain class without this binding and never updates
class InteractiveIcon extends React.Component

  shouldComponentUpdate: ->
    false

  render: ->
    <svg className="icon interactive"
      version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      viewBox="0 0 22.1 22"
    >
      <g>
        <path style={fill:'#5E6062'} d="M20.2,0H4.7c-1,0-1.8,0.8-1.8,1.8v15.4c0,1,0.8,1.8,1.8,1.8h15.5c1,0,1.8-0.8,1.8-1.8V1.8
          C22.1,0.8,21.2,0,20.2,0z M20.6,16.9c0,0.4-0.3,0.7-0.7,0.7h-15c-0.4,0-0.7-0.3-0.7-0.7V2.2c0-0.4,0.3-0.7,0.7-0.7h15
          c0.4,0,0.7,0.3,0.7,0.7V16.9z"/>
        <path style={fill:'none'} d="M19.9,1.5h-15c-0.4,0-0.7,0.3-0.7,0.7v14.7c0,0.4,0.3,0.7,0.7,0.7h15c0.4,0,0.7-0.3,0.7-0.7V2.2
          C20.6,1.8,20.3,1.5,19.9,1.5z M9.7,14.6V4.5L17,9.6L9.7,14.6z"/>
        <path style={fill:'#5E6062'} d="M1.4,19.7V7.1H0v13.1c0,1,0.8,1.8,1.8,1.8h12.7v-1.5H2.2C1.8,20.5,1.4,20.1,1.4,19.7z"/>
        <polygon style={fill:'#F47641'} points="9.7,14.6 17,9.6 9.7,4.5  "/>
      </g>
    </svg>

module.exports = InteractiveIcon
