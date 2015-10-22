React = require 'react'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'

module.exports = React.createClass
  displayName: 'Answer'

  getInitialState: -> {}

  render: ->
      isCorrect = ExerciseStore.isAnswerCorrect(@props.model)
      <li>
        <input type="checkbox" checked={isCorrect}/>
        <span>Correct Answer:</span>
        <label>Answer Content</label>
        <textarea>{ExerciseStore.getAnswerContent(@props.model)}</textarea>
      </li>
