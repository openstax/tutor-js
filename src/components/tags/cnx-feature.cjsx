React = require 'react'

MultiInput = require './multi-input'

CnxModTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  validateInput: (value) ->
    'Must match CNX module ID with feature ID' unless value.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}#[\w\-]+$/i
    )

  cleanInput: (val) ->
    val.replace(/[^\w\-#]/g, '')

  render: ->
    <MultiInput
      {...@props}
      label='CNX Feature'
      prefix='context-cnxfeature'
      cleanInput={@cleanInput}
      placeholder='#########-####-###-####-############feature-id'
      validateInput={@validateInput}
    />

module.exports = CnxModTag
