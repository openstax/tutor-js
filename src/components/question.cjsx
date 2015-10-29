React = require 'react'
_ = require 'underscore'

Answer = require './answer'
{QuestionActions, QuestionStore} = require '../stores/question'

module.exports = React.createClass
  displayName: 'Question'

  getInitialState: -> {}

  changeAnswer: (answerId, correct)->
    answerId

  updateStimulus: (event) -> QuestionActions.updateStimulus(@props.id, event.target?.value)
  updateStem: (event) -> QuestionActions.updateStem(@props.id, event.target?.value)

  render: ->
    {id} = @props
    answers = []
    for answer in QuestionStore.getAnswers(id)
      answers.push(<Answer id={answer.id} changeAnswer={@changeAnswer}/>)

    <div>
      <div>
        <label>Question Stem</label>
        <textarea onChange={@updateStem}>{QuestionStore.getStem(id)}</textarea>
      </div>
      <div>
        <label>Question Stimulus</label>
        <textarea onChange={@updateStimulus}>{QuestionStore.getStimulus(id)}</textarea>
      </div>
      <div>
        <label>Answers</label>
        <ol>
          {answers}
        </ol>
      </div>
    </div>
