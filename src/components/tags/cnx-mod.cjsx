React = require 'react'

MultiInput = require './multi-input'

CnxModTag = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  validateInput: (value) ->
    'Must match CNX feature' unless value.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )

  cleanInput: (val) ->
    val.replace(/[^0-9a-f-]/g, '')

  render: ->
    <MultiInput
      {...@props}
      label='CNX Module'
      prefix='cnx-module'
      cleanInput={@cleanInput}
      validateInput={@validateInput}
      placeholder='1d1fd537-77fb-4eac-8a8a-60bbaa747b6d'
    />

module.exports = CnxModTag
