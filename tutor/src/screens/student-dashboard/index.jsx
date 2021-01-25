import { React, PropTypes, computed, observer, inject } from 'vendor';
import { ScrollToTop } from 'shared';
import StudentDashboard from './dashboard';
import Courses from '../../models/courses';
import User from '../../models/user';
import LoadingScreen from 'shared/components/loading-animation';
import { CourseNotFoundWarning } from '../../components/course-not-found-warning';
import './styles.scss';

export default
@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
class StudentDashboardShell extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string,
    }).isRequired,
    tourContext: PropTypes.object,
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }


  componentDidMount() {
    if (this.course) {
      const student = this.course.userStudentRecord;
      if (student && !student.mustPayImmediately) {
        this.course.studentTaskPlans.startFetching();
      }
    }
  }

  componentWillUnmount() {
    if (this.course) {
      this.course.studentTaskPlans.stopFetching();
    }
  }

  render() {
    // keep rendering loading screen if the user needs to agree to terms
    // this way the screen stays the same without a flash of other content
    if (User.shouldSignTerms) {
      return <LoadingScreen />;
    }

    if (!this.course) { return <CourseNotFoundWarning />; }

    return (
      <ScrollToTop>
        <StudentDashboard params={this.props.params} course={this.course} />
      </ScrollToTop>
    );
  }

}
