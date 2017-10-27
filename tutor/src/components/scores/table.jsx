import React from 'react';
import { range, isEmpty, sortBy } from 'lodash';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { computed } from 'mobx';
import { Table, Column, ColumnGroup, Cell } from 'fixed-data-table-2';
import { autobind } from 'core-decorators';
import TutorLink from '../link';

import StudentDataSorter from './student-data-sorter';
import SortingHeader from './sorting-header';
import AverageInfo from './average-info';
import AssignmentCell from './assignment-cell';
import AssignmentHeader from './assignment-header';
import NameCell from './name-cell';
import OverallHeader from './overall-header';
import { CourseScoresPeriod } from '../../models/course/scores';

const FIRST_DATA_COLUMN = 2;
const COLUMN_WIDTH = 160;
const MIN_TABLE_WIDTH = 500;
const MIN_TABLE_HEIGHT = 600;

const NameHeader = observer(({ sort, onSort, isConceptCoach }) => (
  <div className="header-cell-wrapper student-names">
    <div className="overall-header-cell" />
    <div className="header-row">
      Class Performance
      <AverageInfo isConceptCoach={isConceptCoach} />
    </div>
    <div className="header-row short">
      <SortingHeader sortKey="name" sortState={sort} onSort={onSort} dataType="name">
        <div className="student-name">
          Name and Student ID
        </div>
      </SortingHeader>
    </div>
  </div>
));


const OverallCell = observer(({ students, rowIndex }) => (
  <Cell className="overall-cell">
    {((students[rowIndex].average_score || 0) * 100).toFixed(0)} %
  </Cell>
));


@observer
export default class ScoresTable extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.instanceOf(CourseScoresPeriod).isRequired,
    sort: React.PropTypes.object.isRequired,
    onSort: React.PropTypes.func.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    displayAs: React.PropTypes.string.isRequired,
    dataType: React.PropTypes.string,
    isConceptCoach: React.PropTypes.bool.isRequired,
  }

  @computed get students() {
    const students = sortBy( this.props.period.students, StudentDataSorter({
      sort: this.props.sort,
      displayAs: this.props.displayAs,
    }));
    return this.props.sort.asc ? students : students.reverse();
  }

  renderNoStudents() {
    return (
      <div className="course-scores-container" ref="tableContainer">
        <div className="no-students">
          <p>
            There are no students enrolled in this section yet, and there are no assignments to
            score.  Manage student access for this section
            in <TutorLink to="settings" params={{ courseId: this.props.period.course.id }}>Settings</TutorLink>.
          </p>
          <TutorLink className="btn btn-default" to="settings" params={{ courseId: this.props.period.course.id }}>Manage student access</TutorLink>
        </div>
      </div>
    );
  }

  renderNoAssignments() {
    return (
      <div className="course-scores-container" ref="tableContainer">
        <div className="no-assignments">
          <p>
            Students have enrolled in this section, but there are no assignments to score.  Add an assignment from your <TutorLink to="dashboard" params={{ courseId: this.props.period.course.id }}>dashboard</TutorLink>.
          </p>
          <TutorLink className="btn btn-default" to="dashboard" params={{ courseId: this.props.period.course.id }}>Back to dashboard</TutorLink>
        </div>
      </div>
    );
  }

  render() {
    const { students, props: { period } } = this;
    const courseId = period.course.id;
    const width = COLUMN_WIDTH;

    if (!period.coursePeriod.num_enrolled_students) { return this.renderNoStudents(); }
    if (isEmpty(students)) { return this.renderNoAssignments(); }

    return (
      <Table
        className="course-scores-table"
        rowHeight={50}
        height={Math.max(this.props.height, MIN_TABLE_WIDTH)}
        width={Math.max(this.props.width, MIN_TABLE_HEIGHT)}
        headerHeight={150}
        rowsCount={students.length}
      >
        <ColumnGroup fixed={true}>
          <Column
            fixed={true}
            width={COLUMN_WIDTH}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable={false}
            cell={<NameCell {...this.props} {...{ students, courseId }} />}
            header={<NameHeader {...this.props} />}
          />
          <Column
            fixed={true}
            width={COLUMN_WIDTH / 2}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable={false}
            cell={<OverallCell students={students} />}
            header={<OverallHeader {...this.props} />}
          />
        </ColumnGroup>
        <ColumnGroup>
          {range(0, period.numAssignments).map((columnIndex) =>
            <Column
              key={columnIndex}
              width={COLUMN_WIDTH}
              flexGrow={0}
              allowCellsRecycling={true}
              cell={<AssignmentCell {...this.props} {...{ students, courseId, width, columnIndex }} />}
              header={<AssignmentHeader {...this.props} {...{ students, courseId, width, columnIndex }} />}
            />)}
        </ColumnGroup>
      </Table>
    );
  }
}
