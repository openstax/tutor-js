import { React, PropTypes, observer, observable, computed } from '../../../helpers/react';
import { Row, Col } from 'react-bootstrap';
import Plan from '../../../models/task-plans/teacher/plan';
import { UnsavedStateMixin } from '../../../components/unsaved-state';
import CourseGroupingLabel from '../../../components/course-grouping-label';
import BindStoresMixin from '../../../components/bind-stores-mixin';
import TimeZoneSettings from './time-zone-settings-link';
import taskPlanEditingInitialize from '../initialize-editing';
import TimeHelper from '../../../helpers/time';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import { TaskingStore, TaskingActions } from '../../../flux/tasking';
import { TutorInput, TutorTextArea } from '../../../components/tutor-input';
import Course from '../../../models/course';
import Tasking from './tasking';
import UX from '../ux';

@observer
class TaskPlanBuilder extends React.Component {

  // getBindEvents() {
  //   const { id } = this.props;
  //
  //   return {
  //     taskingChanged: {
  //       store: TaskingStore,
  //       listenTo: `taskings.${id}.*.changed`,
  //       callback: this.changeTaskPlan,
  //     },
  //   };
  // },
  //
  // mixins: [BindStoresMixin, UnsavedStateMixin],

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,

    // courseId: PropTypes.string.isRequired,
    //
    // isVisibleToStudents: PropTypes.bool.isRequired,
    // isEditable: PropTypes.bool.isRequired,
    // isSwitchable: PropTypes.bool.isRequired,
  }

  @observable isShowingPeriods = false;
  // getInitialState() {
  //   const { id, courseId } = this.props;
  //   const course = Courses.get(courseId);
  //   return {
  //     term: course.bounds,
  //     showingPeriods: !TaskingStore.getTaskingsIsAll(id),
  //     currentLocale: TimeHelper.getCurrentLocales(),
  //   };
  // },
  //
  // getDefaultProps() {
  //   return { label: 'Assignment' };
  // },
  //
  // Called by the UnsavedStateMixin to detect if anything needs to be persisted
  // This logic could be improved, all it checks is if a title is set on a new task plan
  // hasUnsavedState() { return TaskPlanStore.hasChanged(this.props.id); },
  // unsavedStateMessages() { return 'The assignment has unsaved changes'; },

  // componentWillMount() {
  //   const { course } = this.props;
  //
  //   // const { term } = this.state;
  //   //
  //   // // better to have `syncCourseTimezone` out here to make the symmetry
  //   // // of the unsync in the unmount obvious.
  //   // const course = Courses.get(courseId);
  //   // const courseTimezone = course.time_zone;
  //   TimeHelper.syncCourseTimezone(courseTimezone);
  //   const nextState = taskPlanEditingInitialize(id, course, term);
  //   return this.setState(nextState);
  // }
  //
  // componentWillUnmount() {
  //   return TimeHelper.unsyncCourseTimezone();
  // }

  // changeTaskPlan() {
  //   const { ux: { course, plan } } = this.props;
  //   const taskings = TaskingStore.getChanged(id);
  //   return TaskPlanActions.replaceTaskings(id, taskings);
  // }

  setAllPeriods() {
    const { id } = this.props;
    TaskingActions.updateTaskingsIsAll(id, true);
    return this.setState({ showingPeriods: false });
  }

  setIndividualPeriods() {
    const { id } = this.props;
    TaskingActions.updateTaskingsIsAll(id, false);
    //clear saved taskings
    return this.setState({ showingPeriods: true });
  }

  setTitle(title) {
    const { id } = this.props;
    return TaskPlanActions.updateTitle(id, title);
  }

  setDescription(desc, descNode) {
    const { id } = this.props;
    return TaskPlanActions.updateDescription(id, desc);
  }

  @observable showingPeriods = false;

  @computed get isSwitchable() {
    return this.props.ux.plan.isVisibleToStudents;
  }

  render() {
    const { ux, ux: { course, plan } } = this.props;
    const taskings = plan.tasking_plans;

    let invalidPeriodsAlert;

    //    const plan = TaskPlanStore.get(this.props.id);
    //    const taskings = TaskingStore.get(this.props.id);

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
              label={[
                <span key="assignment-label">
                  Assignment name
                </span>,
                <span key="assignment-label-instructions" className="instructions">
                  {' (Students will see this on their dashboard.)'}
                </span>,
              ]}
              className="assignment-name"
              id="reading-title"
              value={plan.title}
              required={true}
              disabled={!plan.isEditable}
              onChange={ux.setTitle} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TutorTextArea
              label="Description or special instructions"
              className="assignment-description"
              id="assignment-description"
              value={plan.description}
              disabled={!plan.isEditable}
              onChange={ux.setDescription} />
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
              {plan.isVisibleToStudents && (
                <p>
                  Open times cannot be edited after assignment is visible to students.
                </p>)}
            </div>
          </Col>
        </Row>

        <Row className="common tutor-date-input">
          <Col sm={4} md={3}>
            <input
              id="hide-periods-radio"
              name="toggle-periods-radio"
              type="radio"
              value="all"
              disabled={!plan.isEditable}
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
          course.periods.sorted.map(period => (
            <Tasking key={period.id} ux={ux} period={period} />
          ))}

        {invalidPeriodsAlert}
      </div>
    );
  }


  renderPeriodsChoice() {
    const { ux, ux: { course, plan } } = this.props;

    return [
      ,
    ].concat(
      course.periods.sorted.map(period => (
        <Tasking key={period.id} ux={ux} period={period} />
      ))
    );


    // termStart={term.start}
    // termEnd={term.end}
    // isEnabled={isEnabled}
    // ref={`tasking-${taskingIdentifier}`}
    // isVisibleToStudents={isVisibleToStudents}
    // isEditable={isEditable}
    // currentLocale={currentLocale}
    //
    //     if (this.isShowingPeriods) {
    //       periodsChoice = .map(this.);
    //     }
    //     if (periodsChoice == null) { periodsChoice = []; }
    //     periodsChoice.unshift(choiceLabel);
    //     return periodsChoice;
  }

  // renderTaskPlanRow(period) {
  //   const { id, courseId, isVisibleToStudents, isEditable, isSwitchable } = this.props;
  //   const { showingPeriods, currentLocale, term } = this.state;
  //
  //   const taskingIdentifier = TaskingStore.getTaskingIndex(period);
  //   let isEnabled = TaskingStore.isTaskingEnabled(id, period);
  //   if (showingPeriods && (period == null)) { isEnabled = false; }
  //
  //   return (
  //     <Tasking
  //       key={(period != null ? period.id : undefined) || 'all'}
  //       {...this.props}
  //       termStart={term.start}
  //       termEnd={term.end}
  //       isEnabled={isEnabled}
  //       ref={`tasking-${taskingIdentifier}`}
  //       period={period}
  //       isVisibleToStudents={isVisibleToStudents}
  //       isEditable={isEditable}
  //       currentLocale={currentLocale} />
  //   );
  // }
}

export default TaskPlanBuilder;
