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

  render: ->
    {id, taskId} = @props
    step = TaskStepStore.get(id)
    task = TaskStore.get(taskId)

    waitingText = switch
      when TaskStepStore.isLoading(id) then "Loading…"
      when TaskStepStore.isSaving(id)  then "Saving…"
      else null

    getReadingForStep = (id, taskId) ->
      TaskStore.getReadingForTaskId(taskId, id)

    getCurrentPanel = (id) ->
      unless TaskStepStore.isSaving(id)
        currentPanel = StepPanel.getPanel(id)

    <Exercise
      {...@props}
      step={step}
      footer={<StepFooter/>}
      waitingText={waitingText}

      canTryAnother={TaskStepStore.canTryAnother(id, task)}
      disabled={TaskStepStore.isSaving(id)}
      canReview={StepPanel.canReview(id)}
      isContinueEnabled={StepPanel.canContinue(id)}

      getCurrentPanel={getCurrentPanel}
      getReadingForStep={getReadingForStep}
      setFreeResponseAnswer={TaskStepActions.setFreeResponseAnswer}
      setAnswerId={TaskStepActions.setAnswerId}
    />
