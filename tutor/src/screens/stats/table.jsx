import { React, PropTypes, styled } from 'vendor';
import { Table } from 'react-bootstrap';
import moment from 'moment';

const TableWrapper = styled.div`
  width: 65%;
  margin: auto;
  caption {
    caption-side: top;
    font-weight: bold;
    font-size: 1.6rem;
  }
`;

const DataTable = ({ row }) => {
    const { stats } = row;

    return (
        <TableWrapper>
            <Table striped bordered>
                <caption>
          Week of {moment(row.starts_at).format('dddd, MMMM Do YYYY')}
                </caption>
                <tbody>
                    <tr>
                        <td>Courses</td>
                        <td>{stats.new_courses}</td>
                    </tr>
                    <tr>
                        <td>Instructors/Students</td>
                        <td>{stats.new_instructors}/{stats.new_students}</td>
                    </tr>
                    <tr>
                        <td>Assignments: Reading/HW</td>
                        <td>{stats.reading_task_plans}/{stats.homework_task_plans}</td>
                    </tr>
                    <tr>
                        <td>Task Steps: Reading/HW/Practice</td>
                        <td>{stats.reading_steps}/{stats.exercise_steps}/{stats.practice_steps}</td>
                    </tr>
                    <tr>
                        <td>Highlights/Notes</td>
                        <td>{stats.new_highlights}/{stats.new_notes}</td>
                    </tr>
                    <tr>
                        <td>Nudges: Submitted/Retried/Corrected</td>
                        <td>{stats.nudge_calculated}/{stats.nudge_initially_invalid}{stats.nudge_retry_correct}</td>
                    </tr>
                </tbody>
            </Table>
        </TableWrapper>
    );
};


DataTable.propTypes = {
    row: PropTypes.object.isRequired,
};

export default DataTable;
