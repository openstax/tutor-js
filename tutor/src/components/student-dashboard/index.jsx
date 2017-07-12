import React from 'react';

import { StudentDashboardStore, StudentDashboardActions } from '../../flux/student-dashboard';
import LoadableItem from '../loadable-item';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import StudentDashboard from './dashboard';
import CourseNagModal from '../onboarding/course-nag';
import TermsModal from '../terms-modal';
import onboardingForCourse from '../../models/course/onboarding';
import Courses from '../../models/courses-map';

@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
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

  ux = onboardingForCourse(this.course, this.props.tourContext);

  componentWillUnmount() {
    this.ux.close();
  }

  render() {
    const { params, params: { courseId } } = this.props;

    return (
      <div className="student-dashboard ">
        <TermsModal />
        <CourseNagModal ux={this.ux} />
        <LoadableItem
          id={courseId}
          store={StudentDashboardStore}
          actions={StudentDashboardActions}
          renderItem={() => <StudentDashboard params={params} courseId={courseId} />}
        />
      </div>
    );
  }
}
