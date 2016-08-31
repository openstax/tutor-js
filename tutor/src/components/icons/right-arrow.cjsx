React = require 'react'

# created as plain class without this binding and never updates
class RightArrow extends React.Component

  shouldComponentUpdate: -> false

  render: ->
    <svg className="icon right-arrow"
       version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
       viewBox="0 0 370 735"
    >
      <path
        d="M0,658.604l0,76.396l369.225,-369.225l-0.3,-0.3l-368.925,-365.475l0,77.168l291.449,290.332l-291.449,291.104Z"
      />
    </svg>


module.exports = RightArrow
