import MobxPropTypes from 'prop-types';
import React from 'react';
import { range, isEmpty, sortBy } from 'lodash';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Table, Column, ColumnGroup, Cell } from 'fixed-data-table-2';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
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


export default
@observer
class ScoresTable extends React.Component {

  static propTypes = {
    ux: MobxPropTypes.instanceOf(UX).isRequired,
    sort: MobxPropTypes.object.isRequired,
    onSort: MobxPropTypes.func.isRequired,
    dataType: MobxPropTypes.string,
    isConceptCoach: MobxPropTypes.bool.isRequired,
  }

  @computed get students() {
    const students = sortBy( this.props.ux.period.students, StudentDataSorter({
      sort: this.props.sort,
      displayAs: this.props.displayAs,
    }));
    return this.props.sort.asc ? students : students.reverse();
  }

  get courseId() {
    return this.props.ux.course.id;
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
    const message = this.props.ux.course.isTeacher ? (
      <p>
        Students have enrolled in this <CGL lowercase courseId={this.courseId} />, but there are no assignments to score.  Add an assignment from your <TutorLink to="dashboard" params={{ courseId: this.courseId }}>dashboard</TutorLink>.
      </p>
    ) : (
      <p>
        You don’t have any assignments yet. Once your instructor posts an assignment,
        you’ll see your progress and scores here.
      </p>
    );

    return (
      <div className="course-scores-container" ref="tableContainer">
        <div className="no-assignments">
          {message}
          <TutorLink primaryBtn to="dashboard" params={{ courseId: this.courseId }}>Back to dashboard</TutorLink>
        </div>
      </div>
    );
  }

  renderLeftColumnGroup() {
    const { props: { ux, ux: { COLUMN_WIDTH, course } }, courseId, students } = this;

    if (!course.isTeacher) {
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
    const { courseId, students, props: { displayAs, ux, ux: { course, COLUMN_WIDTH, ROW_HEIGHT, period } } } = this;

    if (!period.coursePeriod.num_enrolled_students) { return this.renderNoStudents(); }
    if (isEmpty(students)) { return this.renderNoAssignments(); }

    return (
      <Table
        className={classnames('course-scores-table')}
        rowHeight={ROW_HEIGHT}
        height={(this.props.height || ux.tableHeight)}
        headerHeight={ux.headerHeight}
        width={ux.tableWidth}
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
              cell={<AssignmentCell {...this.props} {...{ students, columnIndex }} />}
              header={<AssignmentHeader {...this.props} {...{ students, columnIndex }} />}
            />)}
        </ColumnGroup>
      </Table>
    );
  }
};
