React = require 'react'
BS = require 'react-bootstrap'

{PinnedHeaderFooterCard} = require 'openstax-react-components'
{ExerciseStore} = require '../../flux/exercise'
Icon = require '../icon'
ExerciseControls = require './Exercise-controls'
ExerciseDetails  = require './exercise-details'
ExerciseCards    = require './exercise-cards'
ScrollSpy        = require '../scroll-spy'
Sectionizer      = require './sectionizer'

ExercisesDisplay = React.createClass

  propTypes:
    courseId:        React.PropTypes.string.isRequired
    helpTooltip:     React.PropTypes.string.isRequired
    sectionIds:      React.PropTypes.array

  getInitialState: -> {
    filter: 'reading'
    showingCardsFromDetailsView: false
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

    sections = _.keys exercises.all.grouped

    if @props.showingDetails
      sectionizerProps =
        currentSection: @state.currentSection
        onSectionClick: @setCurrentSection

    <ExerciseControls
      filter={@state.filter}
      courseId={@props.courseId}
      onFilterChange={@onFilterChange}
      onSectionSelect={@scrollToSection}
      exercises={exercises}
    >
      <ScrollSpy dataSelector='data-section' >
        <Sectionizer
          ref="sectionizer"
          {...sectionizerProps}
          onScreenElements={[]}
          chapter_sections={sections} />
      </ScrollSpy>
    </ExerciseControls>

  # called by sectionizer and details view
  setCurrentSection: (currentSection) ->
    @setState({currentSection})

  onDetailsViewClick: (ev, exercise) ->
    @setState(
      selectedExercise: exercise,
      currentSection: ExerciseStore.getChapterSectionOfExercise(exercise)
    )
    @props.onShowDetailsViewClick(ev, exercise)

  onShowCardViewClick: (ev, exercise) ->
    # The pinned header doesn't notice when the elements above it are unhidden
    # and will never unstick by itself.
    @refs.controls.unPin()
    @setState({showingCardsFromDetailsView: true})
    @props.onShowCardViewClick(ev, exercise)

  onExerciseToggle: (ev, exercise) ->
    isSelected = not ExerciseStore.isExerciseExcluded(exercise.id)
    if isSelected and ExerciseStore.isExcludedAtMinimum(@props.exercises)
      Dialog.show(
        className: 'question-library-min-exercise-exclusions'
        title: '', body: @renderMinimumExclusionWarning()
        buttons: [
          <BS.Button key='exclude'
            onClick={->
              ExerciseActions.setExerciseExclusion(exercise.id, isSelected)
              Dialog.hide()
            }>Exclude</BS.Button>

          <BS.Button key='cancel' bsStyle='primary'
            onClick={-> Dialog.hide()} bsStyle='primary'>Cancel</BS.Button>
        ]
      )
    else
      ExerciseActions.setExerciseExclusion(exercise.id, isSelected)

  renderQuestions: (exercises) ->
    if @props.showingDetails
      <ExerciseDetails
        ref='details'
        exercises={exercises}
        selectedExercise={@state.selectedExercise}
        selectedSection={@state.currentSection}
        onSectionChange={@setCurrentSection}
        onExerciseToggle={@onExerciseToggle}
        onShowCardViewClick={@onShowCardViewClick} />
    else
      <ExerciseCards
        scrollFast={@state.showingCardsFromDetailsView}
        onExerciseToggle={@onExerciseToggle}
        exercises={exercises}
        onDetailsClick={@onDetailsViewClick} />

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
