React = require 'react'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

Exercise = require './exercise'
StepFooter = require '../step-footer'

module.exports = React.createClass
  displayName: 'ExerciseShell'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  render: ->
    {id, taskId} = @props
    step = TaskStepStore.get(id)
    task = TaskStore.get(taskId)

    stepProps = {}
    stepProps.canTryAnother = TaskStepStore.canTryAnother(id, task)
    stepProps.disabled = TaskStepStore.isSaving(id)
    stepProps.canReview = StepPanel.canReview(id)
    stepProps.waitingText = switch
      when TaskStepStore.isLoading(id) then "Loading…"
      when TaskStepStore.isSaving(id)  then "Saving…"
      else null

    stepProps.setFreeResponseAnswer = TaskStepActions.setFreeResponseAnswer

    stepProps.setAnswerId = TaskStepActions.setAnswerId

    stepProps.getReadingForStep = (id, taskId) ->
      TaskStore.getReadingForTaskId(taskId, id)

    stepProps.getCurrentPanel = (id) ->
      unless TaskStepStore.isSaving(id)
        currentPanel = StepPanel.getPanel(id)

    <Exercise
      {...@props}
      {...stepProps}
      step={step}
      footer={<StepFooter/>}
    />
