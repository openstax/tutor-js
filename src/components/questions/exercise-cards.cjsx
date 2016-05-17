React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseActions, ExerciseStore} = require '../../flux/exercise'
Dialog = require '../tutor-dialog'
ExerciseCard = require './exercise'
ScrollTo = require '../scroll-to-mixin'

ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'

SectionsExercises = React.createClass

  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
    exercises:   React.PropTypes.array.isRequired
    chapter_section: React.PropTypes.string.isRequired

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

  onExerciseToggle: (exercise, isSelected) ->
    if isSelected and ExerciseStore.isExcludedAtMinimum(@props.exercises)
      Dialog.show(
        className: 'question-library-min-exercise-exclusions'
        title: '', body: @renderMinimumExclusionWarning()
        buttons: [
          <BS.Button key='exclude'
            onClick={->
              ExerciseActions.setExerciseExclusion(exercise.id, isSelected)
              Dialog.hide()
            }>Exclude</BS.Button>

          <BS.Button key='cancel' bsStyle='primary'
            onClick={-> Dialog.hide()} bsStyle='primary'>Cancel</BS.Button>
        ]
      )
    else
      ExerciseActions.setExerciseExclusion(exercise.id, isSelected)

  render: ->
    title = TocStore.getSectionLabel(@props.chapter_section)?.title

    <div className='exercise-sections' data-section={@props.chapter_section}>
      <label className='exercises-section-label'>
        <ChapterSection section={@props.chapter_section}/> {title}
      </label>
      <div className="exercises">
      {for exercise in @props.exercises
        <ExerciseCard key={exercise.id}
          isExcluded={ExerciseStore.isExerciseExcluded(exercise.id)}
          exercise={exercise}
          onDetailsClick={@props.onDetailsClick}
          onExerciseToggle={@onExerciseToggle} />}
      </div>
    </div>



ExerciseCards = React.createClass

  propTypes:
    exercises:  React.PropTypes.object.isRequired
    scrollFast: React.PropTypes.bool

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
