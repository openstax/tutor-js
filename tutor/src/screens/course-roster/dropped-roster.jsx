import { React, PropTypes, observer } from 'vendor'
import { Table } from 'react-bootstrap';
import { map, sortBy, isEmpty } from 'lodash';
import { autobind } from 'core-decorators';
import UnDropStudentLink from './undrop-student';
import StudentIdField from './student-id-field';
import { Course } from '../../models';


@observer
export default
class DroppedRoster extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    @autobind
    renderStudentRow(student) {
        return (
            <tr key={student.id}>
                <td>
                    {student.first_name}
                </td>
                <td>
                    {student.last_name}
                </td>
                <td>
                    <StudentIdField student={student} />
                </td>
                <td className="actions">
                    <UnDropStudentLink id={`drop-student-popover-${student.id}`} student={student} />
                </td>
            </tr>
        );
    }

    render() {
        const { dropped } = this.props.course.roster.students;

        if (isEmpty(dropped)) { return null; }

        return (
            <div className="settings-section dropped-students">
                <div>
                    <span className="course-settings-subtitle tabbed">
                        Dropped Students
                    </span>
                </div>
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
                        {map(sortBy(dropped, 'last_name'), this.renderStudentRow)}
                    </tbody>
                </Table>
            </div>
        );
    }
}
