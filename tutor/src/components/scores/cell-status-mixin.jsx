/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';

import TutorLink from '../link';
import LateIcon from '../late-icon';
import TaskHelper from '../../helpers/task';

export default {

  propTypes: {
    courseId: React.PropTypes.string.isRequired,

    task: React.PropTypes.shape({
      status:          React.PropTypes.string,
      due_at:          React.PropTypes.string,
      last_worked_at:  React.PropTypes.string,
      type:            React.PropTypes.string,
    }).isRequired,
  },

  renderLink({ message }) {
    return (
      <TutorLink
        className={`task-result status-cell ${this.props.className}`}
        to="viewTask"
        data-assignment-type={`${this.props.task.type}`}
        params={{ courseId: this.props.courseId, id: this.props.task.id }}>
        <span>
          {message}
        </span>
        <LateIcon {...this.props} />
      </TutorLink>
    );
  }

  getInitialState() {
    return (
      { showingLateOverlay: false }
    );
  },

  lateOverlayStateChanged(status) {
    this.props.task.showingLateOverlay = status;
    return (
      this.forceUpdate()
    );
  },

};
