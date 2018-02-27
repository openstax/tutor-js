React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Markdown = require '../markdown'
{TWO_STEP_ALIAS, getHelpText} = require '../../helpers/step-helps'

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
    hasIncorrectAnswer: React.PropTypes.bool
    hasFeedback: React.PropTypes.bool

  render: ->
    {project, projectName, feedbackType, hasFeedback, hasIncorrectAnswer} = @props

    if (hasIncorrectAnswer and hasFeedback)
      return <p className="instructions">
        Incorrect. Please review your feedback.
      </p>

    popover =
      <BS.Popover ref="popover"
        id="instructions-help"
        className="openstax instructions">
        {getHelpText[TWO_STEP_ALIAS](project)}
      </BS.Popover>

    <p className="instructions">
      Now choose from one of the following options
      <BS.OverlayTrigger placement="right" overlay={popover}>
        <span className="text-info">Why?</span>
      </BS.OverlayTrigger>
    </p>

module.exports = Instructions
