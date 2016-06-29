React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'

Dialog = require '../tutor-dialog'

ExerciseHelpers = require '../../helpers/exercise'

ScrollTo = require '../scroll-to-mixin'

ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'
ExercisePreview = require './preview'

SectionsExercises = React.createClass

  propTypes:
    exercises:              React.PropTypes.array.isRequired
    chapter_section:        React.PropTypes.string.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    onExerciseToggle:       React.PropTypes.func.isRequired
    getExerciseIsSelected:  React.PropTypes.func.isRequired
    getExerciseActions:     React.PropTypes.func.isRequired

  render: ->
    title = TocStore.getSectionLabel(@props.chapter_section)?.title
    # IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
    <div className='exercise-sections' data-section={@props.chapter_section}>
      <label className='exercises-section-label'>
        <ChapterSection section={@props.chapter_section}/> {title}
      </label>
      <div className="exercises">
        {for exercise in @props.exercises
          <ExercisePreview {...@props} exercise={exercise} />}
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
