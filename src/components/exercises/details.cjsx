React     = require 'react'
BS        = require 'react-bootstrap'
keymaster = require 'keymaster'

{ExerciseStore}   = require '../../flux/exercise'
{ExercisePreview} = require 'openstax-react-components'
NoExercisesFound  = require './no-exercises-found'
Icon              = require '../icon'
ScrollTo          = require '../scroll-to-mixin'

KEYBINDING_SCOPE  = 'exercise-details'

ExerciseDetails = React.createClass

  propTypes:
    selectedExercise:      React.PropTypes.object.isRequired
    selectedSection:       React.PropTypes.string
    exercises:             React.PropTypes.object.isRequired
    onSectionChange:       React.PropTypes.func
    onExerciseToggle:      React.PropTypes.func.isRequired
    onShowCardViewClick:   React.PropTypes.func.isRequired
    topScrollOffset:       React.PropTypes.number
    getExerciseActions:    React.PropTypes.func.isRequired
    getExerciseIsSelected: React.PropTypes.func.isRequired

  mixins: [ScrollTo]
  scrollingTargetDOM: -> document
  getDefaultProps: ->
    topScrollOffset: 40
  getScrollTopOffset: ->
    @props.topScrollOffset

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
      for exercise, index in exercises
        section = ExerciseStore.getChapterSectionOfExercise(exercise)
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
    unless @state.currentSection is section and @props.onSectionChange
      # defer is needed to allow setState to complete before callback is fired
      # otherwise component recieves props with the new section and doesn't know it's already on it
      # causing it to jump to the first exercise in section
      _.defer => @props.onSectionChange(section)
    @setState({currentIndex: index, currentSection: section})

  getValidMovements: ->
    prev: @state.currentIndex isnt 0
    next: @state.currentIndex isnt @state.exercises.length - 1

  # toggleFeedback: ->
  #   @setState(displayFeedback: not @state.displayFeedback)

  render: ->
    exercise = @state.exercises[@state.currentIndex] or _.first(@state.exercises)
    unless exercise
      return <NoExercisesFound />

    moves = @getValidMovements()
    isExcluded = ExerciseStore.isExerciseExcluded(exercise.id)
    # actions = ExerciseHelpers.buildPreviewActions(exercise, @props.onExerciseToggle)
    # if @state.displayFeedback
    #   actions['feedback-off'] =
    #     message: 'Hide Feedback'
    #     handler: @toggleFeedback
    # else
    #   actions['feedback-on'] =
    #     message: 'Preview Feedback'
    #     handler: @toggleFeedback
    # actions['report-error'] =
    #     message: 'Report an error'
    #     handler: @reportError

    <div className="exercise-details">

      <div className="controls">
        <a className="show-cards" onClick={@props.onShowCardViewClick}>
          <Icon type="th-large" /> Back to Card View
        </a>
      </div>

      <div className="content">

        {<div className="page-navigation prev" onClick={@onPrev}>
          <div className='triangle' />
         </div> if moves.prev}

        <ExercisePreview
          className='exercise-card'
          isVerticallyTruncated={false}
          isSelected={@props.getExerciseIsSelected(exercise)}
          overlayActions={@props.getExerciseActions(exercise)}
          displayFeedback={@props.displayFeedback}

          exercise={exercise}
          actionsOnSide={true}

        />
      </div>
      {<div className="page-navigation next" onClick={@onNext}>
        <div className='triangle' />
       </div> if moves.next}

    </div>

module.exports = ExerciseDetails
