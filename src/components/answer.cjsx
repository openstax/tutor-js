React = require 'react'
_ = require 'underscore'
{AnswerActions, AnswerStore} = require '../stores/answer'

module.exports = React.createClass
  displayName: 'Answer'

  getInitialState: -> {}

  updateContent: (event) -> AnswerActions.updateContent(@props.id, event.target?.value)
  changeCorrect: (event) -> @props.changeAnswer(@props.id)
  updateFeedback: (event) -> AnswerActions.updateFeedback(@props.id, event.target?.value)

  render: ->
    isCorrect = AnswerStore.isCorrect(@props.id)
    removeAnswer = _.partial(@props.removeAnswer, @props.id)

    <li>
      <p>
        <span>Correct Answer:</span>
        <input type="checkbox" checked={isCorrect} onChange={@changeCorrect}/>
        <a className="pull-right" onClick={removeAnswer}>Remove Answer</a>
      </p>
      <label>Answer Content</label>
      <textarea onChange={@updateContent} defaultValue={AnswerStore.getContent(@props.id)}>
      </textarea>
      <label>Answer Feedback</label>
      <textarea onChange={@updateFeedback} defaultValue={AnswerStore.getFeedback(@props.id)}>
      </textarea>
    </li>
