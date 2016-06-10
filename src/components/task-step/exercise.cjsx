React = require 'react'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskProgressActions, TaskProgressStore} = require '../../flux/task-progress'
{TaskStore} = require '../../flux/task'
{StepPanel} = require '../../helpers/policies'

BrowseTheBook = require '../buttons/browse-the-book'

{ChapterSectionMixin, CardBody, ExerciseWithScroll} = require 'openstax-react-components'
{ExControlButtons} = require 'openstax-react-components/src/components/exercise/controls'

ScrollSpy = require '../scroll-spy'
StepFooter = require './step-footer'

canOnlyContinue = (id) ->
  _.chain(StepPanel.getRemainingActions(id))
    .difference(['clickContinue'])
    .isEmpty()
    .value()

getWaitingText = (id) ->
  switch
    when TaskStepStore.isLoading(id) then "Loading…"
    when TaskStepStore.isSaving(id)  then "Saving…"
    else null

getReadingForStep = (id, taskId) ->
  TaskStore.getReadingForTaskId(taskId, id)

getCurrentPanel = (id) ->
  unless TaskStepStore.isSaving(id)
    currentPanel = StepPanel.getPanel(id)

module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  mixins: [ ChapterSectionMixin ]

  contextTypes:
    router: React.PropTypes.func

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
    currentStep = TaskProgressStore.get(taskId)

    {task, currentStep}

  isSinglePart: (parts) ->
    parts.length is 1

  componentWillMount: ->
    @startListeningForProgress()

  componentWillUnmount: ->
    @stopListeningForProgress()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.taskId isnt @props.taskId
      nextState = _.extend({}, @getTaskInfo(nextProps), @getPartsInfo(nextProps))
      @setState(nextState)
      @stopListeningForProgress()
      @startListeningForProgress(nextProps)
    else
      @setState(@getPartsInfo(nextProps))

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

  stopListeningForProgress: (props) ->
    props ?= @props
    {taskId} = props

    TaskProgressStore.off("update.#{taskId}", @setCurrentStepFromProgress)

  startListeningForProgress: (props) ->
    props ?= @props
    {taskId} = props

    TaskProgressStore.on("update.#{taskId}", @setCurrentStepFromProgress)

  canAllContinue: ->
    {parts} = @state

    _.every parts, (part) ->
      canOnlyContinue(part.id)

  getAllIndexes: (props, state) ->
    props ?= @props
    state ?= @state

    {taskId} = props
    {parts} = state

    _.map parts, (part) ->
      TaskStore.getStepIndex(taskId, part.id)

  isIndexInPart: (stepIndex) ->
    index = stepIndex - 1
    partsIndexes = @getAllIndexes()
    _.contains(partsIndexes, index)

  allCorrect: ->
    {parts} = @state

    _.every parts, (part) ->
      (part.correct_answer_id is part.answer_id)

  getReviewProps: ->
    {refreshStep, recoverFor} = @props
    {task, lastPartId} = @state

    refreshMemory: _.partial(refreshStep, lastPartId)
    tryAnother: _.partial(recoverFor, lastPartId)
    canTryAnother: TaskStepStore.canTryAnother(lastPartId, task, not @allCorrect())
    isRecovering: TaskStepStore.isRecovering(lastPartId)

  setScrollState: (scrollState) ->
    return unless scrollState?
    {key} = scrollState
    @setCurrentStep(key)

  setCurrentStepFromProgress: ({current}) ->
    @setCurrentStep(current)

  setCurrentStep: (currentStep) ->
    @setState({currentStep})

  onFreeResponseChange: (id, tempFreeResponse) ->
    {taskId} = @props
    stepIndex = TaskStore.getStepIndex(taskId, id)
    TaskStepActions.updateTempFreeResponse(id, tempFreeResponse)
    @setCurrentStep(stepIndex)

  render: ->
    {id, taskId, courseId, onNextStep, onStepCompleted, goToStep, pinned} = @props
    {parts, lastPartId, isSinglePartExercise, task, currentStep} = @state
    part = _.last(parts)

    controlProps =
      panel: 'review'
      controlText: 'Continue' if task.type is 'reading'

    if @canAllContinue()
      reviewProps = @getReviewProps()

      canContinueControlProps =
        isContinueEnabled: true
        onContinue: _.partial onNextStep, currentStep: part.stepIndex

      canContinueControlProps = _.extend({}, canContinueControlProps, reviewProps)

    controlButtons = <ExControlButtons
      {...controlProps}
      {...canContinueControlProps}
      key='step-control-buttons'/>

    unless TaskStore.hasProgress(taskId)
      footer = <StepFooter
        id={id}
        key='step-footer'
        taskId={taskId}
        courseId={courseId}
        controlButtons={controlButtons}/>

    <ExerciseWithScroll
      {...@props}
      {...controlProps}
      {...canContinueControlProps}

      footer={footer}

      project='tutor'
      setScrollState={@setScrollState}
      goToStep={_.partial(goToStep, _, true)}
      currentStep={currentStep}

      getCurrentPanel={getCurrentPanel}
      task={task}
      parts={parts}
      helpLink={@renderHelpLink(part.related_content)}

      onStepCompleted={onStepCompleted}
      controlButtons={controlButtons}

      canReview={StepPanel.canReview(part.id)}
      disabled={TaskStepStore.isSaving(part.id)}
      isContinueEnabled={StepPanel.canContinue(part.id)}

      canOnlyContinue={canOnlyContinue}
      getWaitingText={getWaitingText}
      getCurrentPanel={getCurrentPanel}
      getReadingForStep={getReadingForStep}
      setFreeResponseAnswer={TaskStepActions.setFreeResponseAnswer}
      onFreeResponseChange={@onFreeResponseChange}
      setAnswerId={TaskStepActions.setAnswerId}/>
