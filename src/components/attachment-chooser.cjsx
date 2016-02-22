React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'
api = require '../api'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

AttachmentChooser = React.createClass

  propTypes:
    exerciseUid: React.PropTypes.string.isRequired

  getInitialState: -> {}

  updateUploadStatus: (status) ->
    if status.error
      @setState(error: status.error)
    if status.progress?
      @setState(progress: status.progress, error: false)
    if status.response # 100%, we're done
      @replaceState({}) # <- N.B. replaceState, not setState.

  uploadImage: ->
    return unless @state.file
    api.uploadExerciseImage(@props.exerciseUid, @state.file, @updateUploadStatus)
    @setState(progress: 0)

  renderUploadStatus: ->
    return unless @state.progress
    <BS.ProgressBar now={@state.progress} />

  onImageChange: (ev) ->
    ev.preventDefault()
    file = ev.target.files[0]
    reader = new FileReader()
    reader.onloadend = =>
      @setState({file, imageData: reader.result, asset: null})
    reader.readAsDataURL(file)


  renderUploadBtn: ->
    return unless @state.imageData and not @state.progress
    <BS.Button onClick={@uploadImage}>Upload</BS.Button>

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
      {@renderUploadStatus()}
    </div>

module.exports = AttachmentChooser
