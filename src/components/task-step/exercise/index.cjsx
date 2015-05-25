React = require 'react'
camelCase = require 'camelcase'

{TaskStepStore} = require '../../../flux/task-step'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

{ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview} = require './modes'

module.exports = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired
    focus: React.PropTypes.bool.isRequired
    review: React.PropTypes.string.isRequired

  getDefaultProps: ->
    focus: true
    review: ''
    pinned: true

  renderReview: (id) ->
    <ExerciseReview
      id={id}
      onNextStep={@props.onNextStep}
      goToStep={@props.goToStep}
      onStepCompleted={@props.onStepCompleted}
      trackRefreshStep={@props.trackRefreshStep}
      review={@props.review}
      pinned={@props.pinned}
    />

  renderMultipleChoice: (id) ->
    <ExerciseMultiChoice
      id={id}
      onStepCompleted={@props.onStepCompleted}
      onNextStep={@props.onNextStep}
      review={@props.review}
      pinned={@props.pinned}
    />

  renderFreeResponse: (id) ->
    <ExerciseFreeResponse
      id={id}
      focus={@props.focus}
      pinned={@props.pinned}
    />

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)

    # get panel to render based on step progress
    panel = StepPanel.getPanel(id)

    # panel is one of ['review', 'multiple-choice', 'free-response']
    renderPanelMethod = camelCase "render-#{panel}"

    throw new Error("BUG: panel #{panel} for an exercise does not have a render method") unless @[renderPanelMethod]?
    @[renderPanelMethod]?(id)
