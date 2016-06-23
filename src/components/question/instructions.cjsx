React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PROJECT_NAME_AND_FEEDBACK =
  'concept-coach':
    name: 'Concept Coach'
    feedbackType: 'immediate feedback'
  'tutor':
    name: 'Tutor'
    feedbackType: 'personalized feedback'

Instructions = React.createClass
  displayName: 'Instructions'
  propTypes:
    project: React.PropTypes.oneOf _.keys(PROJECT_NAME_AND_FEEDBACK)
  render: ->
    {project, projectName, feedbackType, hasIncorrectAnswer } = @props

    if (hasIncorrectAnswer)
      return <p className="instructions">
        Incorrect. Please review your feedback.
      </p>

    if project?
      projectName ?= PROJECT_NAME_AND_FEEDBACK[project].name
      feedbackType ?= PROJECT_NAME_AND_FEEDBACK[project].feedbackType

    popover = <BS.Popover ref="popover" className="openstax instructions">
      <p><b>Why do you ask me to answer twice?</b></p>
      <p>
        We ask for your own response first because recalling an answer from
        memory helps your learning last longer.
        Then, we give you multiple-choice options so you can
        get immediate <span className="feedback-type">{feedbackType}</span>.
      </p>
    </BS.Popover>

    <p className="instructions">
      Now choose from one of the following options
      <BS.OverlayTrigger placement="right" overlay={popover}>
        <span className="text-info">Why?</span>
      </BS.OverlayTrigger>
    </p>

module.exports = Instructions
