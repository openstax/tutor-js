import { React, ReactDOM, observable, observer, action, cn } from '../../helpers/react';
import moment from 'moment';
import { isEmpty, find, defer, get, invoke } from 'lodash';
import 'moment-timezone';
import PropTypes from 'prop-types';
import qs from 'qs';
import Month from './month';
import extend from 'lodash/extend';
import TourRegion from '../../components/tours/region';
import Course from '../../models/course';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import TutorRouter from '../../helpers/router';
import TaskPlanMiniEditor from '../../screens/assignment-builder/mini-editor';
import AddAssignmentSidebar from './add-assignment-sidebar';
import MonthTitleNav from './month-title-nav';
import AddAssignmentPopup from './add-assignment-popup';

export default
@observer
class TeacherDashboard extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    date:       TimeHelper.PropTypes.moment,
    className:  PropTypes.string,
    hasPeriods: PropTypes.bool.isRequired,
    dateFormat: PropTypes.string.isRequired,
    course:     PropTypes.instanceOf(Course).isRequired,
    showingSideBar: PropTypes.bool.isRequired,
    params: PropTypes.object,
  };

  static defaultProps = {
    date: moment(TimeStore.getNow()),
    params: {},
  };
  @observable activeAddAssignment;
  @observable hoveredDay;
  @observable cloningPlan;
  @observable editingPlan;

  @action.bound setDate(date) {
    const { course, params } = this.props;
    if (moment(date).isSame(this.props.date, 'month')) {
      return;
    }
    const newParams = {
      ...params,
      courseId: course.id,
      date: date.format(this.props.dateFormat),
    };
    this.context.router.history.push(
      TutorRouter.makePathname('calendarByDate', newParams)
    );
  }

  componentDidMount() {
    document.addEventListener('click', this.shouldHideAddOnDay, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.shouldHideAddOnDay, true);
  }

  @action.bound shouldHideAddOnDay(clickEvent) {
    // hide unless a add option or day is clicked
    if (!clickEvent.target.classList.contains('.day') &&
      !get(clickEvent.target, 'dataset.assignmentType')) {
      this.activeAddAssignment = {};
    }
  }

  getFullMonthName = () => {
    return invoke(this.props.date, 'format', 'MMMM');
  };

  @action.bound onDrop(item, offset) {
    const { start, end } = this.props.course.bounds;

    if (!this.hoveredDay ||
      !this.hoveredDay.isBetween(start, end, 'day', '[]') ||
      !this.hoveredDay.isSameOrAfter(TimeStore.getNow(), 'day')) { return; }
    if (item.pathname) { // is a link to create an assignment
      const url = item.pathname + '?' + qs.stringify({
        due_at: this.hoveredDay.format(this.props.dateFormat),
      });
      this.context.router.history.push(url);
    } else { // is a task plan to clone
      this.cloningPlan = extend(
        {},
        item,
        {
          onLoad: this.onCloneLoaded,
          due_at: this.hoveredDay,
          position: offset,
        },
      );
      if (TaskPlanStore.isLoaded(item.id)) {
        this.onCloneLoaded();
      } else {
        TaskPlanStore.on(`loaded.${item.id}`, this.onCloneLoaded);
      }

    }
  }

  @action.bound onCloneLoaded() {
    const { course } = this.props;
    TaskPlanStore.off(`loaded.${this.cloningPlan.id}`, this.onCloneLoaded);

    const taskPlanId = TaskPlanStore.freshLocalId();
    TaskPlanActions.createClonedPlan(taskPlanId, {
      planId: this.cloningPlan.id, courseId: course.id,
      due_at: TimeHelper.toISO(this.cloningPlan.due_at),
    });
    course.teacherTaskPlans.addClone(TaskPlanStore.get(taskPlanId));

    defer(action(() => { // give flux store time to update
      Object.assign(this, {
        editingPlan: {
          id: taskPlanId, fromClone: this.cloningPlan,
        },
        cloningPlan: undefined,
      });
    }));
  }

  getEditingPlanEl = () => {
    if (!this.editingPlan) { return null; }
    const date = this.editingPlan.fromClone.due_at.format('YYYYMMDD');
    return document.querySelector(`.day[data-date="${date}"]`);
  };

  onDragHover = (day) => {
    this.hoveredDay = day;
  };

  onEditorHide = () => {
    this.editingPlan = null;
  };

  @action.bound onDayClick(ev, date) {
    this.activeAddAssignment = {
      date, x: ev.pageX, y: ev.pageY,
    };
  }

  render() {
    const { course, className, date, hasPeriods } = this.props;

    const calendarClassName = cn('calendar-container', className,
      { 'with-sidebar-open': this.props.showingSideBar }
    );

    return (
      <TourRegion
        className={calendarClassName}
        id="teacher-calendar"
        otherTours={[
          'teacher-calendar-super', 'reading-published',
          'homework-published', 'new-enrollment-link',
        ]}
        courseId={course.id}>
        <AddAssignmentPopup
          ref="addAssignmentPopup"
          hasPeriods={hasPeriods}
          course={course}
          {...this.activeAddAssignment}
        />
        <div className="calendar-body">
          <AddAssignmentSidebar
            isOpen={this.props.showingSideBar}
            course={this.props.course}
            hasPeriods={hasPeriods}
            cloningPlanId={
            this.cloningPlanId || (this.cloningPlan ? this.cloningPlan.id : undefined)
            }
          />
          <div className="month-body" data-duration-name={this.getFullMonthName()}>
            <MonthTitleNav
              course={this.props.course}
              duration="month"
              date={date}
              setDate={this.setDate}
            />
            <Month
              onDayClick={this.onDayClick}
              cloningPlan={this.cloningPlan}
              course={course}
              onDrag={this.onDragHover}
              onDrop={this.onDrop}
              date={date}
            />
          </div>
        </div>

        {this.editingPlan && (
           <TaskPlanMiniEditor
             planId={this.editingPlan.id}
             position={this.editingPosition}
             course={course}
             onHide={this.onEditorHide}
             findPopOverTarget={this.getEditingPlanEl}
           />)}
      </TourRegion>
    );
  }

};
