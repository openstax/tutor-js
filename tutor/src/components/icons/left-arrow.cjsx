React = require 'react'

# created as plain class without this binding and never updates
class LeftArrow extends React.Component

  shouldComponentUpdate: -> false

  render: ->
    <svg className="icon left-arrow"
       version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
       viewBox="0 0 370 735"
    >
      <path
        d="M369.225,658.604l0,76.396l-369.225,-369.225l0.3,-0.3l368.925,-365.475l0,77.168l-291.449,290.332l291.449,291.104Z"
      />
    </svg>


module.exports = LeftArrow
