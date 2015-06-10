React = require 'react'
_ = require 'underscore'

ArbitraryHtmlAndMath = require '../html'
Question = require '../question'
{CardBody} = require '../pinned-header-footer-card/sections'
FreeResponse = require '../task-step/exercise/free-response'

TaskTeacherReviewExercise = React.createClass
  displayName: 'TaskTeacherReviewExercise'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  onChangeAnswerAttempt: (answer) ->
    # TODO show cannot change answer message here
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')

  render: ->
    {id} = @props
    {content} = @props

    # TODO: Assumes 1 question.
    question = content.questions[0]

    <CardBody className='task-step' pinned={false}>
      <Question
        model={question}
        onChangeAttempt={@onChangeAnswerAttempt} />
    </CardBody>

module.exports = TaskTeacherReviewExercise
