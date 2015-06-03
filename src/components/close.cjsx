React = require 'react'

module.exports = React.createClass
  render: ->
    @props.className ?= ''
    @props.className = "#{@props.className} close-x close"

    <button {...@props} aria-role='close'></button>
