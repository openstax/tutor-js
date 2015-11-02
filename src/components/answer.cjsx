React = require 'react'
{AnswerActions, AnswerStore} = require '../stores/answer'

module.exports = React.createClass
  displayName: 'Answer'

  getInitialState: -> {}

  updateContent: (event) -> AnswerActions.updateContent(@props.id, event.target?.value)
  changeCorrect: (event) -> @props.changeAnswer(@props.id, event.target.checked)

  render: ->
    isCorrect = AnswerStore.isCorrect(@props.id)
    <li>
      <input type="checkbox" checked={isCorrect} onChange={@changeCorrect}/>
      <span>Correct Answer:</span>
      <label>Answer Content</label>
      <textarea onChange={@updateContent} defaultValue={AnswerStore.getContent(@props.id)}>
      </textarea>
    </li>
