import React from 'react';



import { extend, pick } from 'lodash';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

import ModelLoader from '../../models/loader';
import TaskPlans from '../../models/teacher-task-plans';

import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import Courses from '../../models/courses-map';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import CourseDataHelper from '../../helpers/course-data';
import PH from '../../helpers/period';
import CourseTitleBanner from '../course-title-banner';

import { NotificationsBar } from 'shared';
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

@observer
export default class TeacherTaskPlanListing extends React.PureComponent {

  static propTypes = {
    dateFormat: React.PropTypes.string,
    date: React.PropTypes.string,
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
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

    // TeacherTaskPlanActions.clearPendingClone(courseId);
    return (
      TaskPlanStore.on('saved.*', this.loadToListing)
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
      TaskPlanStore.off('saved.*', this.loadToListing)
    );
  }

  loadToListing(plan) {
    return (
      TeacherTaskPlanActions.addPublishingPlan(plan, this.props.params.courseId)
    );
  }

  getBoundsForCourse() {
    const course = Courses.get(this.props.params.courseId);

    const termStart = TimeHelper.getMomentPreserveDate(course.starts_at, this.props.dateFormat);
    const termEnd = TimeHelper.getMomentPreserveDate(course.ends_at, this.props.dateFormat);

    return {termStart, termEnd};
  }

  getDateFromParams({termStart, termEnd}) {
    const {date} = this.props.params;

    if (date) {
      return (
        TimeHelper.getMomentPreserveDate(date, this.props.dateFormat)
      );
    } else {
      const now = TimeHelper.getMomentPreserveDate(TimeStore.getNow(), this.props.dateFormat);
      if (termStart.isAfter(now)) { return termStart; } else { return now; }
    }
  }

  // isLoadingOrLoad() {
  //   const { courseId } = this.props.params;
  //   const {startAt, endAt} = this.getDateStates();

  //   return (

  //     TeacherTaskPlanStore.isLoadingRange(courseId, startAt, endAt)

  //   );
  // }

  // loadRange() {
  //   const { courseId } = this.props.params;
  //   const {startAt, endAt} = this.getDateStates();

  //   return (

  //       TeacherTaskPlanActions.load(courseId, startAt, endAt)

  //   );
  // }

  render() {
    const {params} = this.props;

    const {courseId} = params;

    const {displayAs} = this;

    const {date, startAt, endAt, termStart, termEnd} = this.calendarParams;

    const course  = Courses.get(courseId);
    const hasPeriods = PH.hasPeriods(course);

    //const loadPlansList = partial(TeacherTaskPlanStore.getActiveCoursePlans, courseId);

    const calendarProps = {
      courseId, date, displayAs, hasPeriods, params, termStart, termEnd,
    };

    if (this.loader.isBusy) {
      extend(calendarProps, { className: 'calendar-loading' });
    }

    const CourseCalendar = displayAsHandler[this.displayAs]

    //
    //     // const loadingCalendarProps = hasPeriods ?
    //     //   _.extend({className: 'calendar-loading'}, loadedCalendarProps)
    //     // :
    //     //   loadedCalendarProps;
    //
    //     {/* <LoadableMap
    //         store={TeacherTaskPlanStore}
    //         actions={TeacherTaskPlanActions}
    //         load={this.loadRange}
    //         options={{startAt, endAt}}
    //         id={courseId}
    //         isLoadingOrLoad={this.isLoadingOrLoad}
    //         renderItem={function() { return <CourseCalendar {...loadedCalendarProps} />
    //
    //         ); }}
    //         renderLoading={function() { return <CourseCalendar {...loadingCalendarProps} />; }} /> */}
    return (
      <div className="list-task-plans">
        <NotificationsBar
          course={course}
          role={Courses.get(courseId).primaryRole}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
        <CourseTitleBanner courseId={courseId} />
        <CourseCalendar {...calendarProps} />;
      </div>
    );
  }

}
