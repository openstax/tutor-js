import React from 'react';

import Courses from '../../models/courses-map';

import CCEnrollmentCode from './cc-enrollment-code';
import StudentEnrollmentLink from './student-enrollment-link';

export default class StudentEnrollment extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    period: React.PropTypes.object,
  }

  render() {
    if (!this.props.period) { return null; }
    const course = Courses.get(this.props.courseId);
    if (course.is_concept_coach) {
      return (
        <CCEnrollmentCode
          courseId={this.props.courseId}
          period={this.props.period}
          bookUrl={course.webview_url}
          bookName={course.salesforce_book_name} />
      );
    }
    return (
        <StudentEnrollmentLink period={this.props.period} course={course} />
    );
  }

}
