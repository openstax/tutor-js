# @csx React.DOM
React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'
ExercisePreview = require 'components/exercise/preview'
PublishedModal  = require './published-modal'
ExerciseTags    = require 'components/exercise/tags'
Question        = require 'components/exercise/question'
Attachments     = require 'components/exercise/attachments'


Exercise = React.createClass
  propTypes:
    id:   React.PropTypes.string.isRequired
    location: React.PropTypes.object

  getInitialState: -> {}
  update: -> @forceUpdate()

  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  componentWillUnmount: ->
    ExerciseStore.removeChangeListener(@update)

  sync: -> ExerciseActions.sync(@props.id)

  moveQuestion: (questionId, direction) ->
    ExerciseActions.moveQuestion(@props.id, questionId, direction)

  removeQuestion: (questionId) ->
    ExerciseActions.removeQuestion(@props.id, questionId)

  updateStimulus: (event) ->
    ExerciseActions.updateStimulus(@props.id, event.target?.value)

  renderIntroTab: ->
    id = @props.id
    <BS.Tab eventKey="intro" title="Intro">
      <div className="exercise-stimulus">
        <label>Exercise Stimulus</label>
        <textarea onChange={@updateStimulus} defaultValue={ExerciseStore.getStimulus(id)}></textarea>
      </div>
    </BS.Tab>

  renderMpqTabs: ->
    {questions} = ExerciseStore.get(@props.id)
    for question, i in questions
      <BS.Tab key={question.id} eventKey={"question-#{i}"} title={"Question #{i+1}"}>
        <Question id={question.id}
          sync={@sync}
          canMoveLeft={i isnt 0}
          canMoveRight={i isnt questions.length - 1}
          moveQuestion={@moveQuestion}
          removeQuestion={_.partial(@removeQuestion, question.id)} />
      </BS.Tab>

  renderSingleQuestionTab: ->
    {questions} = ExerciseStore.get(@props.id)
    <BS.Tab key={0} eventKey='question-0' title='Question'>
      <Question id={_.first(questions)?.id} sync={@sync} />
    </BS.Tab>

  addQuestion: ->
    ExerciseActions.addQuestionPart(@props.id)

  selectTab: (tab) -> @setState({tab})

  visitVocab: ->
    vocabId = ExerciseStore.getVocabId(@props.id)
    @props.location.visitVocab(vocabId)

  getActiveTab: (showMPQ) ->
    if (not @state.tab or @state.tab?.indexOf('question-') is -1)
      return @state.tab

    question = @state.tab.split('-')[1]
    numQuestions = ExerciseStore.getQuestions(@props.id).length
    if (not showMPQ or question >= numQuestions)
      return 'question-0'

    @state.tab

  render: ->
    exercise = ExerciseStore.get(@props.id)
    return null unless exercise

    showMPQ = ExerciseStore.isMultiPart(@props.id)

    tab = @getActiveTab(showMPQ)

    <div className='exercise-editor'>
      <PublishedModal exerciseId={@props.id} />
      <div className="editing-controls">

       {if showMPQ
         <BS.Button onClick={@addQuestion} className="add-mpq"
           bsStyle="primary">Add Question</BS.Button>}

        <BS.Tabs defaultActiveKey='question-0' animation={false}
          activeKey={tab} onSelect={@selectTab}
        >
          {if showMPQ then @renderIntroTab()}
          {if showMPQ then @renderMpqTabs() else @renderSingleQuestionTab()}
          <BS.Tab eventKey='tags' title='Tags'>
            <ExerciseTags exerciseId={@props.id} sync={@sync} />
          </BS.Tab>
          { if not ExerciseStore.isNew(@props.id)
            <BS.Tab eventKey='assets' title='Assets'>
              <Attachments exerciseId={@props.id} />
            </BS.Tab>
          }
        </BS.Tabs>
      </div>

      <ExercisePreview exerciseId={@props.id} />

    </div>


module.exports = Exercise
