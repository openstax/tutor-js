React = require 'react'
BS = require 'react-bootstrap'

{PinnedHeaderFooterCard} = require 'openstax-react-components'
{ExerciseStore} = require '../../flux/exercise'
Icon = require '../icon'
QuestionsControls = require './questions-controls'

ExerciseDetails   = require './exercise-details'
ExerciseCards     = require './exercise-cards'

ExercisesDisplay = React.createClass

  propTypes:
    courseId:        React.PropTypes.string.isRequired
    helpTooltip:     React.PropTypes.string.isRequired
    sectionIds:      React.PropTypes.array
    focusedExercise: React.PropTypes.object

  getInitialState: -> {
    filter: 'reading'
  }
  componentWillMount:   -> ExerciseStore.on('change',  @update)
  componentWillUnmount: -> ExerciseStore.off('change', @update)
  update: -> @forceUpdate()

  renderEmpty: ->
    <div className="no-exercises">
      <h3>No exercises were found for the given sections.</h3>
      <p className="lead">Please select addtional sections and retry</p>
    </div>

  onFilterChange: (filter) ->
    @setState({filter})

  renderControls: (exercises) ->
    <QuestionsControls
      filter={@state.filter}
      courseId={@props.courseId}
      onFilterChange={@onFilterChange}
      onSectionSelect={@scrollToSection}
      exercises={exercises}
    />

  onShowCardViewClick: ->
    # The pinned header doesn't notice when the elements above it are unhidden
    # and will never unstick by itself.
    @refs.controls.unPin()
    @props.onShowCardViewClick(arguments...)

  renderQuestions: (exercises) ->
    if @props.focusedExercise
      <ExerciseDetails {...@props}
        exercise={@props.focusedExercise}
        onShowCardViewClick={@onShowCardViewClick} />
    else
      <ExerciseCards {...@props}
        exercises={exercises}
        onDetailsClick={@props.onShowDetailsViewClick} />

  render: ->
    return null if ExerciseStore.isLoading() or _.isEmpty(@props.sectionIds)

    exercises = ExerciseStore.groupBySectionsAndTypes(@props.sectionIds)
    selectedExercises = if @state.filter then exercises[@state.filter] else exercises.all
    questions = if selectedExercises.count
      @renderQuestions(selectedExercises)
    else
      @renderEmpty()

    <div className="exercises-list">
      <div className="instructions">
        <div className="wrapper">
          Click each question that you would like to exclude from
          all aspects of your students’ Tutor experience.
          <Icon type='info-circle' tooltip={@props.helpTooltip} />
        </div>
      </div>

      <PinnedHeaderFooterCard
        ref='controls'
        containerBuffer={50}
        header={@renderControls(exercises)}
        cardType='sections-questions'
      >

      {questions}

      </PinnedHeaderFooterCard>
    </div>


module.exports = ExercisesDisplay
