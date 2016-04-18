React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ExerciseStore} = require '../stores/exercise'


PublishedModal = React.createClass
  getInitialState: -> {}

  componentWillMount: ->
    ExerciseStore.on('published', @show)

  componentWillUnmount: ->
    ExerciseStore.off('published', @show)

  show: ->
    @setState(isShowing: true)

  onHide: ->
    @setState(isShowing: false)

  render: ->
    return null unless @state.isShowing

    exercise = ExerciseStore.get(@props.exerciseId)

    <BS.Modal
      enforceFocus={false}
      autoFocus={false}
      backdrop={false}
      animation={false}
      onRequestHide={@onHide}
      title={"Exercise has published sucessfully"}
      onHide={@onHide}>

      <div className='modal-body'>
        <b>Exercise {exercise.uid} has published successfully</b>
      </div>

      <div className='modal-footer'>
        <BS.Button bsStyle='primary' onClick={@onHide}>Close</BS.Button>
      </div>
    </BS.Modal>

module.exports = PublishedModal
