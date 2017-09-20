import React from 'react';

import Name from '../name';
import classnames from 'classnames';
import TutorLink from '../link';
const TOOLTIP_OPTIONS = { enable: true, placement: 'top', delayShow: 1500, delayHide: 150 };

export default class NameCell extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    isConceptCoach: React.PropTypes.bool.isRequired,
    className: React.PropTypes.string,
    student: React.PropTypes.shape({
      first_name: React.PropTypes.string,
      last_name: React.PropTypes.string,
      role: React.PropTypes.oneOfType([
        React.PropTypes.number, React.PropTypes.string,
      ]),
      student_identifier: React.PropTypes.string,
    }).isRequired,
  }

  render() {
    const children = [
      <Name
        key="name"
        tooltip={TOOLTIP_OPTIONS}
        className="student-name"
        {...this.props.student} />,
      <span key="id" className="student-id">
        {this.props.student.student_identifier}
      </span>,
    ];
    const classname = classnames('name-cell', this.props.className);

    if (this.props.isConceptCoach) { return <div className={classname}>{children}</div>; }

    return (
      <TutorLink
        to="viewPerformanceGuide"
        className={classname}
        params={{ roleId: this.props.student.role, courseId: this.props.courseId }}>
        {children}
      </TutorLink>
    );
  }
}
