import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import S from '../helpers/string';
import TaskHelper from '../helpers/task';

export default class extends React.Component {
  static defaultProps = {
    buildLateMessage(task, status) {
      return `${S.capitalize(task.type)} was ${status.how_late} late`;
    },
  };

  static displayName = 'LateIcon';

  static propTypes = {
    task: PropTypes.shape({
      due_at:          PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),

      last_worked_at:  PropTypes.date,
      type:            PropTypes.string,
      status:          PropTypes.string,
    }).isRequired,

    buildLateMessage: PropTypes.func,
  };

  render() {
    const { task, className, buildLateMessage } = this.props;
    const status = TaskHelper.getLateness(task);

    if ((task.status === 'not_started') || !status.is_late) { return null; }

    let classes = 'late';
    if (className != null) { classes += ` ${className}`; }

    const tooltip = <BS.Tooltip id={`late-icon-tooltip-${task.id}`}>
      {buildLateMessage(task, status)}
    </BS.Tooltip>;
    return (
      <BS.OverlayTrigger placement="top" overlay={tooltip}>
        <i className={classes} />
      </BS.OverlayTrigger>
    );
  }
}
