React = require 'react'
_ = require 'underscore'

LoadingExercises = require './loading-exercises-mixin'
{PinnedHeaderFooterCard} = require 'openstax-react-components'

{ExerciseStore, ExerciseActions} = require '../../../flux/exercise'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
ExerciseHelpers  = require '../../../helpers/exercise'
ExerciseControls = require './exercise-controls'
ExerciseDetails  = require '../../exercises/details'
ExerciseCards    = require '../../exercises/cards'
ScrollTo         = require '../../scroll-to-mixin'

AddExercises = React.createClass

  propTypes:
    planId:     React.PropTypes.string.isRequired
    courseId:   React.PropTypes.string.isRequired
    onAddClick: React.PropTypes.func.isRequired
    sectionIds: React.PropTypes.array

  getInitialState: ->
    { currentView: 'cards' }

  mixins: [ScrollTo, LoadingExercises]

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

  setCurrentSection: (currentSection) ->
    @scrollToSelector("[data-section='#{currentSection}']")
    @setState({currentSection})


  render: ->
    return @renderLoading() if @exercisesAreLoading()

    exercises = ExerciseStore.groupBySectionsAndTypes(@props.sectionIds)

    sharedProps =
        exercises: exercises.all
        onExerciseToggle: @onExerciseToggle
        getExerciseActions: @getExerciseActions
        getExerciseIsSelected: @getExerciseIsSelected

    body = switch @state.currentView
      when 'details'
        <ExerciseDetails
          {...sharedProps}
          topScrollOffset={60}
          selectedExercise={@state.selectedExercise}
          onSectionChange={@setCurrentSection}
          selectedSection={@state.currentSection}
          displayFeedback={@state.displayFeedback}
          onShowCardViewClick={@onShowCardViewClick}
        />
      else
        <ExerciseCards
          {...sharedProps}
          topScrollOffset={110}
          onShowDetailsViewClick={@onShowDetailsViewClick}
        />

    controls =
      <ExerciseControls
        canReview={true}
        currentView={@state.currentView}
        canAdd={@props.canEdit}
        reviewClicked={@props.hide}
        onCancel={@props.cancel}
        addClicked={@props.onAddClick}
        planId={@props.planId}
        onShowCardViewClick={@onShowCardViewClick}
        onShowDetailsViewClick={@onShowDetailsViewClick}
        sectionizerProps={
          currentSection: @state.currentSection
          onSectionClick: @setCurrentSection
          nonAvailableWidth: 600
          chapter_sections: _.keys(exercises.all.grouped)
        }
      />

    <PinnedHeaderFooterCard
      containerBuffer={50}
      header={controls}
      cardType='homework-builder'>
      {body}
    </PinnedHeaderFooterCard>

module.exports = AddExercises
