import { React, PropTypes, observer } from 'vendor';
import { Dropdown } from 'react-bootstrap';
import TourAnchor from '../tours/anchor';
import Course from '../../models/course';
import User from '../../models/user';
import CourseInformation from '../../models/course/information';

export default
@observer
class SupportDocumentLink extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
  }

  get role() {
    const { course } = this.props;
    if (course) {
      if (course.currentRole.isTeacherStudent) {
        return 'student';
      }
      return course.currentRole.type;
    }
    return User.isProbablyTeacher ? 'teacher' : 'student';
  }

  render() {
    const url = CourseInformation.gettingStartedGuide[this.role];

    return (
      <Dropdown.Item
        className="support-document-link"
        target="_blank"
        href={url}
      >
        <TourAnchor id="menu-support-document">
          Getting Started Guide
        </TourAnchor>
      </Dropdown.Item>
    );
  }

}
