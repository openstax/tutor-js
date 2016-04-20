React = require 'react'

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
    {id, taskId} = @props
    parts = TaskStore.getStepParts(taskId, id)

    _.reduce parts, (previous, part) =>
      previous and @canOnlyContinue(part.id)
    , true

  allCorrect: ->
    {id, taskId} = @props
    parts = TaskStore.getStepParts(taskId, id)

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

  render: ->
    {id, taskId, courseId, onNextStep} = @props
    task = TaskStore.get(taskId)
    parts = TaskStore.getStepParts(taskId, id)

    lastPartId = _.last(parts).id

    stepProps = _.pick(@props, 'taskId', 'courseId', 'goToStep', 'onNextStep')
    {onStepCompleted, refreshStep, recoverFor} = @props

    reviewProps =
      refreshMemory: _.partial(refreshStep, lastPartId)
      tryAnother: _.partial(recoverFor, lastPartId)
      canTryAnother: TaskStepStore.canTryAnother(lastPartId, task, not @allCorrect())
      isRecovering: TaskStepStore.isRecovering(lastPartId)

    stepParts = _.map parts, (part, index) =>
      stepIndex = TaskStore.getStepIndex(taskId, part.id)
      step = TaskStepStore.get(part.id)
      waitingText = @getWaitingText(part.id)
      partProp = _.pick(part, 'id', 'taskId')
      controlButtons = [] if @canOnlyContinue(part.id)

      <div className='exercise-wrapper' data-step-number={stepIndex + 1} key="exercise-part-#{part.id}">
        <Exercise
          {...partProp}
          {...stepProps}
          helpLink={@renderHelpLink(step.related_content)}
          {...reviewProps}
          onStepCompleted={_.partial(onStepCompleted, part.id)}
          freeResponseValue={step.temp_free_response}
          step={step}
          waitingText={waitingText}
          pinned={false}
          controlButtons={controlButtons}
          focus={parts.length is 1 or index is 0}

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

    controlProps =
      panel: @getCurrentPanel(lastPartId)
      controlText: 'Continue' if task.type is 'reading'

    if @canAllContinue()
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
