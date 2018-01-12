import React from 'react';
import { get } from 'lodash';
import { Provider } from 'mobx-react';
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
import BackgroundJobToasts   from './background-toasts';
import ReferenceBookNavBar   from '../reference-book/navbar';
import NavbarContext         from './context';

function DefaultNavBar({ params }) {
  const { courseId } = params;
  return (
    <nav className="tutor-top-navbar">
      <div className="tutor-nav-controls">
        <div className="left-side-controls">
          <TutorLink to="myCourses" className="brand">
            <i className="ui-brand-logo" />
          </TutorLink>
          <BookLinks courseId={courseId} />
        </div>
        <CenterControls params={params} />
        <div className="right-side-controls">
          <SupportMenu         courseId={courseId} />
          <StudentPayNowBtn    courseId={courseId} />
          <ActionsMenu         courseId={courseId} />
          <PreviewAddCourseBtn courseId={courseId} />
          <UserMenu />
        </div>
      </div>
      <ServerErrorMonitoring />
      <BackgroundJobToasts />
    </nav>
  );
}

const NavBarTypes = {
  ReferenceBook: ReferenceBookNavBar,
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
