# @csx React.DOM
React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Question = require './question'
ExerciseTags = require './tags'
{ExerciseActions, ExerciseStore} = require '../stores/exercise'
Attachments = require './attachments'
{ArbitraryHtmlAndMath, ExercisePreview} = require 'openstax-react-components'


Exercise = React.createClass
  exerciseId:   React.PropTypes.string.isRequired

  getInitialState: -> {}
  update: -> @setState({})

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  sync: -> ExerciseActions.sync(@props.exerciseId)

  moveQuestion: (questionId, direction) ->
    ExerciseActions.moveQuestion(@props.exerciseId, questionId, direction)

  removeQuestion: (questionId) ->
    ExerciseActions.removeQuestion(@props.exerciseId, questionId)

  updateStimulus: (event) ->
    ExerciseActions.updateStimulus(@props.exerciseId, event.target?.value)

  renderIntroTab: ->
    id = @props.exerciseId
    <BS.TabPane eventKey="intro" tab="intro">
      <div className="exercise-stimulus">
        <label>Exercise Stimulus</label>
        <textarea onChange={@updateStimulus} defaultValue={ExerciseStore.getStimulus(id)}></textarea>
      </div>
    </BS.TabPane>

  renderMpqTabs: ->
    {questions} = ExerciseStore.get(@props.exerciseId)
    for question, i in questions
      <BS.TabPane key={question.id} eventKey={"question-#{i}"} tab={"Question #{i+1}"}>
        <Question id={question.id}
          sync={@sync}
          canMoveLeft={i isnt 0}
          canMoveRight={i isnt questions.length - 1}
          moveQuestion={@moveQuestion}
          removeQuestion={_.partial(@removeQuestion, question.id)} />
      </BS.TabPane>

  renderSingleQuestionTab: ->
    {questions} = ExerciseStore.get(@props.exerciseId)
    <BS.TabPane key={0} eventKey='question-0' tab='Question'>
      <Question id={_.first(questions)?.id} sync={@sync} />
    </BS.TabPane>

  previewTag: (tag) ->
    content = _.compact([tag.name, tag.description]).join(' ') or tag.id
    isLO = _.include(['lo', 'aplo'], tag.type)
    {content, isLO}

  onToggleMPQ: (ev) ->
    ExerciseActions.toggleMultiPart(@props.exerciseId)

  exercisePreviewData: (ex) ->
    content: ex
    tags: _.map ex.tags, (tag) -> name: tag

  addQuestion: ->
    ExerciseActions.addQuestionPart(@props.exerciseId)

  selectTab: (tab) -> @setState({tab})

  getActiveTab: (showMPQ) ->
    if (not @state.tab or @state.tab?.indexOf('question-') is -1)
      return @state.tab

    question = @state.tab.split('-')[1]
    numQuestions = ExerciseStore.getQuestions(@props.exerciseId).length
    if (not showMPQ or question >= numQuestions)
      return 'question-0'

    @state.tab

  render: ->
    exercise = ExerciseStore.get(@props.exerciseId)
    return null unless exercise

    showMPQ = ExerciseStore.isMultiPart(@props.exerciseId)

    tab = @getActiveTab(showMPQ)

    <div className="exercise-editor">

      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <form className="navbar-form navbar-right" role="search">
            <BS.Input type="checkbox" label="Exercise contains multiple parts"
              checked={showMPQ} wrapperClassName="mpq-toggle" onChange={@onToggleMPQ} />
            {if showMPQ
              <BS.Button onClick={@addQuestion} className="navbar-btn"
                bsStyle="primary">Add Question</BS.Button>}
          </form>
        </div>
      </nav>

      <BS.TabbedArea defaultActiveKey='question-0' animation={false}
        activeKey={tab} onSelect={@selectTab}
      >
        {if showMPQ then @renderIntroTab()}
        {if showMPQ then @renderMpqTabs() else @renderSingleQuestionTab()}
        <BS.TabPane eventKey='tags' tab='Tags'>
          <ExerciseTags exerciseId={@props.exerciseId} sync={@sync} />
        </BS.TabPane>
        { if not ExerciseStore.isNew(@props.exerciseId)
          <BS.TabPane eventKey='assets' tab='Assets'>
            <Attachments exerciseId={@props.exerciseId} />
          </BS.TabPane>
        }
      </BS.TabbedArea>
    </div>


module.exports = Exercise
