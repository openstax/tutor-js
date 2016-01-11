React = require 'react'
_ = require 'underscore'

ArbitraryHtmlAndMath = require '../html'
Question = require '../question'
FreeResponse = require './free-response'

{propTypes, props} = require './props'
modeType = propTypes.ExerciseStepCard.panel
modeProps = _.extend {}, propTypes.ExFreeResponse, propTypes.ExMulitpleChoice, propTypes.ExReview, mode: modeType

ExMode = React.createClass
  displayName: 'ExMode'
  propTypes: modeProps
  getDefaultProps: ->
    disabled: false
    free_response: ''
    answer_id: ''
  getInitialState: ->
    {free_response, answer_id} = @props

    freeResponse: free_response
    answerId: answer_id

  componentDidMount: ->
    {mode} = @props
    @focusBox() if mode is 'free-response'

  componentDidUpdate: (nextProps, nextState) ->
    {mode} = nextProps
    @focusBox() if mode is 'free-response'

  componentWillReceiveProps: (nextProps) ->
    {free_response, answer_id} = nextProps

    nextAnswers = {}

    nextAnswers.freeResponse = free_response if @state.freeResponse isnt free_response
    nextAnswers.answerId = answer_id if @state.answerId isnt answer_id

    @setState(nextAnswers) unless _.isEmpty(nextAnswers)

  focusBox: ->
    {focus, mode} = @props
    @refs.freeResponse?.getDOMNode?().focus?() if focus and mode is 'free-response'

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse?.getDOMNode()?.value
    @setState({freeResponse})
    @props.onFreeResponseChange?(freeResponse)

  onAnswerChanged: (answer) ->
    return if answer.id is @state.answerId or @props.mode isnt 'multiple-choice'
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  getFreeResponse: ->
    {mode, free_response, disabled} = @props
    {freeResponse} = @state

    if mode is 'free-response'
      <textarea
        disabled={disabled}
        ref='freeResponse'
        placeholder='Enter your response'
        value={freeResponse}
        onChange={@onFreeResponseChange}
      />
    else
      <FreeResponse free_response={free_response}/>

  render: ->
    {mode, content, onChangeAnswerAttempt, answerKeySet, choicesEnabled} = @props
    {answerId} = @state

    answerKeySet = null unless choicesEnabled
    question = content.questions[0]
    question = _.omit(question, 'answers') if mode is 'free-response'

    questionProps = _.pick(@props, 'processHtmlAndMath', 'choicesEnabled', 'correct_answer_id', 'feedback_html', 'type')
    if mode is 'multiple-choice'
      changeProps =
        onChange: @onAnswerChanged
    else if mode is 'review'
      changeProps =
        onChangeAttempt: onChangeAnswerAttempt

    htmlAndMathProps = _.pick(@props, 'processHtmlAndMath')
    {stimulus_html} = content

    <div className='openstax-exercise'>
      <ArbitraryHtmlAndMath
        {...htmlAndMathProps}
        className='exercise-stimulus'
        block={true}
        html={stimulus_html} />
      <Question
        {...questionProps}
        {...changeProps}
        key='step-question'
        model={question}
        answer_id={answerId}
        keySet={answerKeySet}>
        {@getFreeResponse()}
      </Question>
    </div>


module.exports = {ExMode}
