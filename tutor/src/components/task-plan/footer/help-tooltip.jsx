import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import { TaskPlanStore } from '../../../flux/task-plan';


const publishedSaveMessage = () => (
  <div>
    <p>
      <strong>
        Save
      </strong>
      will update the assignment.
    </p>
  </div>
);

const unpublishedSaveMessage = () => (
  <div>
    <p>
      <strong>
        Publish
      </strong>
      will make the assignment visible to students on the open date. If open date is today, it will be available immediately.
    </p>
    <p>
      <strong>
        Save as draft
      </strong>
      will add the assignment to the teacher calendar only.  It will not be visible to students, even if the open date has passed.
    </p>
  </div>
);

function buildTooltip({ isPublished }) {
  const saveMessage = isPublished ? publishedSaveMessage() : unpublishedSaveMessage();

  return (
    <Popover id="plan-footer-popover">
      {saveMessage}
      <p>
        <strong>
          Cancel
        </strong>
        will discard all changes and return to the calendar.
      </p>
      {isPublished ? <p>
        <strong>
          Delete Assignment
        </strong>
        will remove the assignment from students dashboards.  Students who have worked the assignment will still be able to review their work.
      </p> : undefined}
    </Popover>
  );
}
buildTooltip.propTypes = {
  isPublished: PropTypes.bool.isRequired,
};


export default class HelpTooltip extends React.Component {

  static propTypes = {
    isPublished: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={buildTooltip(this.props)}
        rootClose={true}>
        <Button className="footer-instructions" bsStyle="link">
          <i className="fa fa-info-circle" />
        </Button>
      </OverlayTrigger>
    );
  }
}
