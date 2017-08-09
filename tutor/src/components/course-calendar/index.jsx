import React from 'react';

import { extend, pick } from 'lodash';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';

import { NotificationsBar } from 'shared';

import ModelLoader from '../../models/loader';
import TaskPlans from '../../models/teacher-task-plans';
import onboardingForCourse from '../../models/course/onboarding';
import Courses from '../../models/courses-map';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import CourseDataHelper from '../../helpers/course-data';
import PH from '../../helpers/period';
import CourseTitleBanner from '../course-title-banner';
import CourseNagModal from '../onboarding/course-nag';
import NotificationHelpers from '../../helpers/notifications';
import TermsModal from '../terms-modal';
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


@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
export default class TeacherTaskPlanListing extends React.PureComponent {

  static propTypes = {
    dateFormat: React.PropTypes.string,
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
      date: React.PropTypes.string,
    }).isRequired,
    tourContext: React.PropTypes.object,
  }

  static defaultProps = {
    dateFormat: TimeHelper.ISO_DATE_FORMAT,
  }

  // router context is needed for Navbar helpers
  static contextTypes = {
    router: React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.disposePlanObserver = observe(this, 'fetchParams', ({ newValue: newFetchParams }) => {
      this.loader.fetch(newFetchParams);
    });
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @computed get courseDates() {
    const term = CourseDataHelper.getCourseBounds(this.course.id);
    return { termStart: term.start, termEnd: term.end };
  }

  ux = onboardingForCourse(this.course, this.props.tourContext);

  @observable loader = new ModelLoader({ model: TaskPlans });

  @observable displayAs = 'month';

  @observable date = this.getDateFromParams(this.courseDates);

  @computed get bounds() {
    return getDisplayBounds[this.displayAs](this.date);
  }

  @computed get calendarParams() {
    return (
      extend({ date: this.date }, this.bounds, this.courseDates)
    );
  }

  @computed get fetchParams() {
    return extend(
      pick(this.calendarParams, 'startAt', 'endAt'),
      { courseId: this.course.id }
    );
  }

  componentWillMount() {
    const courseTimezone = this.course.time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);
  }

  componentWillReceiveProps() {
    this.date = this.getDateFromParams(this.courseDates);
  }

  componentDidMount() {
    // the unmount from the builder often get's called after
    // the initial `componentWillMount` so this is needed to make sure
    // the time gets synced
    const courseTimezone = this.course.time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);
    this.course.trackDashboardView();
  }

  componentWillUnmount() {
    TimeHelper.unsyncCourseTimezone();
    this.disposePlanObserver();
    this.ux.close();
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
      course,
      displayAs, props: { params, params: { courseId } },
      calendarParams: { date, termStart, termEnd },
    } = this;

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
          role={course.primaryRole}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)}
        />
        <TermsModal />
        <CourseNagModal ux={this.ux} />
        <CourseTitleBanner courseId={course.id} />
        <CourseCalendar {...calendarProps} />
      </div>
    );
  }

}
