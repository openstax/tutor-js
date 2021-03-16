import {
    React, Provider,
    PropTypes, observer, observable, styled, action,
} from 'vendor';
import Theme                from '../theme';
import Toasts               from 'shared/components/toasts';
import Courses, { Course }  from '../models/courses-map';
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
import GoToTop from './go-to-top';
import SidePanel from './side-panel';
import TutorLink from './link';


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
  &.viewQuestionsLibrary {
    padding-top: 0;
  }
`;

const PreviewCourseSidePanel = ({ course }) => {
    if (!course ||
        !course.is_preview ||
        !course.currentRole.isTeacher ||
        !course.appearanceCode ||
        !Courses.nonPreview.where(c => c.offering_id == course.offering_id).isEmpty
    ) {
        return null
    }

    return (
        <SidePanel ignorePathIncludes={'t/month'}>
            <h3>Ready to begin?</h3>
            <p>Creating a course is the first step towards managing your class assignments.</p>
            <TutorLink
                className="btn btn-primary"
                to="createNewCourseFromOffering"
                params={{ offeringId: course.offering_id }}
                data-test-id="preview-panel-create-course"
            >
            Create a course
            </TutorLink>
        </SidePanel>
    )
}

PreviewCourseSidePanel.propTypes = {
    course: PropTypes.instanceOf(Course),
}

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

  getRouterName() {
      return get(Router.currentMatch(), 'entry.name', '');
  }

  isViewingTaskStep() {
      const routerName = this.getRouterName();
      return routerName === 'viewTaskStep';
  }

  isViewingCourseDashboard() {
      const routerName = this.getRouterName();
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
                      className={this.getRouterName()}
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
                  <Content
                      // adding the router name as a class so we can override the content css based on the screen
                      className={this.getRouterName()}
                      hasFooter={!this.bottomNavbarContext.isEmpty}
                      hasNavbar={!this.isViewingTaskStep()}>
                      <ImpersonationWarning app={app} />
                      {this.props.children}
                      {course && course.currentRole.isTeacher && <GoToTop />}
                      <PreviewCourseSidePanel course={course} />
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
