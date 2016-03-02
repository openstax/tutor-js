React = require 'react'
BS = require 'react-bootstrap'

{PinnedHeaderFooterCard} = require 'openstax-react-components'
{ExerciseStore} = require '../../flux/exercise'
Icon = require '../icon'
QuestionsControls = require './questions-controls'
SectionQuestions = require './section-questions'

QuestionsList = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    helpTooltip: React.PropTypes.string.isRequired
    sectionIds: React.PropTypes.array

  getInitialState:      -> {displayType: 'cols'}
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

  renderQuestionControls: (exercises) ->
    <QuestionsControls
      filter={@state.filter}
      courseId={@props.courseId}
      onFilterChange={@onFilterChange}
      onSectionSelect={@scrollToSection}
      exercises={exercises}
    />

  renderQuestions: (exercises) ->
    chapter_sections = _.keys(exercises.grouped).sort()
    for cs in chapter_sections
      <SectionQuestions key={cs} {...@props}
        chapter_section={cs} exercises={exercises.grouped[cs]} />

  changeDisplay: (ev) ->
    @setState({displayType: ev.currentTarget.value})

  render: ->
    return null if ExerciseStore.isLoading() or _.isEmpty(@props.sectionIds)

    exercises = ExerciseStore.groupBySectionsAndTypes(@props.sectionIds)
    selectedExercises = if @state.filter then exercises[@state.filter] else exercises.all
    questions = if selectedExercises.count
      @renderQuestions(selectedExercises)
    else
      @renderEmpty()

    <div className={"questions-list #{@state.displayType}"}>
      <div className="instructions">
        <div className="wrapper">
          Click each question that you would like to exclude from
          all aspects of your students’ Tutor experience.
          <Icon type='question-circle' tooltip={@props.helpTooltip} />
        </div>
      </div>

      <PinnedHeaderFooterCard
        containerBuffer={50}
        header={@renderQuestionControls(exercises)}
        cardType='sections-questions'
      >

      <div>
        <b>UX DISPLAY TEST:</b>
        <br />
        <label>
          <input type="radio" name='coldisplay'
            checked={@state.displayType is 'cols'}
            value="cols" onChange={@changeDisplay}
          /> Vertical Columns
        </label>
        <br />
        <label>
          <input type="radio" name='coldisplay'
            checked={@state.displayType is 'rows'}
            value="rows" onChange={@changeDisplay}
          /> Horizontal Rows
        </label>
      </div>

      {questions}

      </PinnedHeaderFooterCard>
    </div>


module.exports = QuestionsList
