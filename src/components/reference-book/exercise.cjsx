React = require 'react'

{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'
{ExerciseAPIStore} = require '../../flux/exercise-api'

Question = require '../question'
LoadableItem = require '../loadable-item'

ReferenceBookExercise = React.createClass
  displayName: 'ReferenceBookExercise'
  render: ->
    {exerciseId} = @props
    {items} = ReferenceBookExerciseStore.get(exerciseId)

    unless items?.length
      # warning about missing exercise --
      # is there a need to show the reader anything?
      exerciseAPIUrl = ExerciseAPIStore.get(exerciseId)
      console.warn("WARNING: #{exerciseId} appears to be missing.  Please check #{exerciseAPIUrl}.")
      return <small>Missing exercise</small>

    {questions} = items[0]
    question = questions[0]

    <Question model={question}/>

ReferenceBookExerciseShell = React.createClass
  displayName: 'ReferenceBookExerciseShell'
  render: ->
    {exerciseId} = @props

    <LoadableItem
      id={exerciseId}
      store={ReferenceBookExerciseStore}
      actions={ReferenceBookExerciseActions}
      renderItem={=> <ReferenceBookExercise {...@props} />}
      renderLoading={-> <span className='loading-exercise'>Loading exercise...</span>}
      renderError={-> <span className='error-loading-exercise'>Problem loading exercise</span>}
    />

module.exports = {ReferenceBookExercise, ReferenceBookExerciseShell}
