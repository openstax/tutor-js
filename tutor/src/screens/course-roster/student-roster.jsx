import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { isEmpty, sortBy } from 'lodash';
import { Table } from 'react-bootstrap';
import TutorLink from '../../components/link';
import { autobind } from 'core-decorators';
import ChangePeriodLink from './change-period';
import DropStudentLink from './drop-student';
import CourseGroupingLabel from '../../components/course-grouping-label';
import NoStudentsMessage from '../../components/no-students-message';
import StudentIdField from './student-id-field';
import Period from '../../models/course/period';
import LoadingScreen from 'shared/components/loading-animation';

export default
@observer
class StudentsRoster extends React.Component {

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
        <td className="student-id-column">
          <StudentIdField student={student} course={course} />
        </td>
        <td className="actions">
          <ChangePeriodLink period={this.props.period} student={student} />
          <DropStudentLink student={student} />
        </td>
      </tr>
    );
  }

  render() {
    const course = this.props.period.course;
    const students = course.roster.students.activeByPeriod[this.props.period.id];

    if (!course.roster.api.hasBeenFetched){
      return <LoadingScreen message="Loading Roster…" />;
    }
    if (isEmpty(students)) {
      return (
        <div className="roster-empty-info">
          <NoStudentsMessage courseId={course.id}/>
        </div>
      ); 
    }

    return (
      <Table
        striped={true}
        bordered={true}
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
