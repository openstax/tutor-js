import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { isEmpty, sortBy } from 'lodash';
import { Table } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import ChangePeriodLink from './change-period';
import DropStudentLink from './drop-student';
import CourseGroupingLabel from '../course-grouping-label';
import StudentIdField from './student-id-field';
import Period from '../../models/course/period';

@observer
export default
class PeriodRoster extends React.Component {

  static propTypes = {
      period: PropTypes.instanceOf(Period).isRequired,
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
      return (
          <div className="roster-empty-info">
        Use the "Get Student Enrollment Code" link above to get the code for
        this <CourseGroupingLabel lowercase={true} courseId={course.id} /> of your course.
        As your students login to Concept Coach, they will start appearing here.
        You will be able to drop students or change
        their <CourseGroupingLabel lowercase={true} plural={true} courseId={course.id} /> from
        this page.
          </div>
      );
  }

  render() {
      const course = this.props.period.course;
      const students = course.roster.students.activeByPeriod[this.props.period.id];

      if (isEmpty(students)) { return this.renderEmpty(course); }

      return (
          <Table
              striped={true}
              bordered={true}
              size="sm"
              hover={true}
              className="roster">
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
