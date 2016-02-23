React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{ArbitraryHtmlAndMath, Question, CardBody, FreeResponse} = require 'openstax-react-components'
{ExerciseStore} = require '../../flux/exercise'

TaskTeacherReviewExercise = React.createClass
  displayName: 'TaskTeacherReviewExercise'
  propTypes:
    content: React.PropTypes.object.isRequired
    answers: React.PropTypes.array.isRequired
    answered_count: React.PropTypes.number.isRequired

  getInitialState: ->
    showAnswers: false

  onChangeAnswerAttempt: (answer) ->
    # TODO show cannot change answer message here
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')

  toggleAnswers: ->
    {showAnswers} = @state
    @setState({showAnswers: not showAnswers})

  getQuestion: ->
    {content} = @props
    # TODO: Assumes 1 question.
    content.questions[0]

  renderNoFreeResponse: ->
    freeResponsesClasses = 'teacher-review-answers has-no-answers'
    header = <i>No student text responses</i>

    <BS.Panel
      header={header}
      className={freeResponsesClasses}/>

  renderFreeResponse: ->
    {answers} = @props
    {showAnswers} = @state
    question = @getQuestion()

    toggleAnswersText = "View student text responses (#{answers.length})"
    toggleAnswersText = 'Hide student text responses' if showAnswers

    freeResponsesClasses = 'teacher-review-answers'
    freeResponsesClasses += ' active' if showAnswers
    freeResponses = _.map answers, (answer, index) ->
      freeResponseKey = "free-response-#{question.id}-#{index}"
      <FreeResponse {...answer} key={freeResponseKey}/>

    <BS.Accordion onSelect={@toggleAnswers}>
      <BS.Panel
        header={toggleAnswersText}
        eventKey={question.id}
        className={freeResponsesClasses}>
        {freeResponses}
      </BS.Panel>
    </BS.Accordion>

  render: ->
    {answers, answered_count} = @props
    question = @getQuestion()

    if ExerciseStore.hasQuestionWithFormat('free-response', {content: @props.content})
      studentResponses = if answers.length then @renderFreeResponse() else @renderNoFreeResponse()

    <CardBody className='task-step openstax-exercise' pinned={false}>
      <Question
        model={question}
        answered_count={answered_count}
        type='teacher-review'
        exercise_uid={@props.content.uid}
        onChangeAttempt={@onChangeAnswerAttempt}>
        {studentResponses}
      </Question>
    </CardBody>

module.exports = TaskTeacherReviewExercise
