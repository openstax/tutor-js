_ = require 'underscore'
React = require 'react'

Name = React.createClass

  propTypes:
    first_name:  React.PropTypes.string
    last_name:   React.PropTypes.string
    name:        React.PropTypes.string

  render: ->
    name = if _.isEmpty(@props.name)
      "#{@props.first_name} #{@props.last_name}"
    else
      @props.name

    <span className="name">{name}</span>

module.exports = Name
