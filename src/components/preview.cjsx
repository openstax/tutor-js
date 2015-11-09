React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'
Question = require 'openstax-react-components/src/components/question'


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

  renderQuestions: (question) ->
    feedback_html = _.first(question.solutions)?.content_html
      
    if feedback_html
      feedback = <div className="free-response">
        {feedback_html}
      </div>

    <Question model={question} show_all_feedback={true}>
      {feedback}
    </Question>

  render: ->
    questions = _.map(@props.exercise.questions, @renderQuestions)

    <div>{questions}</div>

module.exports = ExerciseCard
