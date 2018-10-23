import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import Time from '../time';
import { Markdown } from 'shared';
import _ from 'underscore';

class Instructions extends React.Component {
  static defaultProps = {
    title: 'Instructions',
    trigger: ['hover', 'focus'],
    placement: 'top',
    popverClassName: 'task-details-popover',
  };

  static displayName = 'Instructions';

  static propTypes = {
    task: PropTypes.object.isRequired,
    title: PropTypes.string,
    trigger: PropTypes.array,
    placement: PropTypes.string,
    popverClassName: PropTypes.string,
  };

  render() {
    const { task, title, trigger, placement, popverClassName, children } = this.props;

    if (task.description == null) { return null; }

    const instructionsPopover =
      <BS.Popover
        id={`task-details-popover-${task.id}`}
        className={popverClassName}
        title={title}>
        <Markdown text={task.description} />
      </BS.Popover>;

    const defaultTriggerButton = <button className="task-details-instructions" aria-label={`${title} info`} />;

    return (
      <BS.OverlayTrigger trigger={trigger} placement={placement} overlay={instructionsPopover}>
        {children || defaultTriggerButton}
      </BS.OverlayTrigger>
    );
  }
}

class Details extends React.Component {
  static defaultProps = {
    dateFormat: 'ddd MMM Do',
    dateLabel: 'Due',
  };

  static displayName = 'Details';

  static propTypes = {
    task: PropTypes.object.isRequired,
    title: PropTypes.string,
    dateFormat: PropTypes.string,
    dateLabel: PropTypes.string,
    trigger: PropTypes.string,
    placement: PropTypes.string,
    className: PropTypes.string,
    lateStatus: PropTypes.element,
  };

  render() {
    let details;
    let { task, dateFormat, dateLabel, lateStatus, className } = this.props;

    if (className == null) { className = ''; }
    className += ' task-details';

    if (task.due_at == null) { return null; }

    if (task.description) {
      const instructionsProps = _.pick(this.props, 'task', 'title', 'trigger', 'placement');
      details =
        <div className={className}>
          <div>
            {dateLabel}
            {' '}
            <Time date={task.due_at} format={dateFormat} />
            {lateStatus}
            <Instructions {...instructionsProps} />
          </div>
        </div>;
    } else {
      details =
        <div className={className}>
          <div className="task-details-due-date">
            {dateLabel}
            {' '}
            <Time date={task.due_at} format={dateFormat} />
            {lateStatus}
          </div>
        </div>;
    }

    return details;
  }
}

export { Details, Instructions };
