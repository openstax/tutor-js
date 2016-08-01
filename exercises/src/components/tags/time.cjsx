React = require 'react'
_ = require 'underscore'

SingleDropdown = require './single-dropdown'

CHOICES = {
  'short'  : 'Short'
  'medium' : 'Medium'
  'long'   : 'Long'
}

TimeTag = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  render: ->
    <SingleDropdown
      {...@props}
      label='Time'
      prefix='time'
      choices={CHOICES}
    />

module.exports = TimeTag
