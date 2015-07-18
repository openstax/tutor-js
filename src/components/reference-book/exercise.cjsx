React = require 'react'

{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'
Question = require '../question'
LoadableItem = require '../loadable-item'

ReferenceBookExercise = React.createClass
  displayName: 'ReferenceBookExercise'
  render: ->
    {exerciseId} = @props
    {items} = ReferenceBookExerciseStore.get(exerciseId)
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
    />

module.exports = {ReferenceBookExercise, ReferenceBookExerciseShell}
