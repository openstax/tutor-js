React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
keymaster = require 'keymaster'

keysHelper = require '../../helpers/keys'
ArbitraryHtmlAndMath = require '../html'
{SimpleFeedback} = require './feedback'

idCounter = 0

isAnswerCorrect = (answer, correctAnswerId) ->
  isCorrect = answer.id is correctAnswerId
  isCorrect = (answer.correctness is '1.0') if answer.correctness?

  isCorrect

isAnswerChecked = (answer, chosenAnswer) ->
  isChecked = answer.id in chosenAnswer

Answer = React.createClass
  displayName: 'Answer'
  propTypes:
    answer: React.PropTypes.shape(
      id: React.PropTypes.oneOfType([
        React.PropTypes.string
        React.PropTypes.number
      ]).isRequired
      content_html: React.PropTypes.string.isRequired
      correctness: React.PropTypes.string
      selected_count: React.PropTypes.number
    ).isRequired

    iter: React.PropTypes.number.isRequired
    qid: React.PropTypes.oneOfType([
      React.PropTypes.string
      React.PropTypes.number
    ]).isRequired
    type: React.PropTypes.string.isRequired
    hasCorrectAnswer: React.PropTypes.bool.isRequired
    onChangeAnswer: React.PropTypes.func.isRequired

    disabled: React.PropTypes.bool
    chosenAnswer: React.PropTypes.array
    correctAnswerId: React.PropTypes.string
    answered_count: React.PropTypes.number
    show_all_feedback: React.PropTypes.bool
    keyControl: React.PropTypes.oneOfType([
      React.PropTypes.string
      React.PropTypes.number
      React.PropTypes.array
    ])

  getDefaultProps: ->
    disabled: false
    show_all_feedback: false

  componentWillMount: ->
    @setUpKeys() if @shouldKey()

  componentWillUnmount: ->
    {keyControl} = @props
    keysHelper.off(keyControl, 'multiple-choice') if keyControl?

  componentDidUpdate: (prevProps) ->
    {keyControl} = @props

    if @shouldKey(prevProps) and not @shouldKey()
      keysHelper.off(prevProps.keyControl, 'multiple-choice')

    if @shouldKey() and prevProps.keyControl isnt keyControl
      @setUpKeys()

  shouldKey: (props) ->
    props ?= @props
    {keyControl, disabled} = props

    keyControl? and not disabled

  setUpKeys: ->
    {answer, onChangeAnswer, keyControl} = @props

    keyInAnswer = _.partial onChangeAnswer, answer
    keysHelper.on keyControl, 'multiple-choice', keyInAnswer
    keymaster.setScope('multiple-choice')

  contextTypes:
    processHtmlAndMath: React.PropTypes.func

  render: ->
    {answer, iter, qid, type, correctAnswerId, answered_count, hasCorrectAnswer, chosenAnswer, onChangeAnswer, disabled} = @props
    qid ?= "auto-#{idCounter++}"

    isChecked = isAnswerChecked(answer, chosenAnswer)
    isCorrect = isAnswerCorrect(answer, correctAnswerId)

    classes = classnames 'answers-answer',
      'answer-checked': isChecked
      'answer-correct': isCorrect

    unless (hasCorrectAnswer or type is 'teacher-review')
      radioBox = <input
        type='radio'
        className='answer-input-box'
        checked={isChecked}
        id="#{qid}-option-#{iter}"
        name="#{qid}-options"
        onChange={_.partial(onChangeAnswer, answer)}
        disabled={disabled}
      />

    if type is 'teacher-review' and answer.selected_count
      percent = Math.round(answer.selected_count / answered_count * 100) or 0
      selectedCount = <div
        className='selected-count'
        data-count="#{answer.selected_count}"
        data-percent="#{percent}">
      </div>

    if @props.show_all_feedback and answer.feedback_html
      feedback = <SimpleFeedback key='question-mc-feedback'>{answer.feedback_html}</SimpleFeedback>

    htmlAndMathProps = _.pick(@context, 'processHtmlAndMath')

    <div className='openstax-answer'>
      <div className={classes}>
        {selectedCount}
        {radioBox}
        <label
          htmlFor="#{qid}-option-#{iter}"
          className='answer-label'>
          <div className='answer-letter' />
          <ArbitraryHtmlAndMath
            {...htmlAndMathProps}
            className='answer-content'
            html={answer.content_html} />
        </label>
      </div>
      {feedback}
    </div>

module.exports = {Answer}
