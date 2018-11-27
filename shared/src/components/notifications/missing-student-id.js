import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';
import Notifications from '../../model/notifications';

class MissingStudentIdNotification extends React.Component {
  static displayName = 'MissingStudentIdNotification';

  static propTypes = {
    callbacks: PropTypes.shape({
      onAdd: PropTypes.func.isRequired,
    }).isRequired,

    notice: PropTypes.shape({
      role:   PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        type:      PropTypes.string,
        joined_at: PropTypes.string,
        latest_enrollment_at: PropTypes.string,
      }),

      course: PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
      }),
    }).isRequired,
  };

  onAddClicked = () => {
    Notifications.acknowledge(this.props.notice);
    return this.props.callbacks.onAdd(this.props.notice);
  };

  render() {
    return (
      <div className="notification missing-student-id">
        <span className="body">
          <Icon type="info-circle" />
          <span>
            To get credit for your work, add your student ID.
          </span>
          <a className="action" onClick={this.onAddClicked}>
            Add Student ID
          </a>
        </span>
      </div>
    );
  }
}

export default MissingStudentIdNotification;
