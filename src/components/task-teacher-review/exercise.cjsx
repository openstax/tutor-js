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

  render: ->
    {content, answers, answered_count} = @props
    {showAnswers} = @state
    toggleAnswersText = "View student text responses (#{answered_count})"
    toggleAnswersText = 'Hide student text responses' if showAnswers

    # TODO: Assumes 1 question.
    question = content.questions[0]

    freeResponsesClasses = 'teacher-review-answers'
    freeResponsesClasses += ' active' if showAnswers
    freeResponses = _.map answers, (answer, index) ->
      freeResponseKey = "free-response-#{question.id}-#{index}"
      <FreeResponse {...answer} key={freeResponseKey}/>

    <CardBody className='task-step' pinned={false}>
      <Question
        model={question}
        answered_count={answered_count}
        type='teacher-review'
        onChangeAttempt={@onChangeAnswerAttempt}>
        <BS.Accordion bsStyle='default' onSelect={@toggleAnswers}>
          <BS.Panel
            header={toggleAnswersText}
            eventKey={question.id}
            className={freeResponsesClasses}>
            {freeResponses}
          </BS.Panel>
        </BS.Accordion>
      </Question>
    </CardBody>

module.exports = TaskTeacherReviewExercise
