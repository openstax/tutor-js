React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'

Attachment = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired
    attachment: React.PropTypes.shape({
      asset: React.PropTypes.shape({
        filename: React.PropTypes.string.isRequired
        url: React.PropTypes.string.isRequired
        large: React.PropTypes.shape( url: React.PropTypes.string.isRequired ).isRequired
        medium: React.PropTypes.shape( url: React.PropTypes.string.isRequired ).isRequired
        small: React.PropTypes.shape( url: React.PropTypes.string.isRequired ).isRequired
      }).isRequired
    }).isRequired

  deleteImage: ->
    if ExerciseStore.isNew(@props.exerciseId)
      ExerciseActions.create(@props.exerciseId, ExerciseStore.get(@props.exerciseId))
    else
      ExerciseActions.save(@props.exerciseId)
    ExerciseStore.once 'updated', (id) =>
      ExerciseActions.deleteAttachment(@props.exerciseId, @props.attachment.asset.filename)

  render: ->
    # large.url will be null on non-image assets (like PDF)
    url = @props.attachment.asset.large?.url or @props.attachment.asset.url
    copypaste = """
      <img src="#{url}" alt="">
    """
    <div className='attachment with-image'>
      <img className="preview" src={@props.attachment.asset.url} />
      <div className="controls">
        <BS.Button onClick={@deleteImage} disabled={not ExerciseStore.isSavedOrSavable(@props.exerciseId)}>Delete</BS.Button>
      </div>
      <textarea value={copypaste} readOnly className="copypaste" />
    </div>

module.exports = Attachment
