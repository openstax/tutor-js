React     = require 'react'
BS        = require 'react-bootstrap'
keymaster = require 'keymaster'

{ExerciseStore} = require '../../flux/exercise'
{ExercisePreview, ExerciseTroubleUrl} = require 'openstax-react-components'
exerciseActionsBuilder = require './exercise-actions-builder'

Icon            = require '../icon'
ScrollTo        = require '../scroll-to-mixin'

KEYBINDING_SCOPE = 'exercise-details'

ExerciseDetails = React.createClass

  propTypes:
    selectedExercise: React.PropTypes.object.isRequired
    selectedSection:  React.PropTypes.string
    exercises: React.PropTypes.object.isRequired
    onSectionChange: React.PropTypes.func.isRequired
    onExerciseToggle: React.PropTypes.func.isRequired

  mixins: [ScrollTo]
  scrollingTargetDOM: -> document
  getScrollTopOffset: -> 80

  getInitialState: -> {}

  componentDidMount:   ->
    @scrollToSelector('.questions-controls', {immediate: true})

  componentWillUnmount: ->
    keymaster.deleteScope(KEYBINDING_SCOPE)

  componentWillMount: ->
    keymaster('left',  KEYBINDING_SCOPE, @keyOnPrev)
    keymaster('right', KEYBINDING_SCOPE, @keyOnNext)
    keymaster.setScope(KEYBINDING_SCOPE)

    {selectedExercise} = @props
    exercises = @flattenExercises(@props)
    currentIndex = currentSection = 0
    for exercise, index in exercises
      if selectedExercise?.id is exercise.id
        currentIndex = index
        currentSection = ExerciseStore.getChapterSectionOfExercise(exercise)
        break
    @setState({exercises, currentIndex, currentSection})

  componentWillReceiveProps: (nextProps) ->
    exercises = @flattenExercises(nextProps)
    {selectedSection} = nextProps
    nextState = {exercises}
    if selectedSection and selectedSection isnt @state.currentSection
      section = ExerciseStore.getChapterSectionOfExercise(exercise)
      for exercise, index in exercises
        if selectedSection is section
          nextState.currentSection = selectedSection
          nextState.currentIndex = index
          break
    @setState(nextState)

  flattenExercises: (props) ->
    groups = props.exercises.grouped
    exercises = []
    for section in _.keys(groups).sort()
      for exercise in groups[section]
        exercises.push exercise
    return exercises

  toggleNavHighlight: (type) ->
    nav = @getDOMNode().querySelector(".page-navigation.#{type}")
    nav.classList.add('active')
    _.delay ->
      nav.classList.remove('active')
    , 300

  keyOnPrev: ->
    return unless @getValidMovements().prev
    @toggleNavHighlight('prev')
    @onPrev()
  keyOnNext: ->
    return unless @getValidMovements().next
    @toggleNavHighlight('next')
    @onNext()
  onPrev: -> @moveTo(@state.currentIndex - 1)
  onNext: -> @moveTo(@state.currentIndex + 1)

  moveTo: (index) ->
    exercise = @state.exercises[index]
    section = ExerciseStore.getChapterSectionOfExercise(exercise)
    unless @state.currentSection is section
      # defer is needed to allow setState to complete before callback is fired
      # otherwise component recieves props with the new section and doesn't know it's already on it
      # causing it to jump to the first exercise in section
      _.defer => @props.onSectionChange(section)
    @setState({currentIndex: index, currentSection: section})

  getValidMovements: ->
    prev: @state.currentIndex isnt 0
    next: @state.currentIndex isnt @state.exercises.length - 1

  toggleFeedback: ->
    @setState(displayFeedback: not @state.displayFeedback)

  reportError: (ev, exercise) ->
    window.open(ExerciseTroubleUrl.generate(exerciseId: exercise.content.uid), '_blank')

  render: ->
    exercise = @state.exercises[@state.currentIndex]
    moves = @getValidMovements()
    isExcluded = ExerciseStore.isExerciseExcluded(exercise.id)
    actions = exerciseActionsBuilder(exercise, @props.onExerciseToggle, {
      feedback:
        message: 'Preview Feedback'
        handler: @toggleFeedback
      'report-error':
        message: 'Report an error'
        handler: @reportError
    })

    <div className="exercise-details">

      {<div className="page-navigation prev" onClick={@onPrev}>
        <div className='triangle' />
      </div> if moves.prev}

      <div className="controls">
        <a className="show-cards" onClick={@props.onShowCardViewClick}>
          <Icon type="th" /> Back to Card View
        </a>
      </div>

      <ExercisePreview
        className='exercise-card'
        isVerticallyTruncated={false}
        isSelected={false}
        displayFeedback={@state.displayFeedback}
        exercise={exercise}
        actionsOnSide={true}
        overlayActions={actions}
      />

      {<div className="page-navigation next" onClick={@onNext}>
        <div className='triangle' />
      </div> if moves.next}

    </div>

module.exports = ExerciseDetails
