import PropTypes from 'prop-types';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import partial from 'lodash/partial';
import without from 'lodash/without';
import classnames from 'classnames';
import Notifications from '../../model/notifications';

// Keep in sync with keys on model/notifications
const TYPES = {
  system: require('./system'),
  accounts: require('./email'),
  [Notifications.POLLING_TYPES.MISSING_STUDENT_ID]: require('./missing-student-id'),
  [Notifications.POLLING_TYPES.COURSE_HAS_ENDED]:   require('./course-has-ended'),
};

class NotificationBar extends React.Component {
  static defaultProps = { displayAfter: 500 };
  static propTypes = {
    callbacks: PropTypes.object.isRequired,
    displayAfter: PropTypes.number,
    className: PropTypes.string,
  };

  state = { notices: [] };

  componentWillUnmount() {
    Notifications.off('change', this.onChange);
    if (this.state.displayTimer) { return clearTimeout(this.state.displayTimer); }
  }

  onChange = () => {
    return this.setState({ notices: Notifications.getActive() });
  };

  onDismiss = (notice) => {
    notice.acknowledged = true;

    const displayTimer = setTimeout( () => {
      Notifications.acknowledge(notice);
      return this.setState({ notices: Notifications.getActive() });
    }
      , this.props.displayAfter);

    return this.setState({ displayTimer });
  };

  UNSAFE_componentWillMount() {
    Notifications.on('change', this.onChange);
    if (this.props.role && this.props.course) {
      Notifications.setCourseRole(this.props.course, this.props.role);
    }
    const notices = Notifications.getActive();
    if (!isEmpty(notices)) {
      // get a fresh list of active notifications after timeout in case some have
      // been acknowledged during the timeout.
      const displayTimer = setTimeout( (() => this.setState({ notices: Notifications.getActive() })), this.props.displayAfter);
      return this.setState({ displayTimer });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Trigger a notification if role or course has changed
    if (((this.props.role != null ? this.props.role.id : undefined) !== (nextProps.role != null ? nextProps.role.id : undefined)) || ((this.props.course != null ? this.props.course.id : undefined) !== (nextProps.course != null ? nextProps.course.id : undefined))) {
      return Notifications.setCourseRole(nextProps.course, nextProps.role);
    }
  }

  render() {
    return (
      <div
        className={classnames('openstax-notifications-bar', this.props.className, { viewable: !isEmpty(this.state.notices) })}>
        {(() => {
          const result = [];
          for (let notice of this.state.notices || []) {
            const Notice = TYPES[(notice != null ? notice.type : undefined) || 'system'] || TYPES['system'];
            result.push(<Notice
              key={notice.id}
              noticeId={notice.id}
              notice={notice}
              onDismiss={partial(this.onDismiss, notice)}
              callbacks={this.props.callbacks[notice.type]} />);
          }
          return result;
        })()}
      </div>
    );
  }
}


export default NotificationBar;
