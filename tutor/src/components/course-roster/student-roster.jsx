import React from 'react';
import { observer } from 'mobx-react';
import { isEmpty, sortBy } from 'lodash';
import { Table } from 'react-bootstrap';
import TutorLink from '../link';
import { autobind } from 'core-decorators';
import ChangePeriodLink from './change-period';
import DropStudentLink from './drop-student';
import CourseGroupingLabel from '../course-grouping-label';
import StudentIdField from './student-id-field';
import Period from '../../models/course/period';


@observer
export default class StudentsRoster extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.instanceOf(Period).isRequired,
  }

  @autobind
  renderStudentRow(student) {
    const course = this.props.period.course;

    return (
      <tr key={student.id}>
        <td>
          {student.first_name}
        </td>
        <td>
          {student.last_name}
        </td>
        <td>
          <StudentIdField student={student} course={course} />
        </td>
        <td className="actions">
          <ChangePeriodLink period={this.props.period} student={student} />
          <DropStudentLink student={student} />
        </td>
      </tr>
    );
  }

  renderEmpty(course) {
    const courseId = course.id;
    return (
      <div className="roster-empty-info">
        <p>
          No students have enrolled in
          this <CourseGroupingLabel lowercase courseId={courseId} /> yet. Manage student access
          in <TutorLink to="settings" params={{ courseId: courseId }}>Settings</TutorLink>.
        </p>
        <TutorLink className="btn btn-default" to="settings" params={{ courseId: this.props.period.course.id }}>Manage student access</TutorLink>
      </div>
    );
  }

  render() {
    const course = this.props.period.course;

    const students = course.roster.studentsForPeriod(this.props.period);

    if (isEmpty(students)) { return this.renderEmpty(course); }

    return (
      <Table
        striped={true}
        bordered={true}
        condensed={true}
        hover={true}
        className="roster students"
      >
        <thead>
          <tr>
            <th>
              First Name
            </th>
            <th>
              Last Name
            </th>
            <th className="student-id">
              Student ID
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortBy(students, 'last_name').map(this.renderStudentRow)}
        </tbody>
      </Table>
    );
  }
}
