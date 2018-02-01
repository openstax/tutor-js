import React from 'react';
import { MenuItem } from 'react-bootstrap';
import { observer } from 'mobx-react';
import TourAnchor from '../tours/anchor';
import Courses from '../../models/courses-map';
import CourseInformation from '../../models/course/information';

@observer
export default class SupportDocumentLink extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string,
  }

  render() {
    const { courseId, ...props } = this.props;
    const course = Courses.get(courseId);
    if (!course) { return null; }

    let url, name;
    if (!course || course.isStudent) {
      url = CourseInformation.studentGettingStartedURL;
      name = 'Getting Started Guide';
    } else {
      url = course.bestPracticesDocumentURL;
      name = 'Best Practices Guide';
    }

    if (!url) { return null; }

    return (
      <MenuItem
        className="support-document-link"
        target="_blank"
        href={url}
        {...props}
      >
        <TourAnchor id="menu-support-document">
          {name}
        </TourAnchor>
      </MenuItem>
    );
  }

}
