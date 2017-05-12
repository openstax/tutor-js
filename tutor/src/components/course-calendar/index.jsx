import React from 'react';

import { extend, pick } from 'lodash';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

import { NotificationsBar } from 'shared';

import ModelLoader from '../../models/loader';
import TaskPlans from '../../models/teacher-task-plans';

import { TaskPlanStore } from '../../flux/task-plan';
import Courses from '../../models/courses-map';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import CourseDataHelper from '../../helpers/course-data';
import PH from '../../helpers/period';
import CourseTitleBanner from '../course-title-banner';

import NotificationHelpers from '../../helpers/notifications';

import CourseMonth from './month';

const displayAsHandler = {
  month: CourseMonth,
};

const getDisplayBounds = {
  month(date) {
    return {
      startAt: TimeHelper.toISO(
        date.clone().startOf('month').startOf('week').subtract(1, 'day')
      ),
      endAt: TimeHelper.toISO(
        date.clone().endOf('month').endOf('week').add(1, 'day')
      ),
    };
  },
};

function addPlanToListing(plan) {
  TaskPlans
    .forCourseId(this.props.params.courseId)
    .addPublishingPlan(plan);
}

@observer
export default class TeacherTaskPlanListing extends React.PureComponent {

  static propTypes = {
    dateFormat: React.PropTypes.string,
    date: React.PropTypes.string,
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
      date: React.PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    dateFormat: TimeHelper.ISO_DATE_FORMAT,
  }

  // router context is needed for Navbar helpers
  static contextTypes = {
    router: React.PropTypes.object,
  }

  @observable loader = new ModelLoader({ model: TaskPlans });
  @observable displayAs = 'month';

  @computed get calendarParams() {
    const term = CourseDataHelper.getCourseBounds(this.props.params.courseId);
    const courseDates = { termStart: term.start, termEnd: term.end };
    const date = this.getDateFromParams(courseDates);
    const bounds = getDisplayBounds[this.displayAs](date);
    return (
      extend({ date }, bounds, courseDates)
    );
  }

  @computed get fetchParams() {
    return extend(
      pick(this.calendarParams, 'startAt', 'endAt'),
      { courseId: this.props.params.courseId }
    );
  }

  componentWillMount() {
    const { courseId } = this.props.params;
    const courseTimezone = Courses.get(courseId).time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);
    this.loader.fetch(this.fetchParams);
    TaskPlans.forCourseId(courseId).clearPendingClones();
    return (
      TaskPlanStore.on('saved.*', addPlanToListing)
    );
  }

  componentDidMount() {
    // the unmount from the builder often get's called after
    // the initial `componentWillMount` so this is needed to make sure
    // the time gets synced
    const { courseId } = this.props.params;
    const courseTimezone = Courses.get(courseId).time_zone;
    return (
      TimeHelper.syncCourseTimezone(courseTimezone)
    );
  }

  componentWillUnmount() {
    TimeHelper.unsyncCourseTimezone();
    return (
      TaskPlanStore.off('saved.*', addPlanToListing)
    );
  }

  getBoundsForCourse() {
    const course = Courses.get(this.props.params.courseId);
    const termStart = TimeHelper.getMomentPreserveDate(course.starts_at, this.props.dateFormat);
    const termEnd = TimeHelper.getMomentPreserveDate(course.ends_at, this.props.dateFormat);
    return { termStart, termEnd };
  }

  getDateFromParams({ termStart }) {
    const { date } = this.props.params;
    if (date) {
      return (
        TimeHelper.getMomentPreserveDate(date, this.props.dateFormat)
      );
    } else {
      const now = TimeHelper.getMomentPreserveDate(TimeStore.getNow(), this.props.dateFormat);
      if (termStart.isAfter(now)) { return termStart; } else { return now; }
    }
  }

  render() {
    const {
      displayAs, props: { params, params: { courseId } },
      calendarParams: { date, termStart, termEnd },
    } = this;
    const course  = Courses.get(courseId);
    const hasPeriods = PH.hasPeriods(course);
    const calendarProps = {
      courseId, date, displayAs, hasPeriods, params, termStart, termEnd,
    };

    if (this.loader.isBusy) {
      extend(calendarProps, { className: 'calendar-loading' });
    }

    const CourseCalendar = displayAsHandler[this.displayAs];

    return (
      <div className="list-task-plans">
        <NotificationsBar
          course={course}
          role={Courses.get(courseId).primaryRole}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
        <CourseTitleBanner courseId={courseId} />
        <CourseCalendar {...calendarProps} />
      </div>
    );
  }

}
