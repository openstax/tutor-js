import {
    React, PropTypes, styled, computed, action, observer,
} from 'vendor';
import { Icon } from 'shared';
import { Row, Col, OverlayTrigger } from 'react-bootstrap';
import { compact } from 'lodash';
import DateTime from '../../components/date-time-input';
import NewIcon from '../../components/new-icon';
import CheckboxInput from '../../components/checkbox-input';
import { GreyPopover } from './builder';
import { colors } from 'theme';

const StyledTasking = styled.div`
  min-height: 7rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0 0 2.7rem;
  margin-bottom: ${props => props.renderingDates ? 0 : '-4rem' }

  .react-datepicker-wrapper {
    height: 100%;
  }

  .oxdt-input > input {
    color: ${colors.neutral.darker};
  }
`;

const StyledInner = styled.div`
  &:not([data-period-id="all"]) {
    margin-top: 0.5rem;
    padding-left: 2.2rem;
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

    @action.bound onOpensChange({ target: { value: date, name: name } }, index) {
        const { didUserChangeDatesManually, dueAt, gradingTemplate } = this.props.ux;
        this.taskings.forEach(t => {
            t.setOpensDate(date);
            this.form.setFieldValue(name, t.opens_at);

            if(!didUserChangeDatesManually) {
                // *!dueAt* means that assignment creation was started from the sidebar
                // if open date is changed and assignment creation started from the sidebar,
                // then change dates according to grading template intervals
                if(!dueAt) {
                    if (gradingTemplate) {
                        t.onGradingTemplateUpdate(gradingTemplate);
                    }
                    this.form.setFieldValue(`tasking_plans[${index}].due_at`, t.due_at);
                    this.form.setFieldValue(`tasking_plans[${index}].closes_at`, t.closes_at);
                }
                // otherwise do not enforce grading template dates interval anymore
                else {
                    this.props.ux.setDidUserChangeDatesManually(true);
                }
            }
        });
    }

    @action.bound onDueChange({ target: { value: date, name: name } }, index) {
        const { didUserChangeDatesManually, dueAt, gradingTemplate } = this.props.ux;
        this.taskings.forEach(t => {
            t.setDueDate(date);
            this.form.setFieldValue(name, t.due_at);

            if(dueAt) {
                this.props.ux.setDueAt(t.due_at);
            }

            if(!didUserChangeDatesManually) {
                // *dueAt* means that assignment creation was started from the calendar
                // if due date is changed and assignment creation started from the calendar,
                // then change dates according to grading template intervals
                if(dueAt) {
                    if (gradingTemplate) {
                        // this will also reset the due_at to template time
                        t.onGradingTemplateUpdate(gradingTemplate, t.due_at, { dateWasManuallySet: true });
                    }
                    this.form.setFieldValue(`tasking_plans[${index}].opens_at`, t.opens_at);
                    this.form.setFieldValue(`tasking_plans[${index}].closes_at`, t.closes_at);
                }
                // otherwise do not enforce grading template dates interval anymore
                else
                    this.props.ux.setDidUserChangeDatesManually(true);
            }
        });
    }

    @action.bound onClosesChange({ target: { value: date, name: name } }) {
        this.taskings.forEach(t => {
            t.setClosesDate(date);
            this.form.setFieldValue(name, t.closes_at);

            this.props.ux.setDidUserChangeDatesManually(true);
        });
    }

    renderSelectionCheckbox() {
        const { ux, period, ux: { plan } } = this.props;
        if (!period) { return null; }
        const checked = !!plan.tasking_plans.forPeriod(period);
        if (checked && plan.isOpen) {
            return (
                <span>
                    <Icon
                        size="lg"
                        variant={checked ? 'checkedSquare' : 'checkSquare'}
                        tooltip={`You cannot withdraw this assignment for ${period.name} only. To permanently delete this assignment for all sections, go to the assignment page.`}
                    />
                    {period.name}
                </span>
            );
        }

        return (
            <CheckboxInput
                id={`period-toggle-${period.id}`}
                disabled={plan.isOpen}
                label={period.name}
                labelSize="lg"
                name={`cb-${period.id}`}
                data-period-id={period.id}
                checked={checked}
                onChange={ux.togglePeriodTasking}
            />
        );
    }

    displayDueDateError(tasking) {
        if(!tasking.isDueAfterOpen) {
            return 'Due time cannot be before the open time';
        }

        // In Edit mode: Do not show this error when the instructor goes to edit mode and due date has past already.
        // show this error after the instructor made a change.
        if((tasking.isNew || tasking.dueAtChanged) && tasking.isPastDue) {
            return 'Due time has already passed';
        }

        return null;
    }

    displayCloseDateError(tasking) {    
        if(!tasking.isCloseAfterDue) {
            return 'Close time cannot be before the due time';
        }

        return null;
    }

    render() {
        const tasking = this.taskings.length ? this.taskings[0] : null;
        const { period } = this.props;
        const type = period ? `period-${period.id}` : 'combined';

        return (
            <StyledTasking className="tasking" data-test-id="tasking" renderingDates={tasking}>
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
        return (
            <Row className="tasking-date-time">
                <Col xs={12} md={!this.plan.isEvent ? 4 : 6} className="opens-at">
                    <OpensDateTime
                        index={index}
                        tasking={tasking}
                        onChange={this.onOpensChange}
                        disabledDate={this.course.isInvalidAssignmentDate}
                        timezone={this.course.timezone}
                    />
                </Col>
                <Col xs={12} md={!this.plan.isEvent ? 4 : 6} className="due-at">
                    <DateTime
                        label="Due date & time"
                        name={`tasking_plans[${index}].due_at`}
                        disabledDate={this.course.isInvalidAssignmentDate}
                        onChange={(target) => this.onDueChange(target, index)}
                        timezone={this.course.timezone}
                        errorMessage={this.displayDueDateError(tasking)}
                    />
                </Col>
                {!this.plan.isEvent &&
          <Col xs={12} md={4} className="closes-at">
              <DateTime
                  label="Close date & time"
                  labelWrapper={ux.isShowingPeriodTaskings ? null : NewIcon}
                  name={`tasking_plans[${index}].closes_at`}
                  onChange={this.onClosesChange}
                  disabledDate={this.course.isInvalidAssignmentDate}
                  timezone={this.course.timezone}
                  errorMessage={this.displayCloseDateError(tasking)}
              />
          </Col>
                }
            </Row>
        );
    }
}

const OpensDateTime = observer(({ index, disabledDate, tasking, onChange, timezone }) => {
    const input = (
        <DateTime
            label="Open date & Time"
            disabled={!tasking.canEditOpensAt}
            name={`tasking_plans[${index}].opens_at`}
            onChange={(ev) => onChange(ev, index)}
            disabledDate={disabledDate}
            timezone={timezone}
        />
    );
    if (tasking.canEditOpensAt) {
        return input;
    }

    return (
        <OverlayTrigger
            trigger="hover"
            placement="bottom"
            overlay={<GreyPopover>Cannot be edited after assignment is open</GreyPopover>}
        >
            <div>{input}</div>
        </OverlayTrigger>
    );
});

export default Tasking;
