React = require 'react'
BS = require 'react-bootstrap'
{addons} = require 'react/addons'


{TocStore} = require '../../flux/toc'
{ExerciseActions, ExerciseStore} = require '../../flux/exercise'
Dialog = require '../tutor-dialog'
{ExercisePreview} = require 'openstax-react-components'

ExerciseHelpers = require '../../helpers/exercise'

ScrollTo = require '../scroll-to-mixin'

ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'

SectionsExercises = React.createClass

  mixins: [addons.PureRenderMixin]

  propTypes:
    exercises:   React.PropTypes.array.isRequired
    chapter_section: React.PropTypes.string.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    onExerciseToggle: React.PropTypes.func.isRequired

  renderExercise: (exercise) ->
    actions = ExerciseHelpers.buildPreviewActions(exercise, @props.onExerciseToggle, {
      details:
        message: 'Question details'
        handler: @props.onShowDetailsViewClick
    })

    <ExercisePreview
      key={exercise.id}
      className='exercise-card'
      isInteractive={false}
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
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    scrollFast: React.PropTypes.bool
    onExerciseToggle: React.PropTypes.func.isRequired

  mixins: [ScrollTo, addons.PureRenderMixin]

  componentDidMount:   ->
    @scrollToSelector('.exercise-sections', {immediate: @props.scrollFast})

  getScrollTopOffset: -> if @props.scrollFast then 110 else 150 # no idea why the difference, sorry :(

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
