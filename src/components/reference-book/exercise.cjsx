React = require 'react'

{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'

Question = require '../question'
LoadableItem = require '../loadable-item'

ReferenceBookMissingExercise = React.createClass
  displayName: 'ReferenceBookMissingExercise'
  render: ->
    {exerciseAPIUrl} = @props

    <small className='reference-book-missing-exercise'
      data-exercise-url={exerciseAPIUrl}>
      <i>Missing exercise</i>
    </small>

ReferenceBookExercise = React.createClass
  displayName: 'ReferenceBookExercise'
  render: ->
    {exerciseAPIUrl} = @props
    {items} = ReferenceBookExerciseStore.get(exerciseAPIUrl)

    unless items?.length
      # warning about missing exercise --
      # is there a need to show the reader anything?
      console.warn("WARNING: #{exerciseAPIUrl} appears to be missing.")
      return <ReferenceBookMissingExercise exerciseAPIUrl={exerciseAPIUrl}/>

    {questions} = items[0]
    question = questions[0]

    <Question model={question}/>

ReferenceBookExerciseShell = React.createClass
  displayName: 'ReferenceBookExerciseShell'
  isLoading: ->
    {exerciseAPIUrl} = @props
    ReferenceBookExerciseStore.isLoading(exerciseAPIUrl) or ReferenceBookExerciseStore.isQueued(exerciseAPIUrl)
  load: ->
    {exerciseAPIUrl} = @props
    ReferenceBookExerciseActions.load(exerciseAPIUrl) unless @isLoading()
  render: ->
    {exerciseAPIUrl} = @props

    <LoadableItem
      id={exerciseAPIUrl}
      bindEvent={"loaded.#{exerciseAPIUrl}"}
      isLoading={@isLoading}
      load={@load}
      store={ReferenceBookExerciseStore}
      actions={ReferenceBookExerciseActions}
      renderItem={=> <ReferenceBookExercise {...@props} />}
      renderLoading={-> <span className='loading-exercise'>Loading exercise...</span>}
      renderError={-> <ReferenceBookMissingExercise/>}
    />

module.exports = {ReferenceBookExercise, ReferenceBookExerciseShell}
