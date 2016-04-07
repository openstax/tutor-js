React = require 'react'

MultiInput = require './multi-input'

LoTags = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  validateInput: (value) ->
    'Must match LO pattern of dd-dd-dd' unless value.match(
      /^\d{1,2}-\d{1,2}-\d{1,2}$/
    )

  cleanInput: (val) ->
    val.replace(/[^0-9\-]/g, '')

  render: ->
    <MultiInput
      {...@props}
      label='LO'
      prefix='lo'
      placeholder='nn-nn-nn'
      cleanInput={@cleanInput}
      validateInput={@validateInput}
    />

module.exports = LoTags
