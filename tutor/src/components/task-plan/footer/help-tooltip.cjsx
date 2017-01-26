React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore} = require '../../../flux/task-plan'

buildTooltip = ({isPublished}) ->
  saveMessage = if isPublished
    <div>
      <p>
        <strong>Save</strong> will update the assignment.
      </p>
    </div>
  else
    <div>
      <p>
        <strong>Publish</strong> will make the assignment visible to students on the open date.
        If open date is today, it will be available immediately.
      </p>
      <p>
        <strong>Save as draft</strong> will add the assignment to the teacher calendar only.
        It will not be visible to students, even if the open date has passed.
      </p>
    </div>

  <BS.Popover id='plan-footer-popover'>
    {saveMessage}
    <p>
      <strong>Cancel</strong> will discard all changes and return to the calendar.
    </p>
    {<p>
      <strong>Delete Assignment</strong>
      will remove the assignment from students dashboards.  Students who
      have worked the assignment will still be able to review their work.
    </p> if isPublished}
  </BS.Popover>

HelpTooltip = React.createClass

  propTypes:
    isPublished: React.PropTypes.bool.isRequired

  render: ->
    <BS.OverlayTrigger trigger='click' placement='top'
      overlay={buildTooltip(@props)} rootClose={true}
    >
      <BS.Button className="footer-instructions" bsStyle="link">
        <i className="fa fa-info-circle"></i>
      </BS.Button>
    </BS.OverlayTrigger>


module.exports = HelpTooltip
