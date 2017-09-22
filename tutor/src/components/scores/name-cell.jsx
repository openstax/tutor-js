import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import Name from '../name';
import TutorLink from '../link';
const TOOLTIP_OPTIONS = { enable: true, placement: 'top', delayShow: 1500, delayHide: 150 };

@observer
export default class NameCell extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    isConceptCoach: React.PropTypes.bool.isRequired,
    className: React.PropTypes.string,
    students: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number,
  }

  render() {
    const student = this.props.students[this.props.rowIndex || 0];

    const children = [
      <Name
        key="name"
        tooltip={TOOLTIP_OPTIONS}
        className="student-name"
        {...student} />,
      <span key="id" className="student-id">
        {student.student_identifier}
      </span>,
    ];
    const classname = classnames('name-cell', this.props.className);
    if (this.props.isConceptCoach) { return <div className={classname}>{children}</div>; }


    return (
      <div className="name-cell-wrapper">
        <TutorLink
          to="viewPerformanceGuide"
          className={classname}
          params={{ roleId: student.role, courseId: this.props.courseId }}>
          {children}
        </TutorLink>
        <div className="overall-cell">
          {(student.average_score != null) ? `${(student.average_score * 100).toFixed(0)}%` : undefined}
        </div>
      </div>
    );
  }
}
