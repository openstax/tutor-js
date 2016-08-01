React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ExerciseStore} = require 'stores/exercise'


PublishedModal = React.createClass
  getInitialState: -> {}

  componentWillMount: ->
    ExerciseStore.on('published', @onPublished)

  componentWillUnmount: ->
    ExerciseStore.off('published', @onPublished)

  onPublished: (publishedId, opt) ->
    @show() if publishedId is @props.exerciseId

  show: ->
    @setState(isShowing: true)

  onHide: ->
    @setState(isShowing: false)

  render: ->
    return null unless @state.isShowing

    exercise = ExerciseStore.get(@props.exerciseId)

    <BS.Modal
      show={@state.isShowing}
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
