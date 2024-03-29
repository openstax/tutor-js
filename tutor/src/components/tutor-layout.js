import {
    React, Provider,
    PropTypes, observer, observable, styled, action, modelize,
} from 'vendor';
import Theme                from '../theme';
import Toasts               from './toasts';
import { Course }           from '../models'
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
import { PreviewCourseSidePanel } from './preview-side-panel';
import { currentToasts } from './toasts';


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


class CourseContext {
    @observable course;
    constructor(c) {
        modelize(this)
        this.course = c;
    }
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

    constructor(props) {
        super(props)
        modelize(this)
    }

    @action.bound setSecondaryTopControls(controls, unpadded = false) {
        this.secondaryTopControls = controls;
        this.secondaryTopControls.unpadded = unpadded;
    }

    @action componentDidUpdate() {
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
                    <Toasts toasts={currentToasts} />
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
