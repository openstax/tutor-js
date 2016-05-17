React = require 'react'
BS = require 'react-bootstrap'

{ExerciseStore} = require '../../flux/exercise'
ExerciseCard = require './exercise'
Icon = require '../icon'
ScrollTo = require '../scroll-to-mixin'

ExerciseDetails = React.createClass

  propTypes:
    selected: React.PropTypes.object.isRequired
    exercises: React.PropTypes.object.isRequired

  mixins: [ScrollTo]

  componentDidMount:   ->
    @scrollToSelector('.questions-controls', {immediate: true})


  scrollingTargetDOM: -> document
  getScrollTopOffset: -> 60

  componentWillMount: ->
    @flattenExercises(@props.selected, @props.exercises.grouped)

  componentWillReceiveProps: (nextProps) ->
    @flattenExercises(nextProps.selected, nextProps.exercises.grouped)

  flattenExercises: (selected, groups) ->
    exercises = []
    currentIndex = 0
    for section in _.keys(groups).sort()
      for exercise in groups[section]
        currentIndex = exercises.length if selected.id is exercise.id
        exercises.push _.extend({}, exercise, section: section)

    @setState({currentIndex, exercises})

  onPrev: -> @setState({currentIndex: @state.currentIndex - 1})
  onNext: -> @setState({currentIndex: @state.currentIndex + 1})

  render: ->
    exercise = @state.exercises[@state.currentIndex]

    navs =
      prev: @state.currentIndex isnt 0
      next: @state.currentIndex isnt @state.exercises.length - 1

    <div className="exercise-details">

      {<div className="page-navigation prev" onClick={@onPrev}>
        <div className='triangle' />
      </div> if navs.prev}

      <div className="controls">
        <a className="show-cards" onClick={@props.onShowCardViewClick}>
          <Icon type="th" /> Back to Card View
        </a>
      </div>

      <ExerciseCard key={exercise.id}
        isExcluded={ExerciseStore.isExerciseExcluded(exercise.id)}
        exercise={exercise}
        interactive={true}
        onExerciseToggle={@onExerciseToggle}
      />

      {<div className="page-navigation next" onClick={@onNext}>
        <div className='triangle' />
      </div> if navs.next}

    </div>

module.exports = ExerciseDetails
