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
      viewBox="0 0 17 17"
    >
      <g>
        <path d="M15.161,0l-11.659,0c-0.764,0 -1.383,0.619 -1.383,1.382l0,11.567c0,0.763 0.619,1.382
          1.383,1.382l11.659,0c0.765,0 1.382,-0.619 1.382,-1.382l0,-11.567c0,-0.762 -0.618,-1.382
          -1.382,-1.382ZM15.484,12.68c0,0.304 -0.234,0.551 -0.523,0.551l-11.257,0c-0.29,0 -0.524,-0.247
          -0.524,-0.551l0,-11.026c0,-0.305 0.234,-0.551 0.524,-0.551l11.257,0c0.289,0 0.523,0.246 0.523,0.551l0,11.026Z"
          style={fill:'#a1a1a1'}
        />
        <path d="M14.96,1.102l-11.257,0c-0.29,0 -0.524,0.247 -0.524,0.551l0,11.027c0,0.303 0.234,0.55
          0.524,0.55l11.257,0c0.289,0 0.523,-0.247 0.523,-0.55l0,-11.027c0.001,-0.304 -0.234,-0.551
          -0.523,-0.551ZM7.303,10.966l0,-7.6l5.484,3.8l-5.484,3.8Z"
          style={fill:'#d1d1d1'}
        />
        <path d="M1.06,14.759l0,-9.438l-1.06,0l0,9.798c0,0.763 0.619,1.382
          1.382,1.382l9.562,0l0,-1.101l-9.262,0c-0.344,-0.001 -0.622,-0.287 -0.622,-0.641Z"
          style={fill:'#a1a1a1'} />
        <path d="M7.303,10.966l5.484,-3.799l-5.484,-3.801l0,7.6Z" style={fill:'#f9baa2'} />
      </g>
    </svg>

module.exports = InteractiveIcon
