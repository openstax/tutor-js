import React from 'react';
import ReactDOM from 'react-dom';

import { Navbar, Nav } from 'react-bootstrap';
import Router from '../../helpers/router';
import ToursReplay from './tours-replay';
import CourseName from './course-name';
import ServerErrorMonitoring from '../error-monitoring';
import UserActionsMenu from './user-actions-menu';
import BookLinks from './book-links';
import CenterControls from './center-controls';
import TutorLink from '../link';

import { CourseStore } from '../../flux/course';
import PreviewAddCourseBtn from './preview-add-course-btn';
import { action } from 'mobx';

export default class NavigationBar extends React.PureComponent {

  @action.bound
  collapseNav() {
    const navBar = ReactDOM.findDOMNode(this.navBar);
    const collapsibleNav = navBar.querySelector('div.navbar-collapse');
    const toggleBtn = navBar.querySelector('button.navbar-toggle');
    if (collapsibleNav.classList.contains('in')) { toggleBtn.click(); }
  }

  render() {
    const params = Router.currentParams();
    const { courseId } = params;
    const course = courseId ? CourseStore.get(courseId) : null;

    return (
      <div
        className="tutor-top-navbar"
        ref={nb => (this.navBar = nb)}
      >

        <TutorLink to="listing" className="brand">
          <i className="ui-brand-logo" />
        </TutorLink>


        <CenterControls params={params} />

        <div className="right-side-controls">

          <CourseName course={course} />
          <BookLinks courseId={courseId} onItemClick={this.collapseNav} />

          <PreviewAddCourseBtn courseId={courseId} />
          <ToursReplay />
          <UserActionsMenu
            courseId={courseId}
            course={course}
            onItemClick={this.collapseNav}
          />

        </div>

        <ServerErrorMonitoring />
      </div>
    );
  }
}
