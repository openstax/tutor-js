import {
  React, PropTypes, computed, action, observer,
} from '../../../helpers/react';
import moment from 'moment';
import { max } from 'lodash';
import { findEarliest, findLatest } from '../../../helpers/dates';
import Time from '../../../models/time';
import { Row, Col } from 'react-bootstrap';
import { TutorDateInput, TutorTimeInput } from '../../../components/tutor-input';

@observer
class Tasking extends React.Component {
  static propTypes = {
    period: PropTypes.object,
    ux: PropTypes.object,
    // isEditable:          PropTypes.bool.isRequired,
    // isEnabled:           PropTypes.bool.isRequired,
    // isVisibleToStudents: PropTypes.bool.isRequired,
  };


  setAsDefaultOption() {
    return null;
  }

  @computed get plan() { return this.props.ux.plan; }
  @computed get course() { return this.props.ux.course; }

  get taskings() {
    if (this.props.period) {
      return [
        this.plan.findOrCreateTaskingForPeriod(this.props.period),
      ];
    }
    return this.course.periods.active.map((period) =>
      this.plan.findOrCreateTaskingForPeriod(period),
    );
  }

  @computed get minOpensAt() {
    const { start } = this.course.bounds;
    return start.isAfter(Time.now) ? start : moment(Time.now);
  }
  @computed get maxOpensAt() {
    const { end } = this.course.bounds;
    return this.plan.due_date || end;
  }


  @computed get minDueAt() {
    const { start } = this.course.bounds;
    return max([
      findEarliest([Time.now, start, this.maxOpensAt])
      ,Time.now,
    ]);
  }

  @computed get maxDueAt() {
    const { end } = this.course.bounds;
    return this.plan.due_date || end;
  }

  @action.bound onOpensDateChange(date) {
    this.taskings.forEach(t => t.setOpensDate(date));
  }

  @action.bound onOpensTimeChange(time) {
    this.taskings.forEach(t => t.setOpensTime(time));
  }

  @action.bound onDueDateChange(date) {
    this.taskings.forEach(t => t.setDueDate(date));
  }
  @action.bound onDueTimeChange(time) {
    this.taskings.forEach(t => t.setDueTime(time));
  }

  renderSelectionCheckbox() {
    const { ux, period, ux: { plan } } = this.props;
    if (!period) { return null; }

    return (
      <Col sm={4} md={3}>
        <input
          id={`period-toggle-${period.id}`}
          disabled={!plan.isEditable}
          type="checkbox"
          onChange={ux.togglePeriodTaskingsEnabled}
          checked={ux.isShowingPeriodTaskings}
        />
        <label className="period" htmlFor={`period-toggle-${period.id}`}>
          {period.name}
        </label>
      </Col>
    );
  }

  render() {
    const { ux, period, ux: { plan } } = this.props;
    const tasking = this.taskings[0];

    const mainSizes = period ? { sm: 8, md: 9 } : { sm: 12 };

    return (
      <Row className="tasking-plan tutor-date-input">
        {this.renderSelectionCheckbox()}

        <Col
          {...mainSizes}
          className="tasking-date-times"
          data-period-id={period ? period.id : 'all'}
        >
          <Row>
            <Col xs={12} md={6} className="tasking-date">
              <Row>
                <Col md={7} xs={8}>
                  <TutorDateInput
                    value={tasking.opens_at}
                    min={this.minOpensAt}
                    max={this.maxOpensAt}
                    onChange={this.onOpensDateChange}
                    label="Open Date"
                    ref="date"
                  />
                </Col>
                <Col md={5} xs={4}>
                  <TutorTimeInput
                    label="Open Time"
                    value={tasking.opens_at}
                    onChange={this.onOpensTimeChange}
                    ref="time"
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6} className="tasking-date">
              <Row>
                <Col md={7} xs={8}>
                  <TutorDateInput
                    label="Due Date"
                    value={tasking.due_at}
                    min={this.minDueAt}
                    max={this.maxDueAt}
                    onChange={this.onDueDateChange}
                  />
                </Col>
                <Col md={5} xs={4}>
                  <TutorTimeInput
                    label="Due Time"
                    value={tasking.due_at}
                    min={this.minOpensAtDate}
                    max={this.maxOpensAtDate}
                    onChange={this.onDueDateChange}
                  />
                  {this.setAsDefaultOption()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );

    // } else {
    //       return <TaskingDateTimes {...this.props} {...taskingDateTimesProps} />;
    //     }
    //   } else {
    //     if (period) {
    //       // if isVisibleToStudents, we cannot re-enable this task for the period.
    //       return (
    //         <Row
    //           key={`tasking-disabled-${taskingIdentifier}`}
    //           className="tasking-plan disabled">
    //           <Col sm={12}>
    //             <input
    //               id={`period-toggle-${taskingIdentifier}`}
    //               type="checkbox"
    //               disabled={!plan.isEditable}
    //               onChange={this.togglePeriodEnabled}
    //               checked={false} />
    //             <label className="period" htmlFor={`period-toggle-${taskingIdentifier}`}>
    //               {period.name}
    //             </label>
    //           </Col>
    //         </Row>
    //       );
    //     } else {
    //       return null;
    //     }
  }
}

export default Tasking;
