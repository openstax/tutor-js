React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore} = require '../../../flux/task-plan'

Tooltip =
  <BS.Popover id='plan-footer-popover'>
    <p>
      <strong>Publish</strong> will make the assignment visible to students on the open date.
      If open date is today, it will be available immediately.
    </p>
    <p>
      <strong>Cancel</strong> will discard all changes and return to the calendar.
    </p>
    <p>
      <strong>Save as draft</strong> will add the assignment to the teacher calendar only.
      It will not be visible to students, even if the open date has passed.
    </p>
  </BS.Popover>

HelpTooltip = React.createClass

  propTypes:
    isPublished: React.PropTypes.bool.isRequired

  render: ->
    return null if @props.isPublished

    <BS.OverlayTrigger trigger='click' placement='top' overlay={Tooltip} rootClose={true}>
      <BS.Button className="footer-instructions" bsStyle="link">
        <i className="fa fa-info-circle"></i>
      </BS.Button>
    </BS.OverlayTrigger>


module.exports = HelpTooltip
