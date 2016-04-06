React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{AnswersTable} = require './answers-table'
{Answer} = require './answer'
{Feedback} = require './feedback'
ArbitraryHtmlAndMath = require '../html'

QuestionHtml = React.createClass
  displayName: 'QuestionHtml'
  propTypes:
    html: React.PropTypes.string
    type: React.PropTypes.string
  getDefaultProps: ->
    html: ''
    type: ''
  contextTypes:
    processHtmlAndMath: React.PropTypes.func

  render: ->
    {html, type} = @props
    return null unless html.length > 0

    htmlAndMathProps = _.pick(@context, 'processHtmlAndMath')

    <ArbitraryHtmlAndMath
      {...htmlAndMathProps}
      className="question-#{type}"
      block={true}
      html={html}
    />

Question = React.createClass
  displayName: 'Question'
  propTypes:
    model: React.PropTypes.object.isRequired
    correct_answer_id: React.PropTypes.string
    exercise_uid: React.PropTypes.string

  childContextTypes:
    processHtmlAndMath: React.PropTypes.func
  getChildContext: ->
    processHtmlAndMath: @props.processHtmlAndMath

  render: ->
    {model, correct_answer_id, exercise_uid} = @props
    {stem_html, stimulus_html} = model

    hasCorrectAnswer = !! correct_answer_id
    classes = classnames 'openstax-question',
      'has-correct-answer': hasCorrectAnswer

    <div className={classes}>
      <QuestionHtml type='stem' html={stem_html} />
      <QuestionHtml type='stimulus' html={stimulus_html} />
      {@props.children}
      <AnswersTable {...@props}/>
      {@props.solution}
      <div className="exercise-uid">{exercise_uid}</div>
    </div>

module.exports = Question
