React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'
{ArbitraryHtmlAndMath, Question} = require 'openstax-react-components'


ExerciseCard = React.createClass

  PropTypes:
    displayFeedback: React.PropTypes.bool
    panelStyle: React.PropTypes.string
    header:     React.PropTypes.element
    exercise:   React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired

  getDefaultProps: ->
    panelStyle: 'default'

  renderAnswer: (answer) ->
    classes = classnames 'answers-answer',
      correct: (answer.correctness is '1.0')

    <div key={answer.id} className={classes}>
      <div className="answer-letter" />
      <div className="answer">
        <ArbitraryHtmlAndMath className="choice" block={false} html={answer.content_html} />
        <ArbitraryHtmlAndMath className="feedback" block={false} html={answer.feedback_html} />
      </div>
    </div>

  renderTag: (tag) ->
    <span>tag</span>

  renderQuestions: (question) ->
    <Question model={question}/>

  render: ->
    questions = _.map(@props.exercise.questions, @renderQuestions)

    <div>{questions}</div>

module.exports = ExerciseCard
