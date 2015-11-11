React = require 'react'

{ConceptCoach, channel} = require './base'
{CCModal} = require './modal'

ModalCoach = React.createClass
  displayName: 'ModalCoach'
  render: ->
    <CCModal>
      <ConceptCoach {...@props}/>
    </CCModal>

module.exports = {ModalCoach, channel}
