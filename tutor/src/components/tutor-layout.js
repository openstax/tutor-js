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
import CourseNagModal       from './course-nag';
import ErrorMonitoring      from './error-monitoring';
import { NavbarContext }    from './navbar/context';
import { SecondaryToolbar } from './navbar/secondary-toolbar';

const StyledLayout = styled.div`
  min-height: 100vh;
`;

const Content = styled.div`
  padding-top: ${Theme.navbars.top.height};
  padding-bottom: ${Theme.navbars.bottom.height};
`;

class CourseContext {
  @observable course;
  constructor(c) { this.course = c; }
}

@observer
class TutorLayout extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    children: PropTypes.node.isRequired,
  }

  @observable secondaryTopControls;

  courseContext = new CourseContext(this.props.course);
  topNavbarContext = new NavbarContext();
  bottomNavbarContext = new NavbarContext();

  constructor(props) {
    super(props);
    this.topNavbarContext.left.set('logo', () => <Logo />);
    this.topNavbarContext.right.set('menu', () => <Menus />);
  }

  @action.bound setSecondaryTopControls(controls) {
    this.secondaryTopControls = controls;
  }

  componentDidUpdate() {
    this.courseContext.course = this.props.course;
  }

  render() {
    const { course } = this.props;

    return (
      <Provider
        topNavbar={this.topNavbarContext}
        courseContext={this.courseContext}
        bottomNavbar={this.bottomNavbarContext}
        setSecondaryTopControls={this.setSecondaryTopControls}
      >
        <StyledLayout>
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
          <Content>{this.props.children}</Content>
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
