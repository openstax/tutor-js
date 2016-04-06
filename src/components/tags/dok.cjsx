React = require 'react'
_ = require 'underscore'

SingleDropdown = require './single-dropdown'

CHOICES = {}
CHOICES[i] = i for i in _.range(1, 5)

DokTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    <SingleDropdown
      {...@props}
      label='DOK'
      prefix='dok'
      choices={CHOICES}
    />

module.exports = DokTag
