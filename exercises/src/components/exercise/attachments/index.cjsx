React = require 'react'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'
Attachment = require './attachment'
AttachmentChooser = require './chooser'

Attachments = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    exercise = ExerciseStore.get(@props.exerciseId)
    <div className="attachments">
      {for attachment in exercise.attachments or []
        <Attachment key={attachment.asset.url} exerciseId={@props.exerciseId} attachment={attachment} />}
      <AttachmentChooser exerciseId={@props.exerciseId} />
    </div>


module.exports = Attachments
