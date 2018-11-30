import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { Row, Col } from 'react-bootstrap';
import { UnsavedStateMixin } from '../../../components/unsaved-state';
import CourseGroupingLabel from '../../../components/course-grouping-label';
import BindStoresMixin from '../../../components/bind-stores-mixin';
import TimeZoneSettings from './time-zone-settings-link';
import taskPlanEditingInitialize from '../initialize-editing';
import TimeHelper from '../../../helpers/time';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import { TaskingStore, TaskingActions } from '../../../flux/tasking';
import { TutorInput, TutorTextArea } from '../../../components/tutor-input';
import Courses from '../../../models/courses-map';
import Tasking from './tasking';

const TaskPlanBuilder = createReactClass({
  displayName: 'TaskPlanBuilder',

  getBindEvents() {
    const { id } = this.props;

    return {
      taskingChanged: {
        store: TaskingStore,
        listenTo: `taskings.${id}.*.changed`,
        callback: this.changeTaskPlan,
      },
    };
  },

  mixins: [BindStoresMixin, UnsavedStateMixin],

  propTypes: {
    id: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    label: PropTypes.string,
    isVisibleToStudents: PropTypes.bool.isRequired,
    isEditable: PropTypes.bool.isRequired,
    isSwitchable: PropTypes.bool.isRequired,
  },

  getInitialState() {
    const { id, courseId } = this.props;
    const course = Courses.get(courseId);
    return {
      term: course.bounds,
      showingPeriods: !TaskingStore.getTaskingsIsAll(id),
      currentLocale: TimeHelper.getCurrentLocales(),
    };
  },

  getDefaultProps() {
    return { label: 'Assignment' };
  },

  // Called by the UnsavedStateMixin to detect if anything needs to be persisted
  // This logic could be improved, all it checks is if a title is set on a new task plan
  hasUnsavedState() { return TaskPlanStore.hasChanged(this.props.id); },

  unsavedStateMessages() { return 'The assignment has unsaved changes'; },

  UNSAFE_componentWillMount() {
    const { id, courseId } = this.props;
    const { term } = this.state;

    // better to have `syncCourseTimezone` out here to make the symmetry
    // of the unsync in the unmount obvious.
    const course = Courses.get(courseId);
    const courseTimezone = course.time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);
    const nextState = taskPlanEditingInitialize(id, course, term);
    return this.setState(nextState);
  },

  componentWillUnmount() {
    return TimeHelper.unsyncCourseTimezone();
  },

  changeTaskPlan() {
    const { id } = this.props;

    const taskings = TaskingStore.getChanged(id);
    return TaskPlanActions.replaceTaskings(id, taskings);
  },

  setAllPeriods() {
    const { id } = this.props;
    TaskingActions.updateTaskingsIsAll(id, true);

    return this.setState({ showingPeriods: false });
  },

  setIndividualPeriods() {
    const { id } = this.props;
    TaskingActions.updateTaskingsIsAll(id, false);

    //clear saved taskings
    return this.setState({ showingPeriods: true });
  },

  setTitle(title) {
    const { id } = this.props;
    return TaskPlanActions.updateTitle(id, title);
  },

  setDescription(desc, descNode) {
    const { id } = this.props;
    return TaskPlanActions.updateDescription(id, desc);
  },

  render() {
    let invalidPeriodsAlert;
    const plan = TaskPlanStore.get(this.props.id);
    const taskings = TaskingStore.get(this.props.id);

    if (this.state.showingPeriods && !taskings.length) {
      invalidPeriodsAlert = <Row>
        <Col className="periods-invalid" sm={12}>
          Please select at least one <CourseGroupingLabel lowercase={true} courseId={this.props.courseId} />
        </Col>
      </Row>;
    }

    const assignmentNameLabel = [
      <span key="assignment-label">
        {`${this.props.label} name`}
      </span>,
      <span key="assignment-label-instructions" className="instructions">
        {' (Students will see this on their dashboard.)'}
      </span>,
    ];

    return (
      <div className="assignment">
        <Row>
          <Col xs={12}>
            <TutorInput
              label={assignmentNameLabel}
              className="assignment-name"
              id="reading-title"
              default={plan.title}
              required={true}
              disabled={!this.props.isEditable}
              onChange={this.setTitle} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <TutorTextArea
              label="Description or special instructions"
              className="assignment-description"
              id="assignment-description"
              default={TaskPlanStore.getDescription(this.props.id)}
              disabled={!this.props.isEditable}
              onChange={this.setDescription} />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="assign-to-label">
            {'\
    Assign to\
    '}
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className="instructions">
              <p>
                {`\
    Set date and time to now to open
    immediately. Course time
    zone: `}
                <TimeZoneSettings courseId={this.props.courseId} />
              </p>
              {this.props.isVisibleToStudents ? <p>
                {'\
      Open times cannot be edited after assignment is visible to students.\
      '}
              </p> : undefined}
            </div>
          </Col>
        </Row>
        {!!this.props.isSwitchable || !this.state.showingPeriods ? this.renderCommonChoice() : undefined}
        {!!this.props.isSwitchable || !!this.state.showingPeriods ? this.renderPeriodsChoice() : undefined}
        {invalidPeriodsAlert}
      </div>
    );
  },

  renderCommonChoice() {
    let radio;
    if (this.props.isSwitchable) { radio = <input
      id="hide-periods-radio"
      name="toggle-periods-radio"
      ref="allPeriodsRadio"
      type="radio"
      disabled={!this.props.isSwitchable}
      onChange={this.setAllPeriods}
      checked={!this.state.showingPeriods} />; }

    return (
      <Row className="common tutor-date-input">
        <Col sm={4} md={3}>
          {radio}
          <label className="period" htmlFor="hide-periods-radio">
            {'\
    All '}
            <CourseGroupingLabel courseId={this.props.courseId} plural={true} />
          </label>
        </Col>
        {this.renderTaskPlanRow()}
      </Row>
    );
  },

  renderPeriodsChoice() {
    let periodsChoice, radio;
    if (this.props.isSwitchable) { radio = <input
      id="show-periods-radio"
      name="toggle-periods-radio"
      type="radio"
      disabled={!this.props.isSwitchable}
      onChange={this.setIndividualPeriods}
      checked={this.state.showingPeriods} />; }

    const choiceLabel = <Row key="tasking-individual-choice">
      <Col md={12}>
        {radio}
        <label className="period" htmlFor="show-periods-radio">
          {'\
  Individual '}
          <CourseGroupingLabel courseId={this.props.courseId} plural={true} />
        </label>
      </Col>
    </Row>;

    if (this.state.showingPeriods) { periodsChoice = Courses.get(this.props.courseId).periods.sorted.map(this.renderTaskPlanRow); }
    if (periodsChoice == null) { periodsChoice = []; }
    periodsChoice.unshift(choiceLabel);
    return periodsChoice;
  },

  renderTaskPlanRow(period) {
    const { id, courseId, isVisibleToStudents, isEditable, isSwitchable } = this.props;
    const { showingPeriods, currentLocale, term } = this.state;

    const taskingIdentifier = TaskingStore.getTaskingIndex(period);
    let isEnabled = TaskingStore.isTaskingEnabled(id, period);
    if (showingPeriods && (period == null)) { isEnabled = false; }

    return (
      <Tasking
        key={(period != null ? period.id : undefined) || 'all'}
        {...this.props}
        termStart={term.start}
        termEnd={term.end}
        isEnabled={isEnabled}
        ref={`tasking-${taskingIdentifier}`}
        period={period}
        isVisibleToStudents={isVisibleToStudents}
        isEditable={isEditable}
        currentLocale={currentLocale} />
    );
  },
});

export default TaskPlanBuilder;
