React = require 'react'
BS = require 'react-bootstrap'

{PinnedHeaderFooterCard} = require 'openstax-react-components'
{ExerciseStore} = require '../../flux/exercise'
Icon = require '../icon'
QuestionsControls = require './questions-controls'
SectionQuestions = require './section-questions'

QuestionsList = React.createClass


  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
    helpTooltip: React.PropTypes.string.isRequired
    sectionIds: React.PropTypes.array

  getInitialState:      -> {}
  componentWillMount:   -> ExerciseStore.on('change',  @update)
  componentWillUnmount: -> ExerciseStore.off('change', @update)
  update: -> @forceUpdate()

  renderEmpty: ->
    <div className="no-exercises">
      <h3>No exercises were found for the given sections.</h3>
      <p className="lead">Please select addtional sections and retry</p>
    </div>

  onFilterChange: (filter) ->
    if filter
      pool_type = switch filter
        when 'practice' then 'homework_core'
        when 'reading' then  'reading_dynamic'
    else
      pool_type = null
    @setState({filter, pool_type})

  renderQuestionControls: (groups) ->
    <QuestionsControls
      filter={@state.filter}
      onFilterChange={@onFilterChange}
      onSectionSelect={@scrollToSection}
      exerciseGroups={groups}
    />

  renderQuestions: (groups) ->
    for cs, exercises of groups
      <SectionQuestions key={cs} {...@props}
        chapter_section={cs} exercises={exercises} />

  render: ->
    return null if ExerciseStore.isLoading() or _.isEmpty(@props.sectionIds)
    exerciseGroups = ExerciseStore.getGroupedExercises(@props.sectionIds)
    if @state.filter
      filter = @state.pool_type
      filteredGroups = _.mapValues exerciseGroups, (exercises, section) ->
        _.filter exercises, (ex) -> -1 isnt ex.pool_types.indexOf(filter)
      exerciseGroups = _.pick filteredGroups, (exercises) -> not _.isEmpty(exercises)

    questions = if _.isEmpty(exerciseGroups)
      @renderEmpty()
    else
      @renderQuestions(exerciseGroups)

    <div className="questions-list">
      <div className="instructions">
        <div className="wrapper">
          Click each question that you would like to exclude from
          all aspects of your students’ Tutor experience.
          <Icon type='question-circle' tooltip={@props.helpTooltip} />
        </div>
      </div>

      <PinnedHeaderFooterCard
        containerBuffer={50}
        header={@renderQuestionControls(exerciseGroups)}
        cardType='sections-questions'
      >

      {questions}

      </PinnedHeaderFooterCard>
    </div>


module.exports = QuestionsList
