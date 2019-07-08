import {
  React, PropTypes, styled, computed, action, observer,
} from '../../../helpers/react';
import moment from 'moment';
import { max, compact } from 'lodash';
import { findEarliest } from '../../../helpers/dates';
import Time from '../../../models/time';
import { Row, Col } from 'react-bootstrap';
import { TutorDateInput, TutorTimeInput } from '../../../components/tutor-input';


const StyledTasking = styled(Row)`
.tutor-input.form-control-wrapper.tutor-input input[disabled] {
  border-bottom: 0;
}
.react-datepicker-wrapper {
  height: 100%;
}
`;

@observer
class Tasking extends React.Component {
  static propTypes = {
    period: PropTypes.object,
    ux: PropTypes.object,
  };

  setAsDefaultOption() {
    return null;
  }

  @computed get plan() { return this.props.ux.plan; }
  @computed get course() { return this.props.ux.course; }

  @computed get taskings() {
    if (this.props.period) {
      return compact([
        this.plan.tasking_plans.forPeriod(this.props.period),
      ]);
    }
    return compact(
      this.course.periods.active.map((period) => this.plan.tasking_plans.forPeriod(period) ),
    );
  }

  @computed get minOpensAt() {
    const { start } = this.course.bounds;
    return start.isBefore(Time.now) ? start : moment(Time.now);
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
    if (!this.taskings.length) { return null; }

    const { period, ux: { course, form } } = this.props;

    const tasking = this.taskings[0];

    const mainSizes = period ? { sm: 8, md: 9 } : { sm: 12 };
    // console.log(
    //   this.minDueAt.toISOString(),
    //   this.maxDueAt.toISOString(),
    // )
    // console.log(
    //   form.select('tasking_plans')
    // )
    return (
      <StyledTasking>
        {this.renderSelectionCheckbox()}
        <Col
          {...mainSizes}
          className="tasking-date-times"
          data-period-id={period ? period.id : 'all'}
        >
          <Row>
            <Col xs={12} md={6} className="opens-at">
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
                    defaultValue={course.default_open_time}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6} className="due-at">
              <Row>
                <Col md={7} xs={8}>
                  <TutorDateInput
                    label="Due Date"
                    min={this.minDueAt}
                    max={this.maxDueAt}
                    value={tasking.due_at}
                    onChange={this.onDueDateChange}
                  />
                </Col>
                <Col md={5} xs={4}>
                  <TutorTimeInput
                    label="Due Time"
                    value={tasking.due_at}
                    min={this.minOpensAtDate}
                    max={this.maxOpensAtDate}
                    onChange={this.onDueTimeChange}
                    defaultValue={course.default_due_time}
                  />
                  {this.setAsDefaultOption()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </StyledTasking>
    );
  }
}

export default Tasking;
