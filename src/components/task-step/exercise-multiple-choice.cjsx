_ = require 'underscore'
moment = require 'moment'
camelCase = require 'camelcase'

React = require 'react'
katex = require 'katex'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskActions,TaskStore} = require '../../flux/task'
{StepPanelStore} = require '../../flux/step-panel'
ArbitraryHtmlAndMath = require '../html'
StepMixin = require './step-mixin'
Question = require '../question'
BS = require 'react-bootstrap'


ExerciseFreeResponse = React.createClass
  displayName: 'ExerciseFreeResponse'
  propTypes:
    id: React.PropTypes.number.isRequired

  mixins: [StepMixin]

  getInitialState: ->
    {id} = @props
    {free_response} = TaskStepStore.get(id)
    freeResponse: free_response

  isContinueEnabled: ->
    {id} = @props
    {free_response} = TaskStepStore.get(id)
    !! (free_response or @state.freeResponse)

  renderBody: ->
    {id} = @props
    {content} = TaskStepStore.get(id)
    # TODO: Assumes 1 question.
    question = content.questions[0]

    <div className="exercise">
      <ArbitraryHtmlAndMath className="stimulus" block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className="stem" block={true} html={question.stem_html} />
      <textarea
        ref="freeResponse"
        placeholder="Enter your response"
        value={@state.freeResponse or ''}
        onChange={@onFreeResponseChange}
        />
    </div>

  componentDidMount: -> @refs.freeResponse.getDOMNode().focus()

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse.getDOMNode().value
    @setState {freeResponse}

  onContinue: ->
    {id} = @props
    {freeResponse} = @state
    TaskStepActions.setFreeResponseAnswer(id, freeResponse)


ExerciseMultiChoice = React.createClass
  displayName: 'ExerciseMultiChoice'
  mixins: [StepMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]
    FreeResponse = if TaskStepStore.hasFreeResponse(id) then <div className="free-response">{free_response}</div> else ''

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} onChange={@onAnswerChanged}>
      {FreeResponse}
      <div className="multiple-choice-prompt">Choose the best answer from the following:</div>
    </Question>

  onAnswerChanged: (answer) ->
    {id} = @props
    TaskStepActions.setAnswerId(id, answer.id)

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    {id} = @props
    canReview = StepPanelStore.canReview id

    @props.onStepCompleted()
    @props.onNextStep() unless canReview


ExerciseReview = React.createClass
  displayName: 'ExerciseReview'
  mixins: [StepMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  renderBody: ->
    {id} = @props
    {content, free_response, answer_id, correct_answer_id, feedback_html} = TaskStepStore.get(id)

    # TODO: Assumes 1 question.
    question = content.questions[0]
    FreeResponse = if TaskStepStore.hasFreeResponse(id) then <div className="free-response">{free_response}</div> else ''

    <Question model={question} answer_id={answer_id} correct_answer_id={correct_answer_id} feedback_html={feedback_html} onChange={@onAnswerChanged}>
      {FreeResponse}
    </Question>

  onAnswerChanged: (answer) ->
    # TODO put cannot change answer dialog here
    console.log(answer)

  isContinueEnabled: ->
    {id} = @props
    {answer_id} = TaskStepStore.get(id)
    !!answer_id

  onContinue: ->
    @props.onNextStep()

  tryAnother: ->
    {id} = @props
    task_id = TaskStepStore.getTaskId(id)
    TaskStepActions.loadRecovery(id)
    TaskActions.load(task_id)

  refreshMemory: ->
    {index} = TaskStore.getReadingForTaskId(@props.id)
    throw new Error('BUG: No reading found for task') unless index
    # goToStep returns an function with the step index in closure scope
    @props.goToStep(index)()

  canTryAnother: ->
    {id} = @props
    step = TaskStepStore.get(id)
    return step.has_recovery and step.correct_answer_id isnt step.answer_id

  renderFooterButtons: ->
    # TODO: switch to using classnames library
    buttonClasses = '-continue'
    buttonClasses += 'disabled' unless @isContinueEnabled()
    continueButton =
      <BS.Button bsStyle="primary" className={buttonClasses} onClick={@onContinue}>
        { if @canTryAnother() then "Move On" else "Continue" }
      </BS.Button>
    if @canTryAnother()
      extraButtons = [
        <BS.Button bsStyle="primary" className="-try-another" onClick={@tryAnother}>
          Try Another
        </BS.Button>
        <BS.Button bsStyle="primary" className="-refresh-memory" onClick={@refreshMemory}>
          Refresh My Memory
        </BS.Button>
      ]
    <div className="footer-buttons">
      {extraButtons}
      {continueButton}
    </div>


module.exports = React.createClass
  displayName: 'Exercise'
  propTypes:
    id: React.PropTypes.number.isRequired
    onStepCompleted: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onNextStep: React.PropTypes.func.isRequired

  renderReview: (id)->
    <ExerciseReview
        id={id}
        onNextStep={@props.onNextStep}
        goToStep={@props.goToStep}
        onStepCompleted={@props.onStepCompleted}
    />

  renderMultipleChoice: (id)->
    <ExerciseMultiChoice
      id={id}
      onStepCompleted={@props.onStepCompleted}
      onNextStep={@props.onNextStep}
    />

  renderFreeResponse: (id)->
    <ExerciseFreeResponse
      id={id}
    />

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
    # get panel to render based on step progress
    panel = StepPanelStore.getPanel id
    # panel is one of ['review', 'multiple-choice', 'free-response']
    renderPanelMethod = camelCase "render-#{panel}"
    @[renderPanelMethod]?(id)
