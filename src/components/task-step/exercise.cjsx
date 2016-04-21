React = require 'react'
_ = require 'underscore'

{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

{ChapterSectionMixin} = require 'openstax-react-components'
BrowseTheBook = require '../buttons/browse-the-book'

{CardBody} = require 'openstax-react-components'

ScrollSpy = require '../scroll-spy'
StepFooter = require './step-footer'

{ExerciseControlButtons, ExercisePart, canOnlyContinue, getCurrentPanel} = require './part'

ExerciseParts = React.createClass
  displayName: 'ExerciseParts'
  componentWillReceiveProps: (nextProps) ->
    stepIndex = _.first(nextProps.onScreenElements)
    if stepIndex isnt _.first(@props.onScreenElements)
      nextProps.goToStep(stepIndex)

  render: ->
    {stepParts, footer, onScreenElements} = @props

    <CardBody footer={footer}>
      {stepParts}
    </CardBody>


module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  mixins: [ ChapterSectionMixin ]

  updateFreeResponse: (freeResponse) -> TaskStepActions.updateTempFreeResponse(@props.id, freeResponse)

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

    {task}

  isSinglePart: (parts) ->
    parts.length is 1

  componentWillReceiveProps: (nextProps) ->
    console.info('is part in parts', not _.isEmpty(_.findWhere(@state.parts, {id: nextProps.id})))
    if nextProps.taskId isnt @props.taskId
      nextState = _.extend({}, @getTaskInfo(nextProps), @getPartsInfo(nextProps))
      console.info('setting state here')
      @setState(nextState)
    else unless _.findWhere(@state.parts, {id: nextProps.id}) or nextProps.id isnt @props.id
      console.info('setting state there')
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

  shouldComponentUpdate: (nextProps, nextState, nextContext) ->
    # if nextProps.id isnt @props.id and not _.isEmpty(_.findWhere(@state.parts, {id: nextProps.id}))
    #   console.info('shouldComponentUpdate', false)
    #   return false

    # if nextProps.id is @props.id
    #   {stepIndex} = @context.router.getCurrentParams()
    #   console.info(_.isEqual(nextProps, @props), 'same props?')
    #   console.info(_.isEqual(nextState, @state), 'same state?')
    #   console.info(_.isEqual(nextContext, @context), 'same context?', nextContext, @context)
    #   console.info(stepIndex)
    #   console.info('shouldComponentUpdate', 'ids are same')

    # console.info('shouldComponentUpdate', true)
    # return true
    return false

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

    <ExercisePart {...propsForPart} key="exercise-part-#{part.id}"/>

  render: ->
    {id, taskId, courseId, onNextStep, onStepCompleted, goToStep} = @props
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

    controlButtons = <ExerciseControlButtons {...controlProps} {...canContinueControlProps} key='step-control-buttons'/>

    footer = <StepFooter
      id={id}
      key='step-footer'
      taskId={taskId}
      courseId={courseId}
      controlButtons={controlButtons}/>

    <ScrollSpy dataSelector='data-step-index'>
      <ExerciseParts footer={footer} stepParts={stepParts} goToStep={_.partial(goToStep, _, true)}/>
    </ScrollSpy>
