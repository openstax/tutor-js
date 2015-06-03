React = require 'react'

module.exports = React.createClass
  render: ->
    @props.className ?= ''
    @props.className = "#{@props.className} close"

    <button {...@props} aria-role='close'>&times;</button>
