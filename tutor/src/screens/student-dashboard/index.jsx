import React from 'react';

import { observable, computed, action, observe } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';
import StudentDashboard from './dashboard';

import onboardingForCourse from '../../models/course/onboarding';
import Courses from '../../models/courses-map';
import WarningModal from '../../components/warning-modal';
import './styles.scss';

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

    return (
      <StudentDashboard params={this.props.params} course={this.course} />
    );
  }
}
