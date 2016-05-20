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
    step = TaskStepStore.get(id)
    task = TaskStore.get(taskId)
    stepIndex = TaskStore.getStepIndex(taskId, id)

    waitingText = switch
      when TaskStepStore.isLoading(id) then "Loading…"
      when TaskStepStore.isSaving(id)  then "Saving…"
      else null

    getReadingForStep = (id, taskId) ->
      TaskStore.getReadingForTaskId(taskId, id)

    getCurrentPanel = (id) ->
      unless TaskStepStore.isSaving(id)
        currentPanel = StepPanel.getPanel(id)

    controlText = 'Continue' if task.type is 'reading' and @canOnlyContinue()

    <div className='exercise-wrapper' data-step-number={stepIndex + 1}>
      <Exercise
        {...@props}
        freeResponseValue={step.temp_free_response}
        controlText={controlText}
        step={step}
        footer={<StepFooter/>}
        helpLink={@renderHelpLink(step.related_content)}
        waitingText={waitingText}

        canTryAnother={TaskStepStore.canTryAnother(id, task)}
        isRecovering={TaskStepStore.isRecovering(id)}
        disabled={TaskStepStore.isSaving(id)}
        canReview={StepPanel.canReview(id)}
        isContinueEnabled={StepPanel.canContinue(id)}

        getCurrentPanel={getCurrentPanel}
        getReadingForStep={getReadingForStep}
        setFreeResponseAnswer={TaskStepActions.setFreeResponseAnswer}
        onFreeResponseChange={@updateFreeResponse}
        freeResponseValue={TaskStepStore.getTempFreeResponse(id)}
        setAnswerId={TaskStepActions.setAnswerId}
      />
    </div>
