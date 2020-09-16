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
import { breakpoint } from 'theme';
import { MobilePaymentBar } from './navbar/student-payment-bar';

const StyledLayout = styled.div`
  min-height: 100vh;

  ${breakpoint.desktop`
   &&& .tutor-navbar {
      padding-left: ${breakpoint.margins.tablet};
      padding-right: ${breakpoint.margins.tablet};
    }
  `}

  ${breakpoint.tablet`
    &&& .tutor-navbar {
      padding-left: ${breakpoint.margins.tablet};
      padding-right: ${breakpoint.margins.tablet};
      .control-label { display: none; }
      .dropdown-toggle .ox-icon { margin-left: 1rem; }
      .user-menu {
        margin-right: -0.75rem;
        .initials {
          height: 22px;
          width: 22px;
          font-size: 0.9rem;
          letter-spacing: -1px;
        }
      }
      .right-side-controls > * {
        margin-left: 0;
        &:last-child {
          margin-left: 1rem;
        }
      }
    }
  `}

  ${breakpoint.mobile`
    &&& .tutor-navbar {
      padding-left: ${breakpoint.margins.mobile};
      padding-right: ${breakpoint.margins.mobile};
    }
    .my-courses &&& .tutor-navbar, .dashboard &&& .tutor-navbar {
      padding-left: calc(${breakpoint.margins.mobile} * 2);
      padding-right: calc(${breakpoint.margins.mobile} * 2);
    }

    #mobile-menu {
      margin-right: calc(-${breakpoint.margins.mobile} * 2 - 2px);
    }
  `}

  ${props => !props.hasNavbar && breakpoint.only.mobile`
    .tutor-navbar {
      display: none;
    }
  `}
`;

const Content = styled.div`
  padding-top: ${Theme.navbars.top.height};
  padding-bottom: ${props => props.hasFooter ? Theme.navbars.bottom.height : 0};
  .mobile-payment-bar + & {
    padding-top: calc(${Theme.navbars.top.height}*2);
  }
  ${props => !props.hasNavbar && Theme.breakpoint.only.mobile`
    padding: 0;
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

  isViewingTaskStep() {
    const routerName = get(Router.currentMatch(), 'entry.name', '');
    return routerName === 'viewTaskStep';
  }

  isViewingCourseDashboard() {
    const routerName = get(Router.currentMatch(), 'entry.name', '');
    return routerName === 'dashboard';
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
        {
          /**
           * Hide the navbar if user is in the 'viewTaskStep' screen.
           * Use styled-components to check if the screen is mobile width.
           */
        }
        <StyledLayout hasNavbar={!this.isViewingTaskStep()}>
          <Navbar
            area="header"
            context={this.topNavbarContext}
            isDocked={Boolean(this.secondaryTopControls)}
          />
          {this.secondaryTopControls &&
            <SecondaryToolbar
              controls={this.secondaryTopControls}
            />}
          {
          /**
           * Hide the mobile payment bar in every screen except the dashboard
           */
          }
          {this.isViewingCourseDashboard() && <MobilePaymentBar course={course} />}
          <ErrorMonitoring />
          <TermsModal />
          <Toasts />
          <CourseNagModal
            key={course || 'no-course'}
            course={course}
          />
          <Content hasFooter={!this.bottomNavbarContext.isEmpty} hasNavbar={!this.isViewingTaskStep()}>
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
