React = require 'react'

{ExerciseStore} = require '../stores/exercise'

RecordNotFound = React.createClass
  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)
  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  update: -> @forceUpdate()
  render: ->
    error = ExerciseStore.getLastError()
    return null unless error

    <div className="record-not-found">
      <h3>{error.id} was not found</h3>
      <p>{error.message}</p>
    </div>

module.exports = RecordNotFound
