React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'
api = require '../api'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

ImageChooser = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string

  getInitialState: -> {}

  uploadImage: ->
    return unless @state.file
    api.uploadExerciseImage(@props.exerciseId, @state.file, (status) ->
      console.log status
    )

  onImageChange: (ev) ->
    ev.preventDefault()
    file = ev.target.files[0]
    reader = new FileReader()
    reader.onloadend = =>
      ExerciseActions.updateImage(@props.exerciseId, reader.result)

      @setState({file, imageData: reader.result})
    reader.readAsDataURL(file)

  render: ->
    imageSrc = @state.imageData or @props.url
    image = <img className="preview" src={imageSrc} /> if imageSrc
    classNames = classnames('image-chooser', {
      'with-image': image
    })
    <div className={classNames}>
      {image}
      <label className="selector">
        {if image then 'Choose different image' else 'Choose Image'}
        <input id='file' className="file" type="file" onChange={@onImageChange} />
      </label>
      <BS.Button onClick={@uploadImage}>Save</BS.Button>
    </div>

module.exports = ImageChooser
