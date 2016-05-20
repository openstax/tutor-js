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
    {project, projectName, feedbackType} = @props

    if project?
      projectName ?= PROJECT_NAME_AND_FEEDBACK[project].name
      feedbackType ?= PROJECT_NAME_AND_FEEDBACK[project].feedbackType

    popover = <BS.Popover ref="popover" className="openstax instructions">
      Research shows that a great way to boost your learning is to quiz yourself.
      OpenStax <span className="product-name">{projectName}</span> helps improve your memory
      by asking you to recall answers from memory <em>before</em> showing the
      possible answers. Now, select the best answer to
      get <span className="feedback-type">{feedbackType}</span>. Both you and your instructor can
      review your work later.
    </BS.Popover>

    <p className="instructions">
      Now choose from one of the following options
      <BS.OverlayTrigger placement="right" overlay={popover}>
        <i className="fa fa-info-circle" />
      </BS.OverlayTrigger>
    </p>

module.exports = Instructions
