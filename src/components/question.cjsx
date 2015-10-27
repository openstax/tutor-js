React = require 'react'
_ = require 'underscore'

Answer = require './answer'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

module.exports = React.createClass
  displayName: 'Question'

  getInitialState: -> {}

  render: ->
    answers = []
    for answer in ExerciseStore.getQuestionAnswers(@props.model)
      answers.push(<Answer model={answer} question={@props.model} parent={@props.config} />)

    <div>
      <div>
        <label>Question Stem</label>
        <textarea>{ExerciseStore.getQuestionStem(@props.model)}</textarea>
      </div>
      <div>
        <label>Question Stimulus</label>
        <textarea>{ExerciseStore.getQuestionStimulus(@props.model)}</textarea>
      </div>
      <div>
        <label>Answers</label>
        <ol>
          {answers}
        </ol>
      </div>
    </div>
