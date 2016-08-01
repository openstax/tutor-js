React = require 'react'

MultiInput = require './multi-input'

CnxModTag = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  validateInput: (value) ->
    'Must match feature ID' unless value.match(
      /^[\w\-]+$/i
    )

  cleanInput: (val) ->
    val.replace(/[^\w\-]/g, '')

  render: ->
    <MultiInput
      {...@props}
      label='CNX Feature'
      prefix='context-cnxfeature'
      cleanInput={@cleanInput}
      placeholder='feature-id'
      validateInput={@validateInput}
    />

module.exports = CnxModTag
