import PropTypes from 'prop-types';
import { React, observable, withRouter, action, inject, observer, cn } from 'vendor';
import ReferenceBook from './reference-book';
import UX from './ux';
import { NavbarContext } from '../../components/navbar/context';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import './styles.scss';

@withRouter
@inject('topNavbar', 'tourContext')
@observer
export default
class ReferenceBookShell extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      chapterSection: PropTypes.string,
    }).isRequired,
    ux: PropTypes.object,
    topNavbar: PropTypes.instanceOf(NavbarContext).isRequired,
    tourContext: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  @observable ux;

  @action componentDidMount() {
    this.ux = this.props.ux || new UX(this.props.history, this.props.tourContext);
    this.ux.update(this.props.params);
    this.ux.setNavBar(this.props.topNavbar);
  }

  componentWillUnmount() {
    this.ux.clearNavBar(this.props.topNavbar);
    this.ux.unmount();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.ux.update(nextProps.params);
  }

  render() {
    const { ux } = this;
    if (!ux) { return null; }
    if (!ux.course) { return <CourseNotFoundWarning />; }
    return (
      <ReferenceBook
        ux={ux}
        className={cn({ 'is-teacher': this.ux.isShowingTeacherContent })}
      />
    );
  }

}
