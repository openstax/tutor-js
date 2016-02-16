React = require 'react'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
{StepPanel} = require '../../helpers/policies'

{Exercise} = require 'openstax-react-components'
StepFooter = require './step-footer'

module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  updateFreeResponse: (freeResponse) -> TaskStepActions.updateTempFreeResponse(@props.id, freeResponse)

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

    <div className='exercise-wrapper' data-step-number={stepIndex + 1}>
      <Exercise
        {...@props}
        step={step}
        footer={<StepFooter/>}
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