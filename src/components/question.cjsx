_ = require 'underscore'
React = require 'react'
ArbitraryHtml = require './html'

idCounter = 0

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
    chosen_answer: React.PropTypes.array
    correct_answer_id: React.PropTypes.string
    answered_count: React.PropTypes.number

  render: ->
    {answer, iter, qid, type, correct_answer_id, answered_count, hasCorrectAnswer, chosen_answer, onChangeAnswer} = @props
    qid ?= "auto-#{idCounter++}"

    isChecked = answer.id in chosen_answer
    isCorrect = answer.id is correct_answer_id

    isCorrect = (answer.correctness is '1.0') if answer.correctness?

    classes = ['answers-answer']
    classes.push('answer-checked') if isChecked
    classes.push('answer-correct') if isCorrect
    classes = classes.join(' ')

    unless (hasCorrectAnswer or type is 'teacher-review')
      radioBox = <input
        type='radio'
        className='answer-input-box'
        checked={isChecked}
        id="#{qid}-option-#{iter}"
        name="#{qid}-options"
        onChange={onChangeAnswer(answer)}
      />

    if type is 'teacher-review'
      percent = Math.round(answer.selected_count / answered_count * 100) or 0
      selectedCount = <div
        className='selected-count'
        data-count="#{answer.selected_count}"
        data-percent="#{percent}">
      </div>


    <div className={classes} key="#{qid}-option-#{iter}">
      {selectedCount}
      {radioBox}
      <label
        htmlFor="#{qid}-option-#{iter}"
        className='answer-label'>
        <div className='answer-letter' />
        <ArbitraryHtml className='answer-content' html={answer.content_html} />
      </label>
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
    {type, answered_count} = @props

    html = @props.model.stem_html
    qid = @props.model.id or "auto-#{idCounter++}"
    hasCorrectAnswer = !! @props.correct_answer_id

    if @props.feedback_html
      feedback = <div className='question-feedback'>
          <ArbitraryHtml
            className='question-feedback-content has-html'
            html={@props.feedback_html}
            block={true}/>
        </div>

    questionAnswerProps =
      qid: @props.model.id,
      correct_answer_id: @props.correct_answer_id
      hasCorrectAnswer: hasCorrectAnswer
      chosen_answer: [@props.answer_id, @state.answer_id]
      onChangeAnswer: @onChangeAnswer
      type: type
      answered_count: answered_count

    answers = _.chain(@props.model.answers)
      .sortBy (answer) ->
        parseInt(answer.id)
      .map (answer, i) ->
        answerProps = _.extend({}, {answer, iter: i}, questionAnswerProps)
        <Answer {...answerProps}/>
      .value()

    classes = ['question']
    classes.push('has-correct-answer') if hasCorrectAnswer
    classes = classes.join(' ')

    <div className={classes}>
      <ArbitraryHtml className='question-stem' block={true} html={html} />
      {@props.children}
      <div className='answers-table'>
        {answers}
      </div>
      {feedback}
      <div className="exercise-uid">{@props.exercise_uid}</div>
    </div>
