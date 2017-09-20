/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import ReactDOM from 'react-dom';
//import BS from 'react-bootstrap';
import { range, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { Table, Column, ColumnGroup, Cell } from 'fixed-data-table-2';
import { autobind } from 'core-decorators';

import Time from '../time';
import Icon from '../icon';

import SortingHeader from './sorting-header';
import AverageInfo from './average-info';
import AssignmentCell from './assignment-cell';
import AssignmentHeader from './assignment-header';
import NameCell from './name-cell';

import Period from '../../models/course/period';

import Router from 'react-router-dom';

const FIRST_DATA_COLUMN = 2;
const COLUMN_WIDTH = 160;


@observer
export default class ScoresTable extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.instanceOf(Period).isRequired,
    //    periodIndex:  React.PropTypes.number.isRequired,

    // rows: React.PropTypes.array.isRequired,
    // headings: React.PropTypes.array.isRequired,
    // overall_average_score: React.PropTypes.number.isRequired,
    sort: React.PropTypes.object.isRequired,
    onSort: React.PropTypes.func.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    displayAs: React.PropTypes.string.isRequired,
    dataType: React.PropTypes.string,
    isConceptCoach: React.PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      tableWidth: 500,
      tableHeight: 400,
    };
  }

  // componentDidMount() { this.sizeTable(); }
  // componentDidUpdate() { this.sizeTable(); }

  // sizeTable() {
  //   this.setState({ tableWidth: this.tableWidth(), tableHeight: this.tableHeight() })
  // }

  // tableWidth() {
  //   console.log( "tw", tableContainerWidth)

  //   const windowEl = this._getWindowSize();
  //   const tableContainer = ReactDOM.findDOMNode(this.refs.tableContainer) || { currentStyle: {} };
  //   const style = tableContainer.currentStyle || window.getComputedStyle(tableContainer);
  //   const padding = parseInt(style.paddingLeft || 0) + parseInt(style.paddingRight || 0);
  //   const tableContainerWidth = ((tableContainer != null ? tableContainer.clientWidth : undefined) || 0) - padding;
  //   const tableHorzSpacing = (document.body.clientWidth || 0) - tableContainerWidth;
  //   // since table.clientWidth returns 0 on initial load in IE, include windowEl as a fallback
  //   return (
  //     Math.max(windowEl.width - tableHorzSpacing, tableContainerWidth)
  //   );
  // }

  // tableHeight() {
  //   const windowEl = this._getWindowSize();
  //   const table = ReactDOM.findDOMNode(this.refs.tableContainer) || {};
  //   const bottomMargin = 140;
  //   windowEl.height - (table.offsetTop || 0) - bottomMargin;
  // }

  renderNoStudents() {
    return (
      <div className="course-scores-container" ref="tableContainer">
        <span className="course-scores-notice">
          No students have joined yet
        </span>
      </div>
    );
  }

  @autobind
  OverallHeader() {
    return (
      <div className="header-cell-wrapper overall-average">
        <div className="overall-header-cell">
          Overall
        </div>
        <div className="header-row">
          <span>
            {(this.props.period.scores.overall_average_score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="header-row short" />
      </div>
    );
  }

  @autobind
  OverallCell({ data, rowIndex }) {
    const avg = data.students[rowIndex].average_score || 0;
    return (
      <Cell className="overall-cell">
        {(avg * 100).toFixed(0)} %
      </Cell>
    );
  }


  @autobind
  NameCell(props) {
    const student = props.data.students[props.rowIndex];
    return (
      <div className="name-cell-wrapper">
        <NameCell key="name" {...this.props} courseId={props.courseId} student={student} />
        <div className="overall-cell">
          {(student.average_score != null) ? `${(student.average_score * 100).toFixed(0)}%` : undefined}
        </div>
      </div>
    );
  }

  @autobind
  NameHeader(props) {
    const { sort, onSort, isConceptCoach } = this.props;
    return (
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
    );
  }

  render() {
    const { period, height, width, headings, isConceptCoach } = this.props;
    const courseId = period.course.id;
    const data = period.scores;

    if (isEmpty(data.students)) { return this.renderNoStudents(); }

    // const groupHeaderHeight = isConceptCoach ? 50 : 85;

    return (
      <Table
        className="course-scores-table"
        rowHeight={50}
        height={height}
        width={width}
        headerHeight={150}
        rowsCount={data.students.length}
      >
        <ColumnGroup fixed={true}>
          <Column
            fixed={true}
            width={COLUMN_WIDTH}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable={false}
            cell={React.createElement(this.NameCell, { data, courseId })}
            header={React.createElement(this.NameHeader, { courseId })}
          />
          <Column
            fixed={true}
            width={COLUMN_WIDTH / 2}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable={false}
            cell={React.createElement(this.OverallCell, { data })}
            header={React.createElement(this.OverallHeader)}
          />
        </ColumnGroup>
        <ColumnGroup>
          {range(0, data.numAssignments).map((columnIndex) =>
            <Column
              key={columnIndex}
              width={COLUMN_WIDTH}
              flexGrow={0}
              allowCellsRecycling={true}
              cell={React.createElement(AssignmentCell, Object.assign({}, this.props, {
                  data,
                  courseId,
                  width: (COLUMN_WIDTH),
                  columnIndex: (columnIndex) }))}
              header={React.createElement(AssignmentHeader, Object.assign({}, this.props, {
                  data,
                  courseId,
                  width: (COLUMN_WIDTH),
                  columnIndex: (columnIndex) }))} />)}
        </ColumnGroup>
      </Table>
    );
  }
}
