import React from 'react';
import { range, isEmpty, sortBy } from 'lodash';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { computed } from 'mobx';
import { Table, Column, ColumnGroup, Cell } from 'fixed-data-table-2';
import { autobind } from 'core-decorators';
import TutorLink from '../../components/link';

import StudentDataSorter from './student-data-sorter';
import SortingHeader from './sorting-header';
import AverageInfo from './average-info';
import AssignmentCell from './assignment-cell';
import AssignmentHeader from './assignment-header';
import NameCell from './name-cell';
import OverallHeader from './overall-header';
import { CourseScoresPeriod } from '../../models/course/scores';
import CGL from '../../components/course-grouping-label';
import OverallCell from './overall-cell';

import UX from './ux';

const FIRST_DATA_COLUMN = 2;

const MIN_TABLE_WIDTH = 500;
const MIN_TABLE_HEIGHT = 600;

const NameHeader = observer(({ sort, onSort, isConceptCoach }) => (
  <div className="header-cell-wrapper student-names">
    <div className="header-row overview-row">
      <SortingHeader sortKey="name" sortState={sort} onSort={onSort} dataType="name">
        <span>Overall</span>
      </SortingHeader>
    </div>
  </div>
));


@observer
export default class ScoresTable extends React.PureComponent {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
    sort: React.PropTypes.object.isRequired,
    onSort: React.PropTypes.func.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    displayAs: React.PropTypes.string.isRequired,
    dataType: React.PropTypes.string,
    isConceptCoach: React.PropTypes.bool.isRequired,
  }


  @computed get students() {
    const students = sortBy( this.props.ux.period.students, StudentDataSorter({
      sort: this.props.sort,
      displayAs: this.props.displayAs,
    }));
    return this.props.sort.asc ? students : students.reverse();
  }

  get courseId() {
    return this.props.ux.period.course.id;
  }

  renderNoStudents() {
    return (
      <div className="course-scores-container" ref="tableContainer">
        <div className="no-students">
          <p>
            There are no students enrolled in this section yet.  Manage student access for this section
            in <TutorLink to="settings" params={{ courseId: this.courseId }}>Course settings</TutorLink>.
          </p>
          <TutorLink primaryBtn to="settings" params={{ courseId: this.courseId }}>Manage student access</TutorLink>
        </div>
      </div>
    );
  }

  renderNoAssignments() {
    return (
      <div className="course-scores-container" ref="tableContainer">
        <div className="no-assignments">
          <p>
            Students have enrolled in this <CGL lowercase courseId={this.courseId} />, but there are no assignments to score.  Add an assignment from your <TutorLink to="dashboard" params={{ courseId: this.courseId }}>dashboard</TutorLink>.
          </p>
          <TutorLink primaryBtn to="dashboard" params={{ courseId: this.courseId }}>Back to dashboard</TutorLink>
        </div>
      </div>
    );
  }

  renderLeftColumnGroup() {
    const { ux, courseId, students, props: { period } } = this;

    if (!period.course.isTeacher) {
      return (
        <ColumnGroup fixed={true}>
          <Column
            fixed={true}
            width={ux.averagesWidth}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable={false}
            cell={<OverallCell ux={ux} students={students} />}
            header={<OverallHeader ux={ux} {...this.props} />}
          />
        </ColumnGroup>
      );
    }

    return (
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
          width={ux.averagesWidth}
          flexGrow={0}
          allowCellsRecycling={true}
          isResizable={false}
          cell={<OverallCell ux={ux} students={students} />}
          header={<OverallHeader ux={ux} {...this.props} />}
        />
      </ColumnGroup>
    );
  }

  render() {
    const { courseId, students, props: { ux, ux: { COLUMN_WIDTH, period } } } = this;
    let headerHeight = 140;

    if (!period.coursePeriod.num_enrolled_students) { return this.renderNoStudents(); }
    if (isEmpty(students)) { return this.renderNoAssignments(); }
    if (period.course.isTeacher) {
      headerHeight = 180;
    }

    return (
      <Table
        className="course-scores-table"
        rowHeight={50}
        height={Math.max(this.props.height, MIN_TABLE_WIDTH)}
        headerHeight={headerHeight}
        width={ux.width}
        rowsCount={students.length}
        insetScrollbarX={true}
      >
        {this.renderLeftColumnGroup()}
        <ColumnGroup>
          {range(0, period.numAssignments).map((columnIndex) =>
            <Column
              key={columnIndex}
              width={COLUMN_WIDTH}
              flexGrow={0}
              allowCellsRecycling={true}
              cell={<AssignmentCell {...this.props}
                      {...{ period, students, courseId, width: COLUMN_WIDTH, columnIndex }} />}
              header={<AssignmentHeader {...this.props}
                        {...{ period, ux, students, courseId, width: COLUMN_WIDTH, columnIndex }} />}
            />)}
        </ColumnGroup>
      </Table>
    );
  }
}
