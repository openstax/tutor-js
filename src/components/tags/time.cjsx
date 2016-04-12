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
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    <SingleDropdown
      {...@props}
      label='Time'
      prefix='time'
      choices={CHOICES}
    />

module.exports = TimeTag
