React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'
api = require 'api'
{ExerciseActions, ExerciseStore} = require 'stores/exercise'

AttachmentChooser = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  getInitialState: -> {}

  updateUploadStatus: (status) ->
    if status.error
      @setState(error: status.error)
    if status.progress?
      @setState(progress: status.progress, error: false)
    if status.response # 100%, we're done
      @replaceState({}) # <- N.B. replaceState, not setState.

  uploadImage: ->
    if ExerciseStore.isNew(@props.exerciseId)
      ExerciseActions.create(@props.exerciseId, ExerciseStore.get(@props.exerciseId))
    else
      ExerciseActions.save(@props.exerciseId)
    ExerciseStore.once 'updated', (id) =>
      api.uploadExerciseImage(@props.exerciseId, @state.file, @updateUploadStatus)
      @setState(progress: 0)

  renderUploadStatus: ->
    return unless @state.progress?
    <BS.ProgressBar now={@state.progress} />

  onImageChange: (ev) ->
    ev.preventDefault()
    file = _.first(ev.target.files)
    return unless file
    reader = new FileReader()
    reader.onloadend = =>
      @replaceState({file, imageData: reader.result})
    reader.readAsDataURL(file)

  renderUploadBtn: ->
    return unless @state.imageData and not @state.progress
    <BS.Button onClick={@uploadImage} disabled={not ExerciseStore.isSavedOrSavable(@props.exerciseId) or not @state.file}>Upload</BS.Button>

  renderErrors: ->
    return null unless @state.error
    <div className='error'>{@state.error}</div>

  render: ->
    image = <img className="preview" src={@state.imageData} /> if @state.imageData
    classNames = classnames('attachment', {
      'with-image': image
    })
    <div className={classNames}>
      {image}
      <div className="controls">
        <label className="selector">
          {if image then 'Choose different image' else 'Add new image'}
          <input id='file' className="file" type="file" onChange={@onImageChange} />
        </label>
        {@renderUploadBtn()}
      </div>
      {@renderErrors()}
      {@renderUploadStatus()}
    </div>

module.exports = AttachmentChooser
