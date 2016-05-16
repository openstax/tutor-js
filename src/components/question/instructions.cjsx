React = require 'react'
BS = require 'react-bootstrap'

Instructions = React.createClass
  displayName: 'Instructions'
  render: ->
    popover = <BS.Popover ref="popover" className="openstax instructions">
      Research shows that a great way to boost your learning is to quiz yourself.
      OpenStax <span className="product-name"></span> helps improve your memory
      by asking you to recall answers from memory <em>before</em> showing the
      possible answers. Now, select the best answer to
      get <span className="feedback-type"></span>. Both you and your instructor can
      review your work later.
    </BS.Popover>

    <p className="instructions">
      Now choose from one of the following options
      <BS.OverlayTrigger placement="right" overlay={popover}>
        <i className="fa fa-info-circle" />
      </BS.OverlayTrigger>
    </p>

module.exports = Instructions
