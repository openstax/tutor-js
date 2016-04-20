React = require 'react'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
{StepPanel} = require '../../helpers/policies'

{Exercise, CardBody} = require 'openstax-react-components'
{ExContinueButton, ExReviewControls} = require 'openstax-react-components/src/components/exercise/controls'
{props} = require 'openstax-react-components/src/components/exercise/props'
StepFooter = require './step-footer'

{ChapterSectionMixin} = require 'openstax-react-components'
BrowseTheBook = require '../buttons/browse-the-book'

CONTROLS =
  'free-response': ExContinueButton
  'multiple-choice': ExContinueButton
  'review': ExReviewControls
  'teacher-read-only': ExContinueButton

CONTROLS_TEXT =
  'free-response': 'Answer'
  'multiple-choice': 'Submit'
  'review': 'Next Question'
  'teacher-read-only': 'Next Question'

ExerciseControlButtons = React.createClass
  displayName: 'ExerciseControlButtons'
  getDefaultProps: ->
    disabled: false
    isContinueEnabled: false
    allowKeyNext: false
  shouldComponentUpdate: (nextProps) ->
    nextProps.panel?
  render: ->
    {panel, controlButtons, controlText} = @props

    ControlButtons = CONTROLS[panel]
    controlText ?= CONTROLS_TEXT[panel]

    controlProps = _.pick(@props, props.ExReviewControls)
    controlProps.children = controlText

    <ControlButtons {...controlProps}/>

