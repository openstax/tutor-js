React = require 'react'
_ = require 'underscore'

{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

{ChapterSectionMixin} = require 'openstax-react-components'
BrowseTheBook = require '../buttons/browse-the-book'

{CardBody} = require 'openstax-react-components'

StepFooter = require './step-footer'

{ExerciseControlButtons, ExercisePart, canOnlyContinue, getCurrentPanel} = require './part'

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

    _.reduce parts, (previous, part) ->
      previous and canOnlyContinue(part.id)
    , true

  allCorrect: ->
    {parts} = @state

    _.reduce parts, (previous, part) ->
      previous and (part.correct_answer_id is part.answer_id)
    , true

  getReviewProps: ->
    {refreshStep, recoverFor} = @props
    {task, lastPartId} = @state

    refreshMemory: _.partial(refreshStep, lastPartId)
    tryAnother: _.partial(recoverFor, lastPartId)
    canTryAnother: TaskStepStore.canTryAnother(lastPartId, task, not @allCorrect())
    isRecovering: TaskStepStore.isRecovering(lastPartId)

  renderPart: (taskId, stepProps, onStepCompleted, part, index = 0) ->
    {isSinglePartExercise, lastPartId} = @state
    propsForPart = {taskId, stepProps, onStepCompleted, part, index, isSinglePartExercise, lastPartId}

    <ExercisePart {...propsForPart}/>

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
      panel: getCurrentPanel(lastPartId)
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
