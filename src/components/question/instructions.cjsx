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
      <p>Why do you ask me to answer twice?</p>
      <p>
        Research shows that recalling the answer to a question from
        memory helps your learning last longer. So,
        OpenStax <span className="product-name">{projectName}</span> asks
        for your own answer first, then gives multiple-choice options so you can
        get <span className="feedback-type">{feedbackType}</span>. Both you and your instructor
        can review your work later.
      </p>
    </BS.Popover>

    <p className="instructions">
      Now choose from one of the following options
      <BS.OverlayTrigger placement="right" overlay={popover}>
        <i className="fa fa-info-circle" />
      </BS.OverlayTrigger>
    </p>

module.exports = Instructions
