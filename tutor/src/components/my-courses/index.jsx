import React from 'react';
import { Redirect } from 'react-router-dom';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import User from '../../models/user';
import Router from '../../helpers/router';
import Courses from '../../models/courses-map';
import EmptyCourses from './empty';
import TourRegion from '../tours/region';
import PendingVerification from './pending-verification';
import NonAllowedTeacher from './non-allowed-teacher';
import { MyCoursesPast, MyCoursesCurrent, MyCoursesPreview } from './listings';

export default
@observer
class MyCourses extends React.Component {

  componentDidMount() {
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
      this.firstCourse.currentRole.isStudent && this.firstCourse.isActive
    );
  }

  render() {
    if (Courses.isEmpty) {
      if (User.isConfirmedFaculty) {
        if (!User.canCreateCourses) {
          return <NonAllowedTeacher />;
        }
      } else {
        return User.isUnverifiedInstructor? <PendingVerification /> : <EmptyCourses />;
      }
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
          'create-a-course',
          'my-courses-coach-no-migrate',
          'explore-a-preview', // this must come last, there's no dismiss btn
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
