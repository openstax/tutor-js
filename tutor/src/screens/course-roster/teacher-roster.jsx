import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import { observer } from 'mobx-react';
import RemoveTeacherLink from './remove-teacher';
import AddTeacherLink from './add-teacher-link';
import { Course } from '../../models';

@observer
export default
class TeacherRoster extends React.Component {

    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    @autobind renderRow(teacher) {
        return (
            <tr key={teacher.id}
                data-is-self={teacher.role_id == this.props.course.primaryRole.id}
                data-teacher-id={teacher.role_id}
            >
                <td>
                    {teacher.first_name}
                </td>
                <td>
                    {teacher.last_name}
                </td>
                <td className="actions">
                    <RemoveTeacherLink
                        course={this.props.course}
                        teacher={teacher}
                    />
                </td>
            </tr>
        );
    }

    render() {
        const { course, course: { roster } } = this.props;
        return (
            <div className="teachers-table">
                <div className="heading">
                    <span className="course-settings-subtitle">
            Instructors
                    </span>
                    <AddTeacherLink course={course} />
                </div>
                <Table
                    striped={true}
                    bordered={true}
                    hover={true}
                    className="roster"
                >
                    <thead>
                        <tr>
                            <th>
                First Name
                            </th>
                            <th>
                Last Name
                            </th>
                            <th>
                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.teachers.active.map(this.renderRow)}
                    </tbody>
                </Table>
            </div>
        );
    }
}
