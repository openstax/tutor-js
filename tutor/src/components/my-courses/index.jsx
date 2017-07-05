import React from 'react';
import { Redirect } from 'react-router';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import User from '../../models/user';
import Router from '../../helpers/router';
import Courses from '../../models/courses-map';
import EmptyCourses from './empty';
import TourRegion from '../tours/region';
import PendingVerification from './pending-verification';

import { MyCoursesPast, MyCoursesCurrent, MyCoursesPreview } from './listings';

@observer
export default class MyCourses extends React.PureComponent {

  componentWillMount() {
    User.logEvent({ category: 'onboarding', code: 'arrived_my_courses' });
  }

  @computed get firstCourse() {
    return Courses.array[0];
  }

  @computed get shouldRedirect() {
    if (Courses.size !== 1){
      return false;
    }
    return (
      this.firstCourse.isStudent && this.firstCourse.isActive
    );
  }

  render() {
    if (!Courses.size && !User.isConfirmedFaculty) {
      if (User.isUnverifiedInstructor) { return <PendingVerification />; }
      return <EmptyCourses />;
    }

    if (this.shouldRedirect) {
      return (
        <Redirect to={Router.makePathname('dashboard', { courseId: this.firstCourse.id })} />
      );
    }

    return (
      <TourRegion
        id="my-courses"
        otherTours={[
          'my-courses-coach-migrate',
          'my-courses-coach-no-migrate',
          'create-a-course'
        ]}
        className="my-courses"
      >
        <MyCoursesCurrent />
        <MyCoursesPreview />
        <MyCoursesPast    />
      </TourRegion>
    );
  }

}
