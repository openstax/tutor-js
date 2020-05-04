import {
  React, PropTypes, styled, computed, action, observer,
} from 'vendor';
import moment from 'moment';
import { Row, Col, Alert } from 'react-bootstrap';
import { compact } from 'lodash';
import { findEarliest, findLatest } from '../../helpers/dates';
import Time from '../../models/time';
import DateTime from '../../components/date-time-input';
import NewTooltip from './new-tooltip';
import CheckboxInput from '../../components/checkbox-input';

const StyledTasking = styled.div`
  min-height: 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0 0 2.7rem;
  margin-bottom: ${props => props.renderingDates ? 0 : '-4rem' }

  .react-datepicker-wrapper {
    height: 100%;
  }
`;

const StyledInner = styled.div`
  &:not([data-period-id="all"]) {
    margin-top: 0.5rem;
    padding-left: 2.2rem;
  }
`;

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  font-size: 1.6rem;
`;

const CantEditExplanation = () => (
  <StyledAlert variant="secondary">
    Cannot be edited after assignment is visible
  </StyledAlert>
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
  @computed get form() { return this.props.ux.form; }

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

  @action.bound onOpensChange({ target: { value: date, name: name } }) {
    this.taskings.forEach(t => {
      t.setOpensDate(date);
      this.form.setFieldValue(name, t.opens_at);
    });
  }

  @action.bound onDueChange({ target: { value: date, name: name } }) {
    this.taskings.forEach(t => {
      t.setDueDate(date);
      this.form.setFieldValue(name, t.due_at);
    });
  }

  @action.bound onClosesChange({ target: { value: date, name: name } }) {
    this.taskings.forEach(t => {
      t.setClosesDate(date);
      this.form.setFieldValue(name, t.closes_at);
    });
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
      <StyledAlert variant="danger">
        {msg}
      </StyledAlert>
    );
  }

  renderSelectionCheckbox() {
    const { ux, period, ux: { plan } } = this.props;
    if (!period) { return null; }
    return (
      <CheckboxInput
        id={`period-toggle-${period.id}`}
        disabled={!plan.isEditable}
        label={period.name}
        labelSize="lg"
        data-period-id={period.id}
        checked={!!plan.tasking_plans.forPeriod(period)}
        onChange={ux.togglePeriodTasking}
      />
    );
  }

  render() {
    const tasking = this.taskings.length ? this.taskings[0] : null;
    const { period } = this.props;
    const type = period ? `period-${period.id}` : 'combined';

    return (
      <StyledTasking className="tasking" renderingDates={tasking}>
        {this.renderSelectionCheckbox()}
        <StyledInner
          data-tasking-type={type}
          data-period-id={period ? period.id : 'all'}
        >
          {tasking && this.renderDateTimeInputs(tasking, type)}
        </StyledInner>
      </StyledTasking>
    );
  }

  renderDateTimeInputs(tasking) {
    const { ux } = this.props;
    const index = this.props.ux.plan.tasking_plans.indexOf(tasking);
    const format = 'MMM D hh:mm A';

    return (
      <Row className="tasking-date-time">
        <Col xs={12} md={4} className="opens-at">
          <DateTime
            label="Open date & time"
            name={`tasking_plans[${index}].opens_at`}
            onChange={this.onOpensChange}
            format={format}
          />
          {!tasking.canEditOpensAt && <CantEditExplanation />}
        </Col>
        <Col xs={12} md={4} className="due-at">
          <DateTime
            label="Due date & time"
            name={`tasking_plans[${index}].due_at`}
            onChange={this.onDueChange}
            format={format}
          />
          {this.renderDueAtError()}
        </Col>
        <Col xs={12} md={4} className="closes-at">
          <DateTime
            label="Close date & time"
            labelWrapper={ux.isShowingPeriodTaskings ? null : NewTooltip}
            name={`tasking_plans[${index}].closes_at`}
            onChange={this.onClosesChange}
            format={format}
          />
        </Col>
      </Row>
    );
  }
}

export default Tasking;
