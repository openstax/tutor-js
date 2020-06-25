import PropTypes from 'prop-types';
import React from 'react';
import { range, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { Table, Column, ColumnGroup } from 'fixed-data-table-2';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import TutorLink from '../../components/link';

import SortingHeader from './sorting-header';
import AssignmentCell from './assignment-cell';
import AssignmentHeader from './assignment-header';
import NameCell from './name-cell';
import OverallHeader from './overall-header';
import CGL from '../../components/course-grouping-label';
import OverallCell from './overall-cell';

import UX from './ux';

const FIRST_DATA_COLUMN = 2;

const MIN_TABLE_WIDTH = 500;
const MIN_TABLE_HEIGHT = 600;

const NameHeader = observer(({ ux }) => {
  return (
    <div className="header-cell-wrapper student-names">
      <div className="header-row overview-row">
        <SortingHeader sortKey="name" ux={ux} dataType="name">
          <span>Overall</span>
        </SortingHeader>
      </div>
    </div>
  );
});
NameHeader.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default
@observer
class ScoresTable extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
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
    const message = this.props.ux.course.currentRole.isTeacher ? (
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
    const { ux, ux: { students, COLUMN_WIDTH, course } } = this.props;

    if (!course.currentRole.isTeacher) {
      return (
        <ColumnGroup fixed={true}>
          <Column
            fixed={true}
            width={ux.averagesWidth}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable={false}
            cell={<OverallCell ux={ux} />}
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
          cell={<NameCell ux={ux} />}
          header={<NameHeader ux={ux} />}
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

  @autobind getRowClass(rowIndex) {
    if (!rowIndex) { return null; }
    const { students } = this.props.ux;
    if (students[rowIndex].is_dropped && !students[rowIndex-1].is_dropped) {
      return 'first-dropped-student';
    }
    return null;
  }

  render() {
    const { ux, ux: { course, students, COLUMN_WIDTH, ROW_HEIGHT, period } }  = this.props;

    if (course.currentRole.isTeacher && !period.coursePeriod.num_enrolled_students) {
      return this.renderNoStudents();
    }
    if (isEmpty(students)) {
      return this.renderNoAssignments();
    }

    return (
      <Table
        className={classnames('course-scores-table')}
        rowHeight={ROW_HEIGHT}
        height={(ux.tableHeight)}
        headerHeight={ux.headerHeight}
        width={ux.tableWidth}
        rowsCount={students.length}
        insetScrollbarX={true}
        rowClassNameGetter={this.getRowClass}
      >
        {this.renderLeftColumnGroup()}
        <ColumnGroup>
          {range(0, period.numAssignments).map((columnIndex) =>
            <Column
              key={columnIndex}
              width={COLUMN_WIDTH}
              flexGrow={0}
              allowCellsRecycling={true}
              cell={<AssignmentCell ux={ux} {...{ students, columnIndex }} />}
              header={<AssignmentHeader ux={ux} {...{ columnIndex }} />}
            />)}
        </ColumnGroup>
      </Table>
    );
  }
}
