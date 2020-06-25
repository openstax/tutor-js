import { React, PropTypes, styled, observer, inject } from 'vendor';
import { extend, isEmpty } from 'lodash';
import moment from '../../helpers/moment-range';
import Router from '../../helpers/router';
import { observable, computed, action, observe } from 'mobx';
import { Redirect, withRouter } from 'react-router-dom';
import { NotificationsBar, ScrollToTop } from 'shared';
import CoursePage from '../../components/course-page';
import ModelLoader from '../../models/loader';
import Courses, { Course } from '../../models/courses-map';
import Time from '../../models/time';
import TimeHelper from '../../helpers/time';
import NotificationHelpers from '../../helpers/notifications';
import TeacherBecomesStudent from '../../components/buttons/teacher-become-student';
import Dashboard from './dashboard';
import CourseCalendarHeader from './header';

import './styles.scss';


const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 { margin: 0; }
`;

@withRouter
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
    // router's history is needed for Navbar helpers
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dateFormat: TimeHelper.ISO_DATE_FORMAT,
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
    const { course } = this.props;
    const courseTimezone = course.time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);
    course.trackDashboardView();
    // if the teacher is impersonating a student and hit the back button
    // the currentRole will be a TeacherStudent.  We need to reset it
    if (course.currentRole.isTeacherStudent && course.roles.teacher) {
      course.current_role_id = null;
    }
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
        title={(
          <Title>
            <h1>{course.name}</h1>
          </Title>
        )}
        titleControls={(
          <TeacherBecomesStudent course={course} />
        )}
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
    let { date } = this.props.params;

    if (!date || !moment(date, TimeHelper.ISO_DATE_FORMAT, true).isValid()) {
      const { bounds } = this.course;
      date = Time.now;
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
      <ScrollToTop>
        <TeacherDashboardWrapper
          date={date}
          course={this.course}
        />
      </ScrollToTop>
    );
  }

}
