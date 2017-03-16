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
      <Navbar
        fixedTop={true}
        fluid={true}
        ref={nb => (this.navBar = nb)}
      >
        <Navbar.Header>
          <Navbar.Brand>
            <TutorLink to="listing" className="navbar-brand">
              <i className="ui-brand-logo" />
            </TutorLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <CenterControls params={params} />
        <Navbar.Collapse>
          <Nav>
            <CourseName course={course} />
            <BookLinks courseId={courseId} onItemClick={this.collapseNav} />
          </Nav>
          <Nav pullRight={true}>
            <ToursReplay />
            <UserActionsMenu
              courseId={courseId}
              course={course}
              onItemClick={this.collapseNav}
            />
          </Nav>
        </Navbar.Collapse>
        <ServerErrorMonitoring />
      </Navbar>
    );
  }
}
