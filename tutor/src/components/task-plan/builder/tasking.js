import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TaskingDateTimes from './tasking-date-times';
import { TaskingActions, TaskingStore } from '../../../flux/tasking';

class Tasking extends React.Component {
  static propTypes = {
    period:              PropTypes.object,
    isEditable:          PropTypes.bool.isRequired,
    isEnabled:           PropTypes.bool.isRequired,
    isVisibleToStudents: PropTypes.bool.isRequired,
  };

  togglePeriodEnabled = (toggleEvent) => {
    const { id, period } = this.props;

    if (toggleEvent.target.checked) {
      return TaskingActions.enableTasking(id, period.serialize());
    } else {
      return TaskingActions.disableTasking(id, period.serialize());
    }
  };

  render() {
    const {
      isVisibleToStudents,
      period,
      isEditable,
      isEnabled,
      id,
    } = this.props;

    const { open_time, due_time } = TaskingStore.getDefaultsForTasking(id, period);
    const taskingIdentifier = TaskingStore.getTaskingIndex(period);

    const taskingDateTimesProps = {
      taskingIdentifier,
      required: isEnabled,
      ref: 'date-times',
    };

    if (isEnabled) {
      if (period != null) {
        return (
          <Row
            key={`tasking-enabled-${taskingIdentifier}`}
            className="tasking-plan tutor-date-input">
            <Col sm={4} md={3}>
              <input
                id={`period-toggle-${taskingIdentifier}`}
                disabled={isVisibleToStudents}
                type="checkbox"
                onChange={this.togglePeriodEnabled}
                checked={true} />
              <label className="period" htmlFor={`period-toggle-${taskingIdentifier}`}>
                {period.name}
              </label>
            </Col>
            <TaskingDateTimes {...this.props} {...taskingDateTimesProps} />
          </Row>
        );
      } else {
        return <TaskingDateTimes {...this.props} {...taskingDateTimesProps} />;
      }
    } else {
      if (period != null) {
        // if isVisibleToStudents, we cannot re-enable this task for the period.
        return (
          <Row
            key={`tasking-disabled-${taskingIdentifier}`}
            className="tasking-plan disabled">
            <Col sm={12}>
              <input
                id={`period-toggle-${taskingIdentifier}`}
                type="checkbox"
                disabled={isVisibleToStudents}
                onChange={this.togglePeriodEnabled}
                checked={false} />
              <label className="period" htmlFor={`period-toggle-${taskingIdentifier}`}>
                {period.name}
              </label>
            </Col>
          </Row>
        );
      } else {
        return null;
      }
    }
  }
}

export default Tasking;
