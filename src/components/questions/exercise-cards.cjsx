React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseActions, ExerciseStore} = require '../../flux/exercise'
Dialog = require '../tutor-dialog'
{ExercisePreview} = require 'openstax-react-components'

exerciseActionsBuilder = require './exercise-actions-builder'

ScrollTo = require '../scroll-to-mixin'

ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'

SectionsExercises = React.createClass

  propTypes:
    exercises:   React.PropTypes.array.isRequired
    chapter_section: React.PropTypes.string.isRequired
    onDetailsClick: React.PropTypes.func.isRequired
    onExerciseToggle: React.PropTypes.func.isRequired

  renderMinimumExclusionWarning: ->
    [
      <Icon key="icon" type="exclamation" />
      <div key="message" className="message">
        <p>
          Tutor needs at least 5 questions for this topic to be
          included in spaced practice and personalized learning.
        </p>
        <p>
          If you exclude too many, your students will not get to practice on this topic.
        </p>
      </div>
    ]

  renderExercise: (exercise) ->
    actions = exerciseActionsBuilder(exercise, @props.onExerciseToggle, {
      details:
        message: 'Question details'
        handler: @props.onDetailsClick
    })

    <ExercisePreview
      key={exercise.id}
      className='exercise-card'
      isVerticallyTruncated={true}
      isSelected={ExerciseStore.isExerciseExcluded(exercise.id)}
      exercise={exercise}
      onOverlayClick={@onExerciseToggle}
      overlayActions={actions}
    />

  render: ->
    title = TocStore.getSectionLabel(@props.chapter_section)?.title

    <div className='exercise-sections' data-section={@props.chapter_section}>
      <label className='exercises-section-label'>
        <ChapterSection section={@props.chapter_section}/> {title}
      </label>
      <div className="exercises">
        {@renderExercise(exercise) for exercise in @props.exercises}
      </div>
    </div>



ExerciseCards = React.createClass

  propTypes:
    exercises:  React.PropTypes.object.isRequired
    onDetailsClick: React.PropTypes.func.isRequired
    scrollFast: React.PropTypes.bool
    onExerciseToggle: React.PropTypes.func.isRequired

  mixins: [ScrollTo]

  componentDidMount:   ->
    @scrollToSelector('.exercise-sections', {immediate: @props.scrollFast})

  getScrollTopOffset: -> 140

  render: ->
    chapter_sections = _.keys(@props.exercises.grouped).sort()

    <div className="exercise-cards">
      {for cs in chapter_sections
        <SectionsExercises key={cs}
          {...@props}
          chapter_section={cs}
          exercises={@props.exercises.grouped[cs]} />}
    </div>

module.exports = ExerciseCards
