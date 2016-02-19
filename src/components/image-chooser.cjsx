React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'
api = require '../api'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

ImageChooser = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string

  getInitialState: ->
    ex = ExerciseStore.get(@props.exerciseId)
    # TODO: Maybe we want to support multiple?
    # If so this component should be passed the asset to update
    {asset: _.first(ex.attachments)?.asset}

  updateUploadStatus: (status) ->
    if status.error
      @setState(error: status.error)
    if status.progress?
      @setState(progress: status.progress, error: false)
    if status.response # 100%, we're done
      _.delay =>
        # N.B. replaceState, not setState.
        @replaceState(asset: status.response.asset)
      , 500 # wait a 1/2 second then display

  uploadImage: ->
    return unless @state.file
    number = ExerciseStore.getId(@props.exerciseId)
    api.uploadExerciseImage(number, @state.file, @updateUploadStatus)
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

  renderTextCopyNPaste: ->
    return unless @state.asset
    console.log @state.asset
    markdown = """
      ![Image](#{@state.asset.url}         "Optional title")
      ![Large](#{@state.asset.large.url}   "Optional title")
      ![Medium](#{@state.asset.medium.url} "Optional title")
      ![Small](#{@state.asset.small.url}   "Optional title")
    """
    <textarea value={markdown} readOnly className="markdown" />

  renderUploadBtn: ->
    return unless @state.imageData and not @state.progress
    <BS.Button onClick={@uploadImage}>Upload</BS.Button>

  render: ->
    imageSrc = @state.imageData or @state.asset?.large.url
    image = <img className="preview" src={imageSrc} /> if imageSrc
    classNames = classnames('image-chooser', {
      'with-image': image
    })
    <div className={classNames}>
      {image}
      <div className="controls">
        <label className="selector">
          {if image then 'Choose different image' else 'Choose Image'}
          <input id='file' className="file" type="file" onChange={@onImageChange} />
        </label>
        {@renderUploadBtn()}
      </div>
      {@renderTextCopyNPaste()}
      {@renderUploadStatus()}
    </div>

module.exports = ImageChooser
