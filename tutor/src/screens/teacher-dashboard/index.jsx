import PropTypes from 'prop-types';
import React from 'react';
import { extend, pick, isEmpty } from 'lodash';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { NotificationsBar } from 'shared';
import CoursePage from '../../components/course-page';
import ModelLoader from '../../models/loader';
import Courses from '../../models/courses-map';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import CourseDataHelper from '../../helpers/course-data';
import NotificationHelpers from '../../helpers/notifications';
import TermsModal from '../../components/terms-modal';
import CourseMonth from './month';
import CourseCalendarHeader from './header';
import './styles.scss';

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


export default
@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
class TeacherTaskPlanListing extends React.Component {

  static propTypes = {
    dateFormat: PropTypes.string,
    params: PropTypes.shape({
      courseId: PropTypes.string,
      date: PropTypes.string,
    }).isRequired,
    tourContext: PropTypes.object,
  }

  static defaultProps = {
    dateFormat: TimeHelper.ISO_DATE_FORMAT,
  }

  // router context is needed for Navbar helpers
  static contextTypes = {
    router: PropTypes.object,
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

  @observable loader = new ModelLoader({ model: this.course.taskPlans });

  @observable displayAs = 'month';
  @observable showingSideBar = false;
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

  @action.bound onSidebarToggle(isOpen) {
    this.showingSideBar = isOpen;
  }

  renderCourseCalendarHeader(course, hasPeriods) {
    return (
      <CourseCalendarHeader
        defaultOpen={this.showingSideBar}
        onSidebarToggle={this.onSidebarToggle}
        course={course}
        hasPeriods={hasPeriods}
      />
    );
  }

  render() {
    const {
      course, showingSideBar, displayAs,
      props: { dateFormat, params, params: { courseId } },
      calendarParams: { date, termStart, termEnd },
    } = this;

    const hasPeriods = !isEmpty(course.periods.active);
    const calendarProps = {
      course, date, displayAs, hasPeriods, params,
      termStart, termEnd, showingSideBar, dateFormat,
    };

    if (this.loader.isBusy) {
      extend(calendarProps, { className: 'calendar-loading' });
    }

    const CourseCalendar = displayAsHandler[this.displayAs];

    return (
      <CoursePage
        className="list-task-plans"
        title={course.name}
        subtitle={course.termFull}
        course={course}
        controls={this.renderCourseCalendarHeader(course, hasPeriods)}
        notices={
          <NotificationsBar
            course={course}
            role={course.primaryRole}
            callbacks={NotificationHelpers.buildCallbackHandlers(this)}
          />
        }
      >
        <TermsModal />
        <CourseCalendar {...calendarProps} />
      </CoursePage>
    );
  }

};
