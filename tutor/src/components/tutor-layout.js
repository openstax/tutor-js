import {
  React, Provider,
  PropTypes, observer, observable, styled, action,
} from 'vendor';
import Theme                from '../theme';
import Toasts               from 'shared/components/toasts';
import Course               from '../models/course';
import { Logo }             from './navbar/logo';
import { Menus }            from './navbar/menus';
import TermsModal           from './terms-modal';
import { Navbar }           from './navbar.js';
import ImpersonationWarning from './impersonation-warning';
import CourseNagModal       from './course-nag';
import ErrorMonitoring      from './error-monitoring';
import { NavbarContext }    from './navbar/context';
import { SecondaryToolbar } from './navbar/secondary-toolbar';
import Router from '../helpers/router';
import { get } from 'lodash';

const StyledLayout = styled.div`
  min-height: 100vh;

  ${props => !props.hasNavbar && Theme.breakpoint.only.mobile`
    .tutor-navbar {
      display: none;
    }
  `}
`;

const Content = styled.div`
  padding-top: ${Theme.navbars.top.height};
  padding-bottom: ${props => props.hasFooter ? Theme.navbars.bottom.height : 0};

  ${props => !props.hasNavbar && Theme.breakpoint.only.mobile`
    padding-top: 0;
  `}
`;

class CourseContext {
  @observable course;
  constructor(c) { this.course = c; }
}

@observer
class TutorLayout extends React.Component {

  static propTypes = {
    app: PropTypes.object,
    course: PropTypes.instanceOf(Course),
    children: PropTypes.node.isRequired,
  }

  @observable secondaryTopControls;

  courseContext = new CourseContext(this.props.course);
  topNavbarContext = new NavbarContext(function() {
    this.left.set('logo', () => <Logo />);
    this.right.set('menu', () => <Menus />);
  });
  bottomNavbarContext = new NavbarContext();

  @action.bound setSecondaryTopControls(controls) {
    this.secondaryTopControls = controls;
  }

  componentDidUpdate() {
    this.courseContext.course = this.props.course;
  }

  /**
   * Hide the navbar if user is in the 'viewTaskStep' screen.
   * Use styled-components to check if the screen is mobile width.
   */
  shouldHideNavbar() {
    const routerName = get(Router.currentMatch(), 'entry.name', '');
    if(routerName === 'viewTaskStep') return true;
    return false;
  }

  render() {
    const { app, course } = this.props;
    return (
      <Provider
        topNavbar={this.topNavbarContext}
        courseContext={this.courseContext}
        bottomNavbar={this.bottomNavbarContext}
        setSecondaryTopControls={this.setSecondaryTopControls}
      >
        <StyledLayout hasNavbar={!this.shouldHideNavbar()}>
          <Navbar
            area="header"
            context={this.topNavbarContext}
            isDocked={Boolean(this.secondaryTopControls)}
          />
          {this.secondaryTopControls &&
            <SecondaryToolbar
              controls={this.secondaryTopControls}
            />}
          <ErrorMonitoring />
          <TermsModal />
          <Toasts />
          <CourseNagModal
            key={course || 'no-course'}
            course={course}
          />
          <Content hasFooter={!this.bottomNavbarContext.isEmpty} hasNavbar={!this.shouldHideNavbar()}>
            <ImpersonationWarning app={app} />
            {this.props.children}
          </Content>
          <Navbar
            area="footer"
            context={this.bottomNavbarContext}
          />
        </StyledLayout>
      </Provider>
    );
  }

}


export { TutorLayout };