module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  mixins: [ ChapterSectionMixin ]

  updateFreeResponse: (freeResponse) -> TaskStepActions.updateTempFreeResponse(@props.id, freeResponse)

  getInitialState: ->
    partsInfo = @getPartsInfo()
    taskInfo = @getTaskInfo()

    _.extend({}, partsInfo, taskInfo)

  getPartsInfo: (props) ->
    props ?= @props

    {id, taskId, courseId, onNextStep} = props
    parts = TaskStore.getStepParts(taskId, id)

    lastPartId = _.last(parts).id
    isSinglePartExercise = @isSinglePart(parts)

    {parts, lastPartId, isSinglePartExercise}

  getTaskInfo: (props) ->
    props ?= @props
    {taskId} = props

    task = TaskStore.get(taskId)

    {task}

  isSinglePart: (parts) ->
    parts.length is 1

  componentWillReceiveProps: (nextProps) ->
    if nextProps.taskId isnt @props.taskId
      nextState = _.extend({}, @getTaskInfo(nextProps), @getPartsInfo(nextProps))
      @setState(nextState)
    else if nextProps.id isnt @props.id
      @setState(@getPartsInfo(nextProps))

  canOnlyContinue: (id) ->
    _.chain(StepPanel.getRemainingActions(id))
      .difference(['clickContinue'])
      .isEmpty()
      .value()

  renderHelpLink: (sections) ->
    return null unless sections? and not _.isEmpty(sections)
    {courseId} = @props

    sectionsLinks = _.chain sections
      .map (section) =>
        combined = @sectionFormat(section.chapter_section)
        <BrowseTheBook
          unstyled
          key={combined}
          section={combined}
          courseId={courseId}
          onlyShowBrowsable={false}>
          {combined} {section.title} <i className='fa fa-external-link' />
        </BrowseTheBook>
      .compact()
      .value()

    helpLink =
      <div key='task-help-links' className='task-help-links'>
        Comes from&nbsp&nbsp{sectionsLinks}
      </div>

    if sectionsLinks.length > 0 then helpLink

  canAllContinue: ->
    {parts} = @state

    _.reduce parts, (previous, part) =>
      previous and @canOnlyContinue(part.id)
    , true

  allCorrect: ->
    {parts} = @state

    _.reduce parts, (previous, part) ->
      previous and (part.correct_answer_id is part.answer_id)
    , true

  getWaitingText: (id) ->
    switch
      when TaskStepStore.isLoading(id) then "Loading…"
      when TaskStepStore.isSaving(id)  then "Saving…"
      else null

  getReadingForStep: (id, taskId) ->
    TaskStore.getReadingForTaskId(taskId, id)

  getCurrentPanel: (id) ->
    unless TaskStepStore.isSaving(id)
      currentPanel = StepPanel.getPanel(id)

  getReviewProps: ->
    {refreshStep, recoverFor} = @props
    {task, lastPartId} = @state

    refreshMemory: _.partial(refreshStep, lastPartId)
    tryAnother: _.partial(recoverFor, lastPartId)
    canTryAnother: TaskStepStore.canTryAnother(lastPartId, task, not @allCorrect())
    isRecovering: TaskStepStore.isRecovering(lastPartId)

  isLastPart: (id) ->
    {lastPartId} = @state

    id is lastPartId

  shouldControl: (id) ->
    {isSinglePartExercise} = @state

    isSinglePartExercise or not (@isLastPart(id) and @canOnlyContinue(id))

  renderPart: (taskId, stepProps, onStepCompleted, part, index = 0) ->
    stepIndex = TaskStore.getStepIndex(taskId, part.id)
    step = TaskStepStore.get(part.id)
    waitingText = @getWaitingText(part.id)
    partProp = _.pick(part, 'id', 'taskId')
    partProp.focus = index is 0
    controlButtons = [] unless @shouldControl(part.id)

    <div
      className='exercise-wrapper'
      data-step-number={stepIndex + 1}
      key="exercise-part-#{part.id}">
      <Exercise
        {...partProp}
        {...stepProps}
        onStepCompleted={_.partial(onStepCompleted, part.id)}
        freeResponseValue={step.temp_free_response}
        step={step}
        waitingText={waitingText}
        controlButtons={controlButtons}

        canReview={StepPanel.canReview(part.id)}
        disabled={TaskStepStore.isSaving(part.id)}
        isContinueEnabled={StepPanel.canContinue(part.id)}

        getCurrentPanel={@getCurrentPanel}
        getReadingForStep={@getReadingForStep}
        setFreeResponseAnswer={TaskStepActions.setFreeResponseAnswer}
        onFreeResponseChange={_.partial(TaskStepActions.updateTempFreeResponse, part.id)}
        freeResponseValue={TaskStepStore.getTempFreeResponse(part.id)}
        setAnswerId={TaskStepActions.setAnswerId}
      />
    </div>

  render: ->
    {id, taskId, courseId, onNextStep, onStepCompleted} = @props
    {parts, lastPartId, isSinglePartExercise, task} = @state

    stepProps = _.pick(@props, 'taskId', 'courseId', 'goToStep', 'onNextStep')

    if isSinglePartExercise
      stepProps = _.extend {}, stepProps, @getReviewProps()
      stepProps.pinned = true
      stepProps.footer = <StepFooter/>
      stepProps.focus = true

      # render as single part
      return @renderPart(taskId, stepProps, onStepCompleted, _.last(parts))

    # otherwise, continue with rendering as multi-part
    stepProps.pinned = false
    stepParts = _.map parts, _.partial(@renderPart, taskId, stepProps, onStepCompleted), @

    controlProps =
      panel: @getCurrentPanel(lastPartId)
      controlText: 'Continue' if task.type is 'reading'

    if @canAllContinue()

      reviewProps = @getReviewProps()

      canContinueControlProps =
        isContinueEnabled: true
        onContinue: onNextStep

      canContinueControlProps = _.extend({}, canContinueControlProps, reviewProps)

    controlButtons = <ExerciseControlButtons {...controlProps} {...canContinueControlProps}/>

    footer = <StepFooter
      id={id}
      taskId={taskId}
      courseId={courseId}
      controlButtons={controlButtons}/>

    <CardBody footer={footer}>
      {stepParts}
    </CardBody>
