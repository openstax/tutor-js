React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
Question = require '../question'
{CardBody} = require '../pinned-header-footer-card/sections'
FreeResponse = require '../task-step/exercise/free-response'

TaskTeacherReviewExercise = React.createClass
  displayName: 'TaskTeacherReviewExercise'
  propTypes:
    content: React.PropTypes.object.isRequired

  getInitialState: ->
    showAnswers: false

  onChangeAnswerAttempt: (answer) ->
    # TODO show cannot change answer message here
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')

  toggleAnswers: ->
    {showAnswers} = @state
    @setState({showAnswers: not showAnswers})

  render: ->
    {content, answers} = @props
    {showAnswers} = @state
    toggleAnswersText = 'View all student text responses'
    toggleAnswersText = 'Hide all student text responses' if showAnswers

    # TODO: Assumes 1 question.
    question = content.questions[0]

    freeResponsesClasses = 'teacher-review-answers'
    freeResponsesClasses += ' active' if showAnswers
    freeResponses = _.map answers, (answer) ->
      <FreeResponse {...answer}/>

    freeResponses = <div className={freeResponsesClasses}>
      {freeResponses}
    </div>

    <CardBody className='task-step' pinned={false}>
      <Question
        model={question}
        type='teacher-review'
        onChangeAttempt={@onChangeAnswerAttempt}>
        <div onClick={@toggleAnswers}>{toggleAnswersText}</div>
        {freeResponses}
      </Question>
    </CardBody>

module.exports = TaskTeacherReviewExercise
