import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { Navbar, Nav } from 'react-bootstrap';
import { Provider, inject, observer, observable, action, computed } from '../../helpers/react';
import CourseNagModal        from './course-nag';
import TermsModal            from '../../components/terms-modal';
import Courses               from '../../models/courses-map';
import Toasts                from 'shared/components/toasts';
import Router                from '../../helpers/router';
import TutorLink             from '../link';
import ServerErrorMonitoring from '../error-monitoring';
import ActionsMenu           from './actions-menu';
import UserMenu              from './user-menu';
import BookLinks             from './book-links';
import CenterControls        from './center-controls';
import PreviewAddCourseBtn   from './preview-add-course-btn';
import SupportMenu           from './support-menu';
import StudentPayNowBtn      from './student-pay-now-btn';
import PlugableNavBar        from './plugable';
import NavbarContext         from './context';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
class DefaultNavBar extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }).isRequired,
    tourContext: PropTypes.object,
  }

  @computed get course() {
    const { params: { courseId } } = this.props;
    return courseId ? Courses.get(courseId) : null;
  }

  render() {
    const { course, props: { params, params: { courseId } } } = this;

    return (
      <Navbar>
        <Nav className="tutor-top-navbar">
          <div className="tutor-nav-controls">
            <div className="left-side-controls">
              <TutorLink to="myCourses" className="brand" aria-label="dashboard">
                <i className="ui-brand-logo" />
              </TutorLink>
              <BookLinks courseId={courseId} />
            </div>
            <CenterControls params={params} />
            <div className="right-side-controls">
              <SupportMenu         course={course} />
              <StudentPayNowBtn    course={course} />
              <ActionsMenu         course={course} />
              <PreviewAddCourseBtn course={course} />
              <UserMenu />
            </div>
          </div>
          <ServerErrorMonitoring />
          <TermsModal canBeDisplayed={Boolean(courseId)} />
          <Toasts />
          <CourseNagModal
            key={this.course || 'no-course'}
            course={this.course} />
        </Nav>
      </Navbar>
    );
  }

}

const NavBarTypes = {
  Plugable: PlugableNavBar,
  Default: DefaultNavBar,
};

class NavBarContextProvider extends React.Component {

  navBarContext = new NavbarContext();

  render() {
    return (
      <Provider navBar={this.navBarContext}>
        {this.props.children}
      </Provider>
    );
  }

}

export default {
  context: NavBarContextProvider,
  bar() {
    const settings = get(Router.currentMatch(), 'entry.settings');
    const params = Router.currentParams();
    const NavbarComponent = NavBarTypes[get(settings, 'navBar', 'Default')];
    return <NavbarComponent params={params} />;
  },
};
