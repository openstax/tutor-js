React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'
{ExerciseActions, ExerciseStore} = require '../../flux/exercise'
Dialog = require '../tutor-dialog'
{ExercisePreview} = require 'openstax-react-components'

ExerciseHelpers = require '../../helpers/exercise'

ScrollTo = require '../scroll-to-mixin'

ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'

SectionsExercises = React.createClass

  propTypes:
    exercises:              React.PropTypes.array.isRequired
    chapter_section:        React.PropTypes.string.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    onExerciseToggle:       React.PropTypes.func.isRequired
    getExerciseIsSelected:  React.PropTypes.func.isRequired
    getExerciseActions:     React.PropTypes.func.isRequired

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

    <ExercisePreview
      key={exercise.id}
      className='exercise-card'
      isInteractive={false}
      isVerticallyTruncated={true}
      isSelected={@props.getExerciseIsSelected(exercise)}
      exercise={exercise}
      onOverlayClick={@onExerciseToggle}
      overlayActions={@props.getExerciseActions(exercise)}
    />

  render: ->
    title = TocStore.getSectionLabel(@props.chapter_section)?.title
    # IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
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
    exercises:              React.PropTypes.object.isRequired
    onExerciseToggle:       React.PropTypes.func.isRequired
    getExerciseIsSelected:  React.PropTypes.func.isRequired
    getExerciseActions:     React.PropTypes.func.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    topScrollOffset:        React.PropTypes.number

  mixins: [ScrollTo]

  getDefaultProps: ->
    topScrollOffset: 110

  # Important! - as an optimization, this component will only update if props have changed.
  # This is necessary because there can be a very large number of exercise previews displaying at once
  shouldComponentUpdate: (nextProps) ->
    not _.isEqual(nextProps, @props)

  componentDidMount:   ->
    @scrollToSelector('.exercise-sections')

  getScrollTopOffset: ->
    # no idea why scrollspeed makes the difference, sorry :(
    if @props.scrollFast then @props.topScrollOffset else @props.topScrollOffset + 40

  render: ->
    chapter_sections = _.keys @props.exercises.grouped

    <div className="exercise-cards">
      {for cs in chapter_sections
        <SectionsExercises key={cs}
          {...@props}
          chapter_section={cs}
          exercises={@props.exercises.grouped[cs]} />}
    </div>

module.exports = ExerciseCards
