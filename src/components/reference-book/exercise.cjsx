React = require 'react'

{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'

Question = require '../question'
LoadableItem = require '../loadable-item'

ReferenceBookExercise = React.createClass
  displayName: 'ReferenceBookExercise'
  render: ->
    {exerciseAPIUrl} = @props
    {items} = ReferenceBookExerciseStore.get(exerciseAPIUrl)

    unless items?.length
      # warning about missing exercise --
      # is there a need to show the reader anything?
      console.warn("WARNING: #{exerciseAPIUrl} appears to be missing.")
      return <small>Missing exercise</small>

    {questions} = items[0]
    question = questions[0]

    <Question model={question}/>

ReferenceBookExerciseShell = React.createClass
  displayName: 'ReferenceBookExerciseShell'
  render: ->
    {exerciseAPIUrl} = @props

    <LoadableItem
      id={exerciseAPIUrl}
      store={ReferenceBookExerciseStore}
      actions={ReferenceBookExerciseActions}
      renderItem={=> <ReferenceBookExercise {...@props} />}
      renderLoading={-> <span className='loading-exercise'>Loading exercise...</span>}
      renderError={-> <span className='error-loading-exercise'>Problem loading exercise</span>}
    />

module.exports = {ReferenceBookExercise, ReferenceBookExerciseShell}
