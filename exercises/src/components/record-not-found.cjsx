React = require 'react'
BS = require 'react-bootstrap'

{ExerciseActions, ExerciseStore} = require '../stores/exercise'

RecordNotFound = React.createClass
  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)
  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  update: -> @forceUpdate()
  clearError: -> ExerciseActions.clearLastError()
  render: ->
    error = ExerciseStore.getLastError()
    return null unless error

    <BS.Alert
      bsStyle="danger" onDismiss={@clearError}
      className="record-not-found"
    >
      <h3>{error.id} was not found</h3>
      <p>{error.message}</p>
    </BS.Alert>

module.exports = RecordNotFound
