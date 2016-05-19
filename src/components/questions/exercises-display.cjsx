React = require 'react'
BS = require 'react-bootstrap'

{PinnedHeaderFooterCard} = require 'openstax-react-components'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
Icon = require '../icon'
ExerciseControls = require './exercise-controls'
ExerciseDetails  = require './exercise-details'
ExerciseCards    = require './exercise-cards'
ScrollSpy        = require '../scroll-spy'
Sectionizer      = require './sectionizer'
NoExercisesFound = require './no-exercises-found'

ExercisesDisplay = React.createClass

  propTypes:
    courseId:        React.PropTypes.string.isRequired
    helpTooltip:     React.PropTypes.string.isRequired
    sectionIds:      React.PropTypes.array

  getInitialState: -> {
    filter: ''
    currentView: 'cards'
    showingCardsFromDetailsView: false
  }
  componentWillMount:   -> ExerciseStore.on('change',  @update)
  componentWillUnmount: -> ExerciseStore.off('change', @update)
  update: -> @forceUpdate()


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
      currentView={@state.currentView}
      onFilterChange={@onFilterChange}
      onSectionSelect={@scrollToSection}
      onShowCardViewClick={@onShowCardViewClick}
      onShowDetailsViewClick={@onShowDetailsViewClick}
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

  onShowDetailsViewClick: (ev, exercise) ->
    exercise ||= _.first ExerciseStore.get(@props.sectionIds)
    @setState(
      selectedExercise: exercise,
      currentView: 'details'
      currentSection: ExerciseStore.getChapterSectionOfExercise(exercise)
    )
    @props.onShowDetailsViewClick(ev, exercise)

  onShowCardViewClick: (ev, exercise) ->
    # The pinned header doesn't notice when the elements above it are unhidden
    # and will never unstick by itself.
    @refs.controls.unPin()
    @setState({currentView: 'cards', showingCardsFromDetailsView: true})
    @props.onShowCardViewClick(ev, exercise)

  onExerciseToggle: (ev, exercise) ->
    isSelected = not ExerciseStore.isExerciseExcluded(exercise.id)
    if isSelected and ExerciseStore.isExcludedAtMinimum(ExerciseStore.get(@props.sectionIds))
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
    @forceUpdate()

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
        onShowDetailsViewClick={@onShowDetailsViewClick} />

  render: ->
    return null if ExerciseStore.isLoading() or _.isEmpty(@props.sectionIds)

    exercises = ExerciseStore.groupBySectionsAndTypes(@props.sectionIds)
    selectedExercises = if @state.filter then exercises[@state.filter] else exercises.all
    questions = if selectedExercises.count
      @renderQuestions(selectedExercises)
    else
      <NoExercisesFound />

    <div className="exercises-display">
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
