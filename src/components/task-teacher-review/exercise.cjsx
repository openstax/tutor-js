React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{ArbitraryHtmlAndMath, Question, CardBody, FreeResponse, ExerciseGroup} = require 'openstax-react-components'
{ExerciseStore} = require '../../flux/exercise'

TaskTeacherReviewExercise = React.createClass
  displayName: 'TaskTeacherReviewExercise'
  propTypes:
    content: React.PropTypes.object.isRequired
    question_stats: React.PropTypes.array.isRequired

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
    _.clone(content.questions[0])

  getQuestionStatsById: (questionId) ->
    {question_stats} = @props
    questionId = questionId.toString()
    _.findWhere(question_stats, question_id: questionId)

  gatherAnswerStatsById: (question) ->
    questionStats = @getQuestionStatsById(question.id)
    {answer_stats} = questionStats

    _.map question.answers, (answer) ->
      answerId = answer.id.toString()
      answerStats = _.chain(answer_stats).findWhere(answer_id: answerId).omit('answer_id').value()
      _.extend({}, answer, answerStats)

  renderNoFreeResponse: ->
    freeResponsesClasses = 'teacher-review-answers has-no-answers'
    header = <i>No student text responses</i>

    <BS.Panel
      header={header}
      className={freeResponsesClasses}/>

  renderFreeResponse: (question) ->
    {showAnswers} = @state
    questionStats = @getQuestionStatsById(question.id)
    {answers, answered_count} = questionStats

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

  renderQuestion: (question) ->
    question = _.clone(question)
    questionStats = @getQuestionStatsById(question.id)
    question.answers = @gatherAnswerStatsById(question)

    {answers, answered_count} = questionStats

    if ExerciseStore.hasQuestionWithFormat('free-response', {content: @props.content})
      studentResponses = if answers.length then @renderFreeResponse(question) else @renderNoFreeResponse()

    <Question
      model={question}
      answered_count={answered_count}
      type='teacher-review'
      onChangeAttempt={@onChangeAnswerAttempt}>
      {studentResponses}
    </Question>

  render: ->
    {content} = @props    
    {questions, uid} = content

    exercise = _.map questions, @renderQuestion

    <CardBody className='task-step openstax-exercise openstax-exercise-card' pinned={false}>
      {exercise}
      <ExerciseGroup
          key='step-exercise-group'
          exercise_uid={uid}/>
    </CardBody>

module.exports = TaskTeacherReviewExercise
