React     = require 'react'
BS        = require 'react-bootstrap'
keymaster = require 'keymaster'

{ExerciseStore} = require '../../flux/exercise'
ExerciseCard    = require './exercise'
Icon            = require '../icon'
ScrollTo        = require '../scroll-to-mixin'

KEYBINDING_SCOPE = 'exercise-details'

ExerciseDetails = React.createClass

  propTypes:
    selectedExercise: React.PropTypes.object.isRequired
    selectedSection:  React.PropTypes.string
    exercises: React.PropTypes.object.isRequired
    onSectionChange: React.PropTypes.func.isRequired

  mixins: [ScrollTo]
  scrollingTargetDOM: -> document
  getScrollTopOffset: -> 60

  getInitialState: -> {}

  componentDidMount:   ->
    @scrollToSelector('.questions-controls', {immediate: true})

  componentWillUnmount: ->
    keymaster.deleteScope(KEYBINDING_SCOPE)

  componentWillMount: ->
    keymaster('left',  KEYBINDING_SCOPE, @onPrev)
    keymaster('right', KEYBINDING_SCOPE, @onNext)
    keymaster.setScope(KEYBINDING_SCOPE)

    exercises = @flattenExercises(@props)
    currentIndex = currentSection = 0
    for exercise, index in exercises
      if selectedExercise?.id is exercise.id
        currentIndex = index
        currentSection = section
        break
    @setState({exercises, currentIndex, currentSection})

  componentWillReceiveProps: (nextProps) ->
    exercises = @flattenExercises(nextProps)
    {selectedSection} = nextProps
    nextState = {exercises}
    if selectedSection and selectedSection isnt @state.currentSection
      for exercise, index in exercises
        if selectedSection is exercise.section
          nextState.currentSection = selectedSection
          nextState.currentIndex = index
          break
    @setState(nextState)


  flattenExercises: (props) ->
    groups = props.exercises.grouped
    exercises = []
    for section in _.keys(groups).sort()
      for exercise in groups[section]
        exercises.push _.extend({}, exercise, section: section)
    return exercises

  onPrev: -> @moveTo(@state.currentIndex - 1) if @getValidMovements().prev
  onNext: -> @moveTo(@state.currentIndex + 1) if @getValidMovements().next

  moveTo: (index) ->
    exercise = @state.exercises[index]
    unless @state.currentSection is exercise.section
      # defer is needed to allow setState to complete before callback is fired
      # otherwise component recieves props with the new section and doesn't know it's already on it
      # causing it to jump to the first exercise in section
      _.defer => @props.onSectionChange(exercise.section)
    @setState({currentIndex: index, currentSection: exercise.section})

  getValidMovements: ->
    prev: @state.currentIndex isnt 0
    next: @state.currentIndex isnt @state.exercises.length - 1

  render: ->
    exercise = @state.exercises[@state.currentIndex]

    moves = @getValidMovements()

    <div className="exercise-details">

      {<div className="page-navigation prev" onClick={@onPrev}>
        <div className='triangle' />
      </div> if moves.prev}

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
      </div> if moves.next}

    </div>

module.exports = ExerciseDetails
