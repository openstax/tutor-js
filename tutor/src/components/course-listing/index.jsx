import _ from 'lodash';
import React from 'react';
import BS from 'react-bootstrap';
import { Redirect } from 'react-router';

import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Router from '../../helpers/router';

import Courses from '../../models/courses-map';

//import { CourseListingStore } from '../../flux/course-listing';
import { CurrentUserStore } from '../../flux/current-user';

// import { Course, CourseTeacher } from './course';
import EmptyCourses from './empty';
import { CourseListingPast, CourseListingCurrent } from './listings';

@observer
export default class CourseListing extends React.PureComponent {

  @computed get shouldRedirect() {
    return (
      !CurrentUserStore.isTeacher() &&
      (Courses.currentAndFuture.length === 1) &&
      (Courses.past.length === 0)
    );
  }

  render() {
    if (!Courses.size()) { return <EmptyCourses /> }

    if (this.shouldRedirect) {
      return (
        <Redirect to={Router.makePathname('dashboard', { courseId: current[0].id })} />
      );
    }

    return (
      <div className="course-listing">
        <CourseListingCurrent courses={Courses.currentAndFuture} />
        <CourseListingPast courses={Courses.past} />
      </div>
    );
  }

}
