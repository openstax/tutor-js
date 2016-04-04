# @csx React.DOM
React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Question = require './question'
Preview = require './preview'
ExerciseTags = require './tags'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'
Attachments = require './attachments'
{ArbitraryHtmlAndMath, ExercisePreview} = require 'openstax-react-components'
AsyncButton = require 'openstax-react-components/src/components/buttons/async-button.cjsx'


Exercise = React.createClass
  exerciseId:   React.PropTypes.string.isRequired

  getInitialState: -> {}
  update: -> @setState({})

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  sync: -> ExerciseActions.sync(@getId())

  renderMpqTabs: ->
    {questions} = ExerciseStore.get(@props.exerciseId)
    for question, i in questions
      <BS.TabPane key={i} eventKey={"question-#{i}"} tab={"Question #{i+1}"}>
        <Question id={question.id} sync={@sync} />
      </BS.TabPane>

  renderSingleQuestionTab: ->
    {questions} = ExerciseStore.get(@props.exerciseId)
    <BS.TabPane key={0} eventKey='question-0' tab='Question'>
      <Question id={_.first(questions)?.id} sync={@sync} />
    </BS.TabPane>

  previewTag: ->
    content = _.compact([tag.name, tag.description]).join(' ') or tag.id
    isLO = _.include(['lo', 'aplo'], tag.type)
    {content, isLO}

  onToggleMPQ: (ev) ->
    @setState(isShowingMPQ: ev.target.checked)

  addQuestion: ->
    ExerciseActions.addQuestionPart(@props.exerciseId)

  render: ->
    exercise = ExerciseStore.get(@props.exerciseId)
    return null unless exercise

    <div className="exercise-editor">
      <ExercisePreview extractTag={@previewTag} exercise={tags: exercise.tags, content: exercise} />
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <form className="navbar-form navbar-right" role="search">
            <BS.Input type="checkbox" label="Exercise contains multiple parts"
              checked={@state.isShowingMPQ} wrapperClassName="mpq-toggle" onChange={@onToggleMPQ} />
            {if @state.isShowingMPQ
              <BS.Button onClick={@addQuestion} className="navbar-btn"
                bsStyle="primary">Add Question</BS.Button>}
          </form>
        </div>
      </nav>

      <BS.TabbedArea defaultActiveKey='tags'>
        <BS.TabPane eventKey='tags' tab='Tags'>
          <ExerciseTags exerciseId={@props.exerciseId} sync={@sync} />
        </BS.TabPane>
        <BS.TabPane eventKey='assets' tab='Assets'>
          <Attachments exerciseId={@props.exerciseId} />
        </BS.TabPane>
        {if @state.isShowingMPQ then @renderMpqTabs() else @renderSingleQuestionTab()}
      </BS.TabbedArea>
    </div>


module.exports = Exercise
