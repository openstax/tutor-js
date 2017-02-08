_         = require 'underscore'
React     = require 'react'
BS        = require 'react-bootstrap'

{ExerciseStore}   = require '../../flux/exercise'
{ExercisePreview, ScrollToMixin} = require 'shared'
PagingNavigation  = require '../paging-navigation'
NoExercisesFound  = require './no-exercises-found'
Icon              = require '../icon'

ExerciseDetails = React.createClass
  displayName: 'ExerciseDetails'
  propTypes:
    courseId:              React.PropTypes.string.isRequired
    ecosystemId:           React.PropTypes.string.isRequired
    selectedExercise:      React.PropTypes.object.isRequired
    selectedSection:       React.PropTypes.string
    exercises:             React.PropTypes.object.isRequired
    onSectionChange:       React.PropTypes.func
    onExerciseToggle:      React.PropTypes.func.isRequired
    onShowCardViewClick:   React.PropTypes.func.isRequired
    topScrollOffset:       React.PropTypes.number
    getExerciseActions:    React.PropTypes.func.isRequired
    getExerciseIsSelected: React.PropTypes.func.isRequired

  mixins: [ScrollToMixin]
  scrollingTargetDOM: -> document
  getDefaultProps: ->
    # leave this many pixels of space at top of component
    # Is a prop because consumers may need to adjust the top
    # position for various sized navbars
    topScrollOffset: 40
  getScrollTopOffset: ->
    @props.topScrollOffset

  getInitialState: -> {}

  componentDidMount: ->
    @scrollToSelector('.exercise-controls-bar')

  componentWillMount: ->
    {selectedExercise} = @props
    exercises = @flattenExercises(@props)
    currentIndex = currentSection = 0
    for exercise, index in exercises
      if selectedExercise?.id is exercise.id
        currentIndex = index
        currentSection = ExerciseStore.getChapterSectionOfExercise(@props.ecosystemId, exercise)
        break
    @setState({exercises, currentIndex, currentSection})

  componentWillReceiveProps: (nextProps) ->
    exercises = @flattenExercises(nextProps)
    {selectedSection} = nextProps
    nextState = {exercises}
    if selectedSection and selectedSection isnt @state.currentSection
      for exercise, index in exercises
        section = ExerciseStore.getChapterSectionOfExercise(@props.ecosystemId, exercise)
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

  onPrev: -> @moveTo(@state.currentIndex - 1)
  onNext: -> @moveTo(@state.currentIndex + 1)

  moveTo: (index) ->
    exercise = @state.exercises[index]
    section = ExerciseStore.getChapterSectionOfExercise(@props.exerciseId, exercise)
    if @props.onSectionChange and @state.currentSection isnt section
      # defer is needed to allow setState to complete before callback is fired
      # otherwise component recieves props with the new section and doesn't know it's already on it
      # causing it to jump to the first exercise in section
      _.defer => @props.onSectionChange(section)
    @setState({currentIndex: index, currentSection: section})

  getValidMovements: ->
    prev: @state.currentIndex isnt 0
    next: @state.currentIndex isnt @state.exercises.length - 1

  render: ->
    exercise = @state.exercises[@state.currentIndex] or _.first(@state.exercises)
    unless exercise
      return <NoExercisesFound />

    moves = @getValidMovements()

    isExcluded = ExerciseStore.isExerciseExcluded(exercise.id)

    <div className="exercise-details">

      <div className="controls">
        <a className="show-cards" onClick={_.partial(@props.onShowCardViewClick, _, exercise)}>
          <Icon type="th-large" /> Back to Card View
        </a>
      </div>

      <div className="content">
        <PagingNavigation
          isForwardEnabled={moves.next}
          isBackwardEnabled={moves.prev}
          onForwardNavigation={@onNext}
          onBackwardNavigation={@onPrev}
        >
          <ExercisePreview
            className='exercise-card'
            isVerticallyTruncated={false}
            isSelected={@props.getExerciseIsSelected(exercise)}
            overlayActions={@props.getExerciseActions(exercise)}
            displayFeedback={@props.displayFeedback}

            exercise={exercise}
            actionsOnSide={true}
          />
        </PagingNavigation>
      </div>

    </div>

module.exports = ExerciseDetails
