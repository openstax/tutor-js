React = require 'react'
_ = require 'underscore'

Answer = require './answer'
{QuestionActions, QuestionStore} = require '../stores/question'
{AnswerActions, AnswerStore} = require '../stores/answer'

module.exports = React.createClass
  displayName: 'Question'

  getInitialState: -> {}

  changeAnswer: (answerId) ->
    curAnswer = QuestionStore.getCorrectAnswer(@props.id)
    QuestionActions.setCorrectAnswer(@props.id, answerId, curAnswer.id)

  updateStimulus: (event) -> QuestionActions.updateStimulus(@props.id, event.target?.value)
  updateStem: (event) -> QuestionActions.updateStem(@props.id, event.target?.value)
  updateFeedback: (event) -> QuestionActions.updateFeedback(@props.id, event.target?.value)

  render: ->
    {id} = @props
    answers = []

    for answer in QuestionStore.getAnswers(id)
      answers.push(<Answer key={answer.id} id={answer.id} changeAnswer={@changeAnswer}/>)

    if QuestionStore.hasFeedback(id)
      feedback = <div>
        <label>Question Feedback</label>
        <textarea onChange={@updateFeedback} defaultValue={QuestionStore.getFeedback(id)}></textarea>
      </div>

    <div>
      <div>
        <label>Question Stem</label>
        <textarea onChange={@updateStem} defaultValue={QuestionStore.getStem(id)}></textarea>
      </div>
      <div>
        <label>Question Stimulus</label>
        <textarea onChange={@updateStimulus} defaultValue={QuestionStore.getStimulus(id)}></textarea>
      </div>
      {feedback}
      <div>
        <label>Answers</label>
        <ol>
          {answers}
        </ol>
      </div>
    </div>
