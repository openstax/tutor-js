# coffeelint: disable=max_line_length

React = require 'react'

# Basically just an icon,
# create as plain class without this binding and never updates
class MultipartIcon extends React.Component

  shouldComponentUpdate: ->
    false

  render: ->
    <svg className="icon multipart"
      version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      viewBox="0 0 22 22"
    >
      <g>
        <path style={fill:'#5F6163'} d="M11.8,22c5.4-0.4,9.8-4.7,10.2-10.2H11.8V22z"/>
        <path style={fill:'#5F6163'} d="M10.2,0C4.7,0.4,0.4,4.7,0,10.2h10.2V0z"/>
        <path style={fill:'#5F6163'} d="M0,11.8c0.4,5.4,4.7,9.8,10.2,10.2V11.8H0z"/>
        <path style={fill:'#F47641'} d="M11.8,10.2H22C21.6,4.7,17.3,0.4,11.8,0V10.2z"/>
      </g>
    </svg>

module.exports = MultipartIcon
