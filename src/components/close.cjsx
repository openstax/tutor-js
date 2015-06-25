React = require 'react'

module.exports = React.createClass
  render: ->
    classNames = ["close-x close"]
    classNames.push(@props.className) if @props.className
    <button {...@props} className={classNames.join(' ')} aria-role='close'></button>
