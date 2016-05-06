React = require 'react'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
{StepPanel} = require '../../helpers/policies'

{Exercise} = require 'openstax-react-components'
StepFooter = require './step-footer'

{ChapterSectionMixin} = require 'openstax-react-components'
BrowseTheBook = require '../buttons/browse-the-book'

module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  mixins: [ ChapterSectionMixin ]

  updateFreeResponse: (freeResponse) -> TaskStepActions.updateTempFreeResponse(@props.id, freeResponse)

  canOnlyContinue: ->
    {id} = @props
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


  render: ->
    {id, taskId} = @props
    task = TaskStore.get(taskId)
    parts = TaskStore.getStepParts(taskId, id)

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

    controlText = 'Continue' if task.type is 'reading' and @canOnlyContinue()
    stepProps = _.pick(@props, 'taskId', 'courseId', 'goToStep', 'onNextStep')
    {onStepCompleted, refreshStep, recoverFor} = @props

    stepParts = _.map parts, (part, index) ->
      stepIndex = TaskStore.getStepIndex(taskId, part.id)
      step = TaskStepStore.get(part.id)
      waitingText = getWaitingText(part.id)
      partProp = _.pick(part, 'id', 'taskId')

      <div className='exercise-wrapper' data-step-number={stepIndex + 1} key="exercise-part-#{part.id}">
        <Exercise
          {...partProp}
          {...stepProps}
          helpLink={@renderHelpLink(step.related_content)}
          onStepCompleted={_.partial(onStepCompleted, part.id)}
          refreshStep={_.partial(refreshStep, part.id)}
          recoverFor={_.partial(recoverFor, part.id)}
          freeResponseValue={step.temp_free_response}
          controlText={controlText}
          step={step}
          waitingText={waitingText}
          pinned={false}
          focus={parts.length is 1 or index is 0}

          canTryAnother={TaskStepStore.canTryAnother(part.id, task)}
          isRecovering={TaskStepStore.isRecovering(part.id)}
          disabled={TaskStepStore.isSaving(part.id)}
          canReview={StepPanel.canReview(part.id)}
          isContinueEnabled={StepPanel.canContinue(part.id)}

          getCurrentPanel={getCurrentPanel}
          getReadingForStep={getReadingForStep}
          setFreeResponseAnswer={TaskStepActions.setFreeResponseAnswer}
          onFreeResponseChange={_.partial(TaskStepActions.updateTempFreeResponse, part.id)}
          freeResponseValue={TaskStepStore.getTempFreeResponse(part.id)}
          setAnswerId={TaskStepActions.setAnswerId}
        />
      </div>

    <div>{stepParts}</div>
