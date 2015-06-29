React = require 'react'
camelCase = require 'camelcase'
_ = require 'underscore'

{TaskStepStore} = require '../../../flux/task-step'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'

{ExerciseFreeResponse, ExerciseMultiChoice, ExerciseReview, ExerciseTeacherReadOnly} = require './modes'

module.exports = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired
    focus: React.PropTypes.bool.isRequired
    review: React.PropTypes.string.isRequired
    panel: React.PropTypes.string

  getDefaultProps: ->
    focus: true
    review: ''
    pinned: true

  renderReview: (id) ->
    reviewProps = @props

    <ExerciseReview
      {...reviewProps}
      id={id}
    />

  renderMultipleChoice: (id) ->
    multipleChoiceProps = _.omit(@props, 'goToStep', 'refreshStep', 'recoverFor')

    <ExerciseMultiChoice
      {...multipleChoiceProps}
      id={id}
    />

  renderFreeResponse: (id) ->
    freeResponseProps = _.omit(@props, 'onStepCompleted', 'goToStep', 'onNextStep', 'refreshStep', 'recoverFor')

    <ExerciseFreeResponse
      {...freeResponseProps}
      id={id}
    />

  renderTeacherReadOnly: (id) ->
    teacherReadOnlyProps = _.omit(@props, 'onStepCompleted')

    <ExerciseTeacherReadOnly
      {...teacherReadOnlyProps}
      id={id}
    />

  # add render methods for different panel types as needed here

  render: ->
    {id, panel} = @props

    # get panel to render based on step progress
    panel ?= StepPanel.getPanel(id)

    # panel is one of ['review', 'multiple-choice', 'free-response', 'teacher-read-only']
    renderPanelMethod = camelCase "render-#{panel}"

    throw new Error("BUG: panel #{panel} for an exercise does not have a render method") unless @[renderPanelMethod]?
    @[renderPanelMethod]?(id)
