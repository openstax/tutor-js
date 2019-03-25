import PropTypes from 'prop-types';
import React from 'react';
import { extend, pick, isEmpty } from 'lodash';
import moment from '../../helpers/moment-range';
import Router from '../../helpers/router';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import { NotificationsBar } from 'shared';
import CoursePage from '../../components/course-page';
import ModelLoader from '../../models/loader';
import Courses, { Course } from '../../models/courses-map';
import Time from '../../models/time';
import TimeHelper from '../../helpers/time';
import NotificationHelpers from '../../helpers/notifications';
import TermsModal from '../../components/terms-modal';
import Dashboard from './dashboard';
import CourseCalendarHeader from './header';
import './styles.scss';

@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
class TeacherDashboardWrapper extends React.Component {

  static propTypes = {
    dateFormat: PropTypes.string,
    date: PropTypes.string.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
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

  @computed get date() {
    return TimeHelper.getMomentPreserveDate(this.props.date, this.props.dateFormat);
  }

  @computed get bounds() {
    const { date } = this;
    return {
      startAt: TimeHelper.toISO(
        date.clone().startOf('month').startOf('week').subtract(1, 'day')
      ),
      endAt: TimeHelper.toISO(
        date.clone().endOf('month').endOf('week').add(1, 'day')
      ),
    };
  }

  @computed get fetchParams() {
    return extend({ courseId: this.props.course.id }, this.bounds);
  }

  @observable loader = new ModelLoader({
    model: this.props.course.teacherTaskPlans,
    fetch: true,
  });

  disposePlanObserver = observe(this, 'fetchParams', ({ newValue: fetchParam }) => {
    this.loader.fetch(fetchParam);
  });

  @observable displayAs = 'month';
  @observable showingSideBar = false;

  componentDidMount() {
    const courseTimezone = this.props.course.time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);
    this.props.course.trackDashboardView();
  }

  componentWillUnmount() {
    TimeHelper.unsyncCourseTimezone();
    this.disposePlanObserver();
  }

  @action.bound onSidebarToggle(isOpen) {
    this.showingSideBar = isOpen;
  }

  render() {
    const {
      showingSideBar, displayAs,
      props: { dateFormat, course },
    } = this;

    const hasPeriods = !isEmpty(course.periods.active);
    const dashboardProps = {
      course, date:  moment(this.props.date),
      displayAs, hasPeriods,
      showingSideBar, dateFormat,
    };

    if (this.loader.isBusy) {
      extend(dashboardProps, { className: 'calendar-loading' });
    }

    return (
      <CoursePage
        className="list-task-plans"
        title={course.name}
        subtitle={course.termFull}
        course={course}
        controls={
          <CourseCalendarHeader
            onSidebarToggle={this.onSidebarToggle}
            course={course}
            hasPeriods={hasPeriods}
            defaultOpen={this.showingSideBar}
          />}
        notices={
          <NotificationsBar
            course={course}
            role={course.primaryRole}
            callbacks={NotificationHelpers.buildCallbackHandlers(this)}
          />
        }
      >
        <TermsModal />
        <Dashboard {...dashboardProps} />
      </CoursePage>
    );
  }
}
export { TeacherDashboardWrapper };


export default
class TeacherDashboardDateWrapper extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string,
      date: PropTypes.string,
    }).isRequired,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  render() {
    if (!this.course) {
      return <Redirect to={Router.makePathname('myCourses')} />;
    }

    if (!this.props.params.date) {
      const { bounds } = this.course;
      let date = Time.now;
      if (bounds.start.isAfter(date)) {
        date = bounds.start;
      }

      return (
        <Redirect to={Router.makePathname('calendarByDate', {
          courseId: this.course.id,
          date: moment(date).format(TimeHelper.ISO_DATE_FORMAT),
        })} />
      );
    }

    return (
      <TeacherDashboardWrapper
        date={this.props.params.date}
        course={this.course}
      />
    );
  }


};
