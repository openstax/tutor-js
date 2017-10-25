import React from 'react';

import StudentTasks from '../../models/student-tasks';
import LoadableItem from '../loadable-item';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import StudentDashboard from './dashboard';
import CourseNagModal from '../onboarding/course-nag';
import TermsModal from '../terms-modal';
import onboardingForCourse from '../../models/course/onboarding';
import Courses from '../../models/courses-map';
import WarningModal from '../warning-modal';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class StudentDashboardShell extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
    }).isRequired,
    tourContext: React.PropTypes.object,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @observable ux;

  componentWillMount() {
    if (!this.course) { return; }
    this.ux = onboardingForCourse(this.course, this.props.tourContext);
    if (!this.ux.paymentIsPastDue) {
      this.course.studentTasks.fetch();
    }
    this.ux.mount(); // ux will use this to start silencing tours while it's displaying payment nags
  }

  componentWillUnmount() {
    this.ux.close(); // ux will tell context it's ok to display tours
  }



  renderNotAStudent() {
    let onDismiss;
    if (Courses.size) { onDismiss = this.goToMyCourses; }
    return (
      <WarningModal
        onDismiss={onDismiss}
        title="Sorry, you can’t access this course"
        message="You are no longer a student in this course. Please contact your instructor if you are still enrolled in this course and need to be re-added."
      />
    );
  }

  render() {
    if (!this.course) { return this.renderNotAStudent(); }

    const { params, params: { courseId } } = this.props;

    // if student is past due BE will raise "forbidden" if we load the dashboard data
    if (this.ux.paymentIsPastDue) { return <CourseNagModal ux={this.ux} />; }

    return (
      <div className="student-dashboard ">
        <TermsModal />
        <CourseNagModal ux={this.ux} />
        <StudentDashboard params={params} courseId={courseId} />
      </div>
    );
  }
}
