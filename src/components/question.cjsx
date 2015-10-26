React = require 'react'
_ = require 'underscore'

classnames = require 'classnames'

ArbitraryHtml = require './html'

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

  getDefaultProps: ->
    disabled: false

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
        onChange={onChangeAnswer(answer)}
        disabled={disabled}
      />

    if type is 'teacher-review'
      percent = Math.round(answer.selected_count / answered_count * 100) or 0
      selectedCount = <div
        className='selected-count'
        data-count="#{answer.selected_count}"
        data-percent="#{percent}">
      </div>


    <div className={classes}>
      {selectedCount}
      {radioBox}
      <label
        htmlFor="#{qid}-option-#{iter}"
        className='answer-label'>
        <div className='answer-letter' />
        <ArbitraryHtml className='answer-content' html={answer.content_html} />
      </label>
    </div>

Feedback = React.createClass
  displayName: 'Feedback'
  propTypes:
    children: React.PropTypes.string.isRequired
    position: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
  getDefaultProps: ->
    position: 'bottom'
  render: ->
    wrapperClasses = classnames 'question-feedback', 'popover', @props.position

    <div className={wrapperClasses}>
      <div className='arrow'/>
      <ArbitraryHtml
        className='question-feedback-content has-html popover-content'
        html={@props.children}
        block={true}/>
    </div>

module.exports = React.createClass
  displayName: 'Question'
  propTypes:
    model: React.PropTypes.object.isRequired
    type: React.PropTypes.string.isRequired
    answer_id: React.PropTypes.string
    correct_answer_id: React.PropTypes.string
    content_uid: React.PropTypes.string
    feedback_html: React.PropTypes.string
    answered_count: React.PropTypes.number
    onChange: React.PropTypes.func
    onChangeAttempt: React.PropTypes.func

  getInitialState: ->
    answer: null

  getDefaultProps: ->
    type: 'student'

  # Curried function to remember the answer
  onChangeAnswer: (answer) ->
    (changeEvent) =>
      if @props.onChange?
        @setState({answer_id:answer.id})
        @props.onChange(answer)
      else
        changeEvent.preventDefault()
        @props.onChangeAttempt?(answer)

  render: ->
    {type, answered_count, choicesEnabled, correct_answer_id} = @props
    chosenAnswer = [@props.answer_id, @state.answer_id]
    checkedAnswerIndex = null

    html = @props.model.stem_html
    qid = @props.model.id or "auto-#{idCounter++}"
    hasCorrectAnswer = !! correct_answer_id

    if @props.feedback_html
      feedback = <Feedback>{@props.feedback_html}</Feedback>

    questionAnswerProps =
      qid: @props.model.id,
      correctAnswerId: correct_answer_id
      hasCorrectAnswer: hasCorrectAnswer
      chosenAnswer: chosenAnswer
      onChangeAnswer: @onChangeAnswer
      type: type
      answered_count: answered_count
      disabled: not choicesEnabled

    answers = _.chain(@props.model.answers)
      .sortBy (answer) ->
        parseInt(answer.id)
      .map (answer, i) ->
        additionalProps = {answer, iter: i, key: "#{questionAnswerProps.qid}-option-#{i}"}
        answerProps = _.extend({}, additionalProps, questionAnswerProps)
        checkedAnswerIndex = i if isAnswerChecked(answer, chosenAnswer)
        <Answer {...answerProps}/>
      .value()

    answers.splice(checkedAnswerIndex + 1, 0, feedback) if feedback? and checkedAnswerIndex?

    classes = classnames 'question',
      'has-correct-answer': hasCorrectAnswer

    <div className={classes}>
      <ArbitraryHtml className='question-stem' block={true} html={html} />
      {@props.children}
      <div className='answers-table'>
        {answers}
      </div>
      <div className="exercise-uid">{@props.exercise_uid}</div>
    </div>
