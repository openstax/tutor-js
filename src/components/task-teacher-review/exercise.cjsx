React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

{ArbitraryHtmlAndMath, Question, CardBody, FreeResponse, ExerciseGroup} = require 'openstax-react-components'
{ScrollTrackerMixin} = require 'openstax-react-components/src/components/scroll-tracker'
{ExerciseStore} = require '../../flux/exercise'

TaskTeacherReviewQuestion = React.createClass
  displayName: 'TaskTeacherReviewQuestion'
  propTypes:
    question: React.PropTypes.object.isRequired
    questionStats: React.PropTypes.object.isRequired

  getInitialState: ->
    showAnswers: false

  onChangeAnswerAttempt: (answer) ->
    # TODO show cannot change answer message here
    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')

  toggleAnswers: ->
    {showAnswers} = @state
    @setState({showAnswers: not showAnswers})

  gatherAnswerStatsById: ->
    {questionStats, question} = @props
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

  renderFreeResponse: ->
    {showAnswers} = @state
    {questionStats, question} = @props
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

  render: ->
    {question, questionStats} = @props
    {answers, answered_count} = questionStats

    question.answers = @gatherAnswerStatsById()

    if ExerciseStore.doesQuestionHaveFormat('free-response', question)
      studentResponses = if answers.length then @renderFreeResponse() else @renderNoFreeResponse()

    <Question
      model={question}
      answered_count={answered_count}
      type='teacher-review'
      onChangeAttempt={@onChangeAnswerAttempt}>
      {studentResponses}
    </Question>


TaskTeacherReviewQuestionTracker = React.createClass
  displayName: 'TaskTeacherReviewQuestionTracker'
  mixins: [ScrollTrackerMixin]
  render: ->
    questionProps = _.pick(@props, 'question', 'questionStats')
    <TaskTeacherReviewQuestion {...questionProps}/>


TaskTeacherReviewExercise = React.createClass
  displayName: 'TaskTeacherReviewExercise'
  propTypes:
    content: React.PropTypes.object.isRequired
    question_stats: React.PropTypes.array.isRequired

  getQuestionStatsById: (questionId) ->
    {question_stats} = @props
    questionId = questionId.toString()
    _.findWhere(question_stats, question_id: questionId)

  renderQuestion: (question, index) ->
    questionStats = @getQuestionStatsById(question.id)
    {setScrollPoint, unsetScrollPoint, scrollState} = @props
    {key} = scrollState
    scrollState = _.extend {}, scrollState, {key: key + index}

    <TaskTeacherReviewQuestionTracker
      key={"task-review-question-#{question.id}"}
      question={question}
      questionStats={questionStats}
      scrollState={scrollState}
      setScrollPoint={setScrollPoint}
      unsetScrollPoint={unsetScrollPoint}/>

  render: ->
    {content} = @props
    {questions, uid} = content

    exercise = _.map questions, @renderQuestion
    {stimulus_html} = content

    stimulus = <ArbitraryHtmlAndMath
      className='exercise-stimulus'
      block={true}
      html={stimulus_html} /> if stimulus_html?.length > 0

    <CardBody className='task-step openstax-exercise openstax-exercise-card' pinned={false}>
      {stimulus}
      {exercise}
      <ExerciseGroup
          key='step-exercise-group'
          exercise_uid={uid}/>
    </CardBody>

module.exports = TaskTeacherReviewExercise
