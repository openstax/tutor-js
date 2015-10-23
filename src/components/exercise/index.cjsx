React = require 'react'
_ = require 'underscore'

camelCase = require 'camelcase'

ExerciseStepCard = require './step-card'
{propTypes} = require './props'
{step} = propTypes.ExerciseStepCard

# TODO clean this up.
REVIEW_CONTROL_PROPS = ['refreshStep', 'recoverFor', 'canTryAnother']

NOT_REVIEW_PROPS = ['onNextStep', 'canReview', 'disabled']
NOT_TEACHER_READ_ONLY_PROPS = _.union(NOT_REVIEW_PROPS, ['onStepCompleted', 'canTryAnother'])
NOT_MULTIPLE_CHOICE_PROPS = _.union(REVIEW_CONTROL_PROPS, ['disabled'])
NOT_FREE_RESPONSE_PROPS = _.union(REVIEW_CONTROL_PROPS, ['onStepCompleted', 'onNextStep', 'canReview'])

Exercise = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired
    getCurrentPanel: React.PropTypes.func.isRequired
    step: step

    setFreeResponseAnswer: React.PropTypes.func.isRequired
    setAnswerId: React.PropTypes.func.isRequired

    getReadingForStep: React.PropTypes.func
    refreshStep: React.PropTypes.func
    recoverFor: React.PropTypes.func

    review: React.PropTypes.string
    focus: React.PropTypes.bool
    courseId: React.PropTypes.string
    canTryAnother: React.PropTypes.bool
    canReview: React.PropTypes.bool
    disabled: React.PropTypes.bool

  getInitialState: ->
    {id} = @props

    currentPanel: @props.getCurrentPanel(id)

  componentWillMount: ->
    {id} = @props
    @updateCurrentPanel(@props) unless @state.currentPanel

  componentWillReceiveProps: (nextProps) ->
    @updateCurrentPanel(nextProps)

  updateCurrentPanel: (props) ->
    {id} = props or @props
    currentPanel = @props.getCurrentPanel(id)
    @setState({currentPanel}) if currentPanel? and @state.currentPanel isnt currentPanel

  getDefaultProps: ->
    focus: true
    review: ''
    pinned: true
    canTryAnother: false
    canReview: false

  refreshMemory: ->
    {id, taskId} = @props

    {index} = @props.getReadingForStep(id, taskId)
    @props.refreshStep(index, id)

  tryAnother: ->
    {id} = @props
    @props.recoverFor(id)

  onFreeResponseContinue: (state) ->
    {id} = @props
    {freeResponse} = state
    @props.setFreeResponseAnswer(id, freeResponse)

  onMultipleChoiceAnswerChanged: (answer) ->
    {id} = @props
    @props.setAnswerId(id, answer.id)

  getReviewProps: ->
    reviewProps = _.omit(@props, NOT_REVIEW_PROPS)
    reviewProps.onContinue = @props.onNextStep
    reviewProps.refreshMemory = @refreshMemory
    reviewProps.tryAnother = @tryAnother

    reviewProps

  getMultipleChoiceProps: ->
    multipleChoiceProps = _.omit(@props, NOT_MULTIPLE_CHOICE_PROPS)
    multipleChoiceProps.onAnswerChanged = @onMultipleChoiceAnswerChanged

    multipleChoiceProps

  getFreeResponseProps: ->
    freeResponseProps = _.omit(@props, NOT_FREE_RESPONSE_PROPS)
    freeResponseProps.onContinue = @onFreeResponseContinue

    freeResponseProps

  getTeacherReadOnlyProps: ->
    teacherReadOnlyProps = _.omit(@props, NOT_TEACHER_READ_ONLY_PROPS)
    teacherReadOnlyProps.onContinue = @props.onNextStep
    teacherReadOnlyProps.isContinueEnabled = false
    teacherReadOnlyProps.controlButtons = false
    teacherReadOnlyProps.type = 'teacher-review'

    teacherReadOnlyProps

  # add get props methods for different panel types as needed here

  render: ->
    {id, step, waitingText} = @props
    {currentPanel} = @state

    # panel is one of ['review', 'multiple-choice', 'free-response', 'teacher-read-only']
    getPropsForPanel = camelCase "get-#{currentPanel}-props"
    cardProps = @[getPropsForPanel]?()

    <ExerciseStepCard
      {...cardProps}
      step={step}
      panel={currentPanel}
      waitingText={waitingText}
    />

module.exports = Exercise
