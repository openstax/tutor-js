import _ from 'lodash';
import React from 'react';
import BS from 'react-bootstrap';
import { Redirect } from 'react-router';

import Router from '../../helpers/router';


import { CourseListingStore } from '../../flux/course-listing';
import { CurrentUserStore } from '../../flux/current-user';

import { Course, CourseTeacher } from './course';
import EmptyCourses from './empty';
import { CourseListingPast, CourseListingCurrent } from './listings';

const CourseListing = React.createClass({
  displayName: 'CourseListing',

  contextTypes: {
    router: React.PropTypes.object,
  },

  shouldRedirect(past, current) {
    return (
        !CurrentUserStore.isTeacher() &&
          (current.length === 1) &&
          (past.length === 0)
    );
  },

  shouldShowEmpty(past, current) {
    return (
        _.isEmpty(past) && _.isEmpty(current)
    ); // and some way to determine if student?!
  },

  render() {
    const [past, current] = Array.from(CourseListingStore.coursesOrderedByStatus());

    if (this.shouldShowEmpty(past, current)) {
      return (
        <EmptyCourses />
      );
    } else if (this.shouldRedirect(past, current)) {
      return (
        <Redirect to={Router.makePathname('dashboard', { courseId: current[0].id })} />
      );
    } else {
      return (
          (
            <div className="course-listing">
              <CourseListingCurrent courses={current} />
              <CourseListingPast courses={past} />
            </div>
          )
      );
    }
  },
});


export default CourseListing;
