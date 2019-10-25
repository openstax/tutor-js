import { React, PropTypes, observer, cn } from 'vendor';
import { Row, Col } from 'react-bootstrap';
import CourseGroupingLabel from '../../../components/course-grouping-label';
import TimeZoneSettings from './time-zone-settings-link';
import { TutorInput, TutorTextArea } from '../../../components/tutor-input';
import Tasking from './tasking';
import UX from '../ux';

@observer
class TaskPlanBuilder extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux, ux: { course, plan } } = this.props;
    const taskings = plan.tasking_plans;

    let invalidPeriodsAlert;

    if (this.showingPeriods && !taskings.length) {
      invalidPeriodsAlert = <Row>
        <Col className="periods-invalid" sm={12}>
          Please select at least one <CourseGroupingLabel lowercase={true} courseId={course.id} />
        </Col>
      </Row>;
    }

    return (
      <div className="assignment">
        <Row>
          <Col xs={12}>
            <TutorInput
              className="assignment-name"
              name="title"
              {...ux.form.title}
              label={[
                <span key="assignment-label">
                  Assignment name
                </span>,
                <span key="assignment-label-instructions" className="instructions">
                  {' (Students will see this on their dashboard.)'}
                </span>,
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TutorTextArea
              className="assignment-description"
              name="description"
              {...ux.form.description}
              label="Description or special instructions"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="assign-to-label">
            Assign to
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className="instructions">
              <p>
                Set date and time to now to open
                immediately. Course time zone: <TimeZoneSettings course={course} />
              </p>
            </div>
          </Col>
        </Row>
        <Row
          className={cn('common', 'tutor-input', {
            'is-disabled': !ux.canSelectAllSections,
          })}
        >
          <Col sm={4} md={3}>
            <input
              id="hide-periods-radio"
              name="toggle-periods-radio"
              type="radio"
              value="all"
              disabled={!ux.canSelectAllSections}
              onChange={ux.togglePeriodTaskingsEnabled}
              checked={!ux.isShowingPeriodTaskings}
            />
            <label className="period" htmlFor="hide-periods-radio">
              All <CourseGroupingLabel courseId={course.id} plural={true} />
            </label>
          </Col>
          <Col sm={8} md={9}>
            {!ux.isShowingPeriodTaskings && <Tasking ux={this.props.ux} />}
          </Col>
        </Row>
        <Row key="tasking-individual-choice">
          <Col sm={4} md={3}>
            <input
              id="show-periods-radio"
              name="toggle-periods-radio"
              type="radio"
              value="periods"
              disabled={!plan.isEditable}
              onChange={ux.togglePeriodTaskingsEnabled}
              checked={ux.isShowingPeriodTaskings}
            />
            <label className="period" htmlFor="show-periods-radio">
              Individual <CourseGroupingLabel courseId={course.id} plural={true} />
            </label>
          </Col>
        </Row>
        {ux.isShowingPeriodTaskings &&
          ux.periods.map(period => (
            <Tasking key={period.id} ux={ux} period={period} />
          ))}
        {invalidPeriodsAlert}
      </div>
    );
  }
}

export default TaskPlanBuilder;
