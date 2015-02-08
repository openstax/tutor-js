_ = require 'underscore'
React = require 'react'
ArbitraryHtml = require './html'
StepMixin = require './step-mixin'

idCounter = 0


# props:
#   model
#   answer
#   correct_answer
#   feedback_html

module.exports = React.createClass

  getInitialState: ->
    answer: null

  # Curried function to remember the answer
  onChangeAnswer: (answer) -> =>
    @setState {answer_id:answer.id}
    @props.onChange(answer)

  render: ->
    html = @props.model.stem_html
    qid = @props.model.id or "auto-#{idCounter++}"

    if @props.feedback_html
      feedback = <ArbitraryHtml className="question-feedback has-html" html={@props.feedback_html} />

    answers = _.map @props.model.answers, (answer, i) =>
      isChecked = answer.id in [@props.answer_id, @state.answer_id]
      isCorrect = answer.id is @props.correct_answer_id

      classes = ['answers-answer']
      classes.push('answer-checked') if isChecked
      classes.push('answer-correct') if isCorrect
      classes = classes.join(' ')

      <div className={classes}>
        <input
          type="radio"
          className="answer-input-box"
          checked={isChecked}
          id="#{qid}-option-#{i}"
          name="#{qid}-options"
          onChange={@onChangeAnswer(answer)}
        />
        <label htmlFor="#{qid}-option-#{i}" className="answer-label">
          <div className="answer-letter" />
          <ArbitraryHtml className="answer-content" html={answer.content_html} />
        </label>
      </div>

    hasCorrectAnswer = !! @props.correct_answer_id
    classes = ['question']
    classes.push('has-correct-answer') if hasCorrectAnswer
    classes = classes.join(' ')

    <div className={classes}>
      <ArbitraryHtml className="question-stem" block={true} html={html} />
      {@props.children}
      <div className="answers-table">
        {answers}
      </div>
      {feedback}
    </div>
