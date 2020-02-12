import {
  React, PropTypes, styled, computed, action, observer,
} from 'vendor';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import { Icon } from 'shared';
import { compact } from 'lodash';
import { findEarliest, findLatest } from '../../helpers/dates';
import Time from '../../models/time';
import DateTime from '../../components/date-time-input';


const StyledTasking = styled(Row)`
min-height: 7rem;
.react-datepicker-wrapper {
  height: 100%;
}
`;

const StyledCantEditExplanation = styled(Col)`
  margin-top: -25px;
  font-size: 1.2rem;
`;
const CantEditExplanation = () => (
  <Row>
    <StyledCantEditExplanation xs={12}>
       Cannot be edited after assignment is visible
    </StyledCantEditExplanation>
  </Row>
);

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
    return findEarliest(
      this.taskings[0].due_at,
      this.course.bounds.end,
    );
  }

  @computed get minDueAt() {
    return findLatest(
      Time.now,
      this.taskings[0].opens_at,
      this.course.bounds.start,
    );
  }

  @computed get maxDueAt() {
    const { end } = this.course.bounds;
    return this.plan.due_date || end;
  }

  @action.bound onOpensChange({ target: { value: date } }) {
    this.taskings.forEach(t => t.setOpensDate(date));
  }

  @action.bound onDueChange({ target: { value: date } }) {
    this.taskings.forEach(t => t.setDueDate(date));
  }

  @action.bound onClosesChange({ target: { value: date } }) {
    this.taskings.forEach(t => t.setOpensTime(date));
  }

  renderDueAtError() {
    const tasking = this.taskings[0];
    if (tasking.isValid || !tasking.due_at) { return null; }

    let msg = null;
    const due = moment(tasking.due_at);
    if (due.isBefore(Time.now)) {
      msg = 'Due time has already passed';
    } else if (due.isBefore(tasking.opens_at)) {
      msg = 'Due time cannot come before task opens';
    }
    if (!msg) { return null; }
    return (
      <Row>
        <Col className="due-before-open">
          <Icon variant="errorInfo" />
          {msg}
        </Col>
      </Row>
    );
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
          data-period-id={period.id}
          onChange={ux.togglePeriodTasking}
          checked={!!plan.tasking_plans.forPeriod(period)}
        />
        <label className="period" htmlFor={`period-toggle-${period.id}`}>
          {period.name}
        </label>
      </Col>
    );
  }

  render() {
    const tasking = this.taskings.length ? this.taskings[0] : null;
    const { period } = this.props;
    const mainSizes = period ? { sm: 8, md: 9 } : { sm: 12 };
    const type = period ? `period-${period.id}` : 'combined';

    return (
      <StyledTasking className="tasking">
        {this.renderSelectionCheckbox()}
        <Col
          {...mainSizes}

          data-tasking-type={type}
          data-period-id={period ? period.id : 'all'}
        >
          {tasking && this.renderDateTimeInputs(tasking, type)}
        </Col>
      </StyledTasking>
    );
  }

  renderDateTimeInputs(tasking) {
    const index = this.props.ux.plan.tasking_plans.indexOf(tasking);

    return (
      <Row className="tasking-date-time">
        <Col xs={12} md={6} className="opens-at">
          <Row>
            <Col xs={6}>
              <DateTime label="Opens at" name={`tasking_plans[${index}].opens_at`} onChange={this.onOpensChange} />
            </Col>
          </Row>
          {!tasking.canEditOpensAt && <CantEditExplanation />}
        </Col>
        <Col xs={12} md={6} className="due-at">
          <Row>
            <Col xs={6}>
              <DateTime label="Due at" name={`tasking_plans[${index}].due_at`} onChange={this.onDueChange} />
            </Col>
            <Col xs={6}>
              <DateTime label="Closes at" name={`tasking_plans[${index}].closes_at`} onChange={this.onClosesChange} />
            </Col>
          </Row>
          {this.renderDueAtError()}
        </Col>
      </Row>
    );
  }
}

export default Tasking;
