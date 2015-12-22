React = require 'react'
_ = require 'underscore'

ArbitraryHtmlAndMath = require '../html'
Question = require '../question'
FreeResponse = require './free-response'

{propTypes, props} = require './props'
panelProps = _.extend {}, propTypes.ExFreeResponse, propTypes.ExMulitpleChoice, propTypes.ExReview

ExPanel = React.createClass
  displayName: 'ExPanel'
  propTypes: panelProps
  getDefaultProps: ->
    disabled: false
    free_response: ''
    answer_id: ''
  getInitialState: ->
    {free_response, answer_id} = @props

    freeResponse: free_response
    answerId: answer_id

  componentDidMount: ->
    {panel} = @props
    @focusBox() if panel is 'free-response'

  componentDidUpdate: (nextProps, nextState) ->
    {panel} = nextProps
    @focusBox() if panel is 'free-response'

  componentWillReceiveProps: (nextProps) ->
    {panel, free_response, answer_id} = nextProps

    switch panel
      when 'free-response'
        @setState(freeResponse: free_response) if @state.freeResponse isnt free_response
      when 'multiple-choice'
        @setState(answerId: answer_id) if @state.answerId isnt answer_id

  focusBox: ->
    {focus, panel} = @props
    @refs.freeResponse?.getDOMNode?().focus?() if focus and panel is 'free-response'

  onFreeResponseChange: ->
    freeResponse = @refs.freeResponse?.getDOMNode()?.value
    @setState({freeResponse})
    @props.onFreeResponseChange?(freeResponse)

  onAnswerChanged: (answer) ->
    return if answer.id is @state.answerId or @props.panel isnt 'multiple-choice'
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  getFreeResponse: ->
    {panel, free_response, disabled} = @props
    {freeResponse} = @state

    if panel is 'free-response'
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
    {panel, content, onChangeAnswerAttempt, answerKeySet, choicesEnabled} = @props
    {answerId} = @state

    answerKeySet = null unless choicesEnabled
    question = content.questions[0]
    question = _.omit(question, 'answers') if panel is 'free-response'

    questionProps = _.pick(@props, 'processHtmlAndMath', 'choicesEnabled', 'correct_answer_id', 'feedback_html', 'type')
    if panel is 'multiple-choice'
      changeProps =
        onChange: @onAnswerChanged
    else if panel is 'review'
      changeProps =
        onChangeAttempt: onChangeAnswerAttempt

    <div className='openstax-exercise'>
      <Question
        {...questionProps}
        {...changeProps}
        key='step-question'
        model={question}
        answer_id={answerId}
        keySet={answerKeySet}
        exercise_uid={content.uid}>
        {@getFreeResponse()}
      </Question>
    </div>


module.exports = {ExPanel}
