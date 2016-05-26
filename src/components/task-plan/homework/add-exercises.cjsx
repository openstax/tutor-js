React = require 'react'
_ = require 'underscore'

LoadingExercises = require './loading-exercises-mixin'

{ExerciseStore, ExerciseActions} = require '../../../flux/exercise'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
ExerciseHelpers  = require '../../../helpers/exercise'

ExerciseDetails  = require '../../exercises/details'
ExerciseCards    = require '../../exercises/cards'

AddExercises = React.createClass

  propTypes:
    planId:     React.PropTypes.string.isRequired
    courseId:   React.PropTypes.string.isRequired
    sectionIds: React.PropTypes.array

  getInitialState: ->
    { currentView: 'cards' }

  mixins: [LoadingExercises]

  onShowDetailsViewClick: -> @setState(currentView: 'details')
  onShowCardViewClick:    -> @setState(currentView: 'cards')

  onExerciseToggle: (ev, exercise) ->
    if @getExerciseIsSelected(exercise)
      TaskPlanActions.removeExercise(@props.planId, exercise)
    else
      TaskPlanActions.addExercise(@props.planId, exercise)

  getExerciseActions: (exercise) ->
    actions = {}
    if @getExerciseIsSelected(exercise)
      actions.exclude =
        message: 'Remove question'
        handler: @onExerciseToggle
    else
      actions.include =
        message: 'Add question'
        handler: @onExerciseToggle
    if @state.currentView is 'details'
      @addDetailsActions(actions, exercise)
    else
      @addCardActions(actions, exercise)

    actions

  addDetailsActions: (actions, exercise) ->
    if @state.displayFeedback
      actions['feedback-off'] =
        message: 'Hide Feedback'
        handler: @toggleFeedback
    else
      actions['feedback-on'] =
        message: 'Preview Feedback'
        handler: @toggleFeedback
    actions['report-error'] =
        message: 'Report an error'
        handler: @reportError

  addCardActions: (actions, exercise) ->
    actions.details =
      message: 'Question details'
      handler: @showDetails

  reportError: (ev, exercise) ->
    ExerciseHelpers.openReportErrorPage(exercise)

  toggleFeedback: ->
    @setState(displayFeedback: not @state.displayFeedback)

  showDetails: (ev, selectedExercise) ->
    @setState({currentView: 'details', selectedExercise})

  getExerciseIsSelected: (exercise) ->
    TaskPlanStore.hasExercise(@props.planId, exercise.id)

  render: ->
    return @renderLoading() if @exercisesAreLoading()

    exercises = ExerciseStore.groupBySectionsAndTypes(@props.sectionIds)
    sharedProps =
        exercises: exercises.all
        onExerciseToggle: @onExerciseToggle
        getExerciseActions: @getExerciseActions
        getExerciseIsSelected: @getExerciseIsSelected

    if @state.currentView is 'details'
      <ExerciseDetails
        {...sharedProps}
        selectedExercise={@state.selectedExercise}
        displayFeedback={@state.displayFeedback}
        onShowCardViewClick={@onShowCardViewClick}
      />
    else
      <ExerciseCards
        {...sharedProps}
        topScrollOffset={150}
        onShowDetailsViewClick={@onShowDetailsViewClick}
      />


module.exports = AddExercises
