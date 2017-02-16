_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'

{TocStore} = require '../../flux/toc'

Dialog = require '../tutor-dialog'

ExerciseHelpers = require '../../helpers/exercise'

{ScrollToMixin} = require 'shared'

ChapterSection = require '../task-plan/chapter-section'
Icon = require '../icon'
ExercisePreview = require './preview'

SectionsExercises = React.createClass
  displayName: 'SectionsExercises'
  propTypes:
    ecosystemId:            React.PropTypes.string.isRequired
    exercises:              React.PropTypes.array.isRequired
    chapter_section:        React.PropTypes.string.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    onExerciseToggle:       React.PropTypes.func.isRequired
    getExerciseIsSelected:  React.PropTypes.func.isRequired
    getExerciseActions:     React.PropTypes.func.isRequired
    watchStore:             React.PropTypes.object.isRequired
    watchEvent:             React.PropTypes.string.isRequired

  render: ->
    title = TocStore.findChapterSection(@props.ecosystemId, @props.chapter_section)?.title

    # IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
    <div className='exercise-sections' data-section={@props.chapter_section}>
      <label className='exercises-section-label'>
        <ChapterSection section={@props.chapter_section}/> {title}
      </label>
      <div className="exercises">
        {for exercise in @props.exercises
          <ExercisePreview key={exercise.id} {...@props} exercise={exercise} />}
      </div>
    </div>



ExerciseCards = React.createClass
  displayName: 'ExerciseCards'
  propTypes:
    ecosystemId:            React.PropTypes.string.isRequired
    exercises:              React.PropTypes.object.isRequired
    onExerciseToggle:       React.PropTypes.func.isRequired
    getExerciseIsSelected:  React.PropTypes.func.isRequired
    getExerciseActions:     React.PropTypes.func.isRequired
    onShowDetailsViewClick: React.PropTypes.func.isRequired
    focusedExerciseId:      React.PropTypes.string
    topScrollOffset:        React.PropTypes.number
    watchStore:             React.PropTypes.object.isRequired
    watchEvent:             React.PropTypes.string.isRequired

  mixins: [ScrollToMixin]

  getDefaultProps: ->
    topScrollOffset: 110

  # Important! - as an optimization, this component will only update if props have changed.
  # This is necessary because there can be a very large number of exercise previews displaying at once
  shouldComponentUpdate: (nextProps) ->
    not _.isEqual(nextProps, @props)

  componentDidMount:   ->
    if @props.focusedExerciseId
      @scrollToSelector("[data-exercise-id='#{@props.focusedExerciseId}']", immediate: true)
    else
      @scrollToSelector('.exercise-sections')

  onAfterScroll: (el) ->
    el.focus() if @props.focusedExerciseId

  getScrollTopOffset: ->
    # no idea why scrollspeed makes the difference, sorry :(
    if @props.scrollFast then @props.topScrollOffset else @props.topScrollOffset + 40

  render: ->
    chapter_sections = _.keys @props.exercises.grouped

    if chapter_sections?.length
      sections = _.map(chapter_sections, (cs) =>
        <SectionsExercises key={cs}
          {...@props}
          chapter_section={cs}
          exercises={@props.exercises.grouped[cs]}
        />
      )
    else
      sections = <p className="no-exercises-found">
        No exercises found in the selected sections.
      </p>

    <div className="exercise-cards">
      {sections}
    </div>

module.exports = ExerciseCards
