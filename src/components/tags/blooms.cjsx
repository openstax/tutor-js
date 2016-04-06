React = require 'react'
_ = require 'underscore'

SingleDropdown = require './single-dropdown'

CHOICES = {}
CHOICES[i] = i for i in _.range(1, 8)

BloomsTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    <SingleDropdown
      {...@props}
      label='Blooms'
      prefix='blooms'
      choices={CHOICES}
    />

module.exports = BloomsTag
