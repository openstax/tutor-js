React = require 'react'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'
Attachment = require './attachment'
AttachmentChooser = require './chooser'

Attachements = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  render: ->
    exercise = ExerciseStore.get(@props.exerciseId)
    <div className="attachments">
      {for attachment in exercise.attachments or []
        <Attachment key={attachment.asset.url} exerciseUid={exercise.uid} attachment={attachment} />}
      <AttachmentChooser exerciseUid={exercise.uid} />
    </div>


module.exports = Attachements
