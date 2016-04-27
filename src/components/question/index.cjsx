React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{AnswersTable} = require './answers-table'
ArbitraryHtmlAndMath = require '../html'
FormatsListing = require './formats-listing'

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
    displayFormats:  React.PropTypes.bool

  childContextTypes:
    processHtmlAndMath: React.PropTypes.func
  getChildContext: ->
    processHtmlAndMath: @props.processHtmlAndMath

  hasAnswerCorrectness: ->
    {correct_answer_id, model} = @props
    {answers} = model

    correct_answer_id? or not _.isEmpty _.pluck(answers, 'correctness')

  hasSolution: ->
    {model, correct_answer_id} = @props
    {collaborator_solutions} = model

    @hasAnswerCorrectness() and not _.isEmpty(_.pluck(collaborator_solutions, 'content_html'))

  render: ->
    {model, correct_answer_id, exercise_uid, className} = @props
    {stem_html, collaborator_solutions, formats, stimulus_html} = model

    hasCorrectAnswer = !! correct_answer_id
    classes = classnames 'openstax-question', className,
      'has-correct-answer': hasCorrectAnswer

    exerciseUid = <div className="exercise-uid">{exercise_uid}</div> if exercise_uid?

    if @hasSolution()
      solution =
        <div className='detailed-solution'>
          <div className='header'>Detailed solution</div>
          <ArbitraryHtmlAndMath className="solution" block
            html={_.pluck(collaborator_solutions, 'content_html').join('')}
          />
        </div>


    <div className={classes}>
      <QuestionHtml type='stimulus' html={stimulus_html} />
      <QuestionHtml type='stem' html={stem_html} />
      {@props.children}
      <AnswersTable {...@props}/>
      {<FormatsListing formats={formats} /> if @props.displayFormats}
      {solution}
      {exerciseUid}
    </div>

module.exports = Question
