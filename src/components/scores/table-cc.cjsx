React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Time   = require '../time'
ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
CCNameCell     = require './name-cell-cc'
AbsentCell   = require './absent-cell'
ExternalCell = require './external-cell'
SortingHeader = require './sorting-header'
FixedDataTable = require 'fixed-data-table'
ConceptCoachCell = require './concept-coach-cell'

Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'

module.exports = React.createClass
  displayName: 'CCTable'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    data: React.PropTypes.object.isRequired
    width: React.PropTypes.number.isRequired
    height: React.PropTypes.number.isRequired
    sort: React.PropTypes.object.isRequired
    onSort: React.PropTypes.func.isRequired
    colSetWidth: React.PropTypes.number.isRequired
    period_id: React.PropTypes.string
    periodIndex: React.PropTypes.number.isRequired
    firstDataColumn: React.PropTypes.number.isRequired


  renderNameHeader: ->
    emptyCell = <div className='blank' />
    header =
      <SortingHeader
      sortKey='name'
      sortState={@props.sort}
      onSort={@props.onSort}>
        <span>Student Name</span>
        <span className='student-id'>Student ID</span>
      </SortingHeader>
    customHeader =
      <div className='assignment-header-cell'>
        {header}
      </div>
    # student name column count
    nameColumns = 2
    <ColumnGroup fixed={true} groupHeaderRenderer={-> emptyCell}>
      <Column
        width={@props.colSetWidth * nameColumns}
        flexGrow={0}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='0'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>


  renderHeadingCell: (heading, i) ->
    i += @props.firstDataColumn # for the first/last name columns

    if heading.average
      summary =
        <span className='summary'>
          {(heading.average * 100).toFixed(0)}% avg
        </span>

    sortingHeader =
      <SortingHeader
      type={heading.type}
      sortKey={i}
      sortState={@props.sort}
      onSort={@props.onSort}
      isConceptCoach={true}>
        {heading.title}
      </SortingHeader>

    customHeader = <div
      data-assignment-type="#{heading.type}"
      className='assignment-header-cell'>
      <div>
        {summary}
      </div>
    </div>

    <ColumnGroup key={i} groupHeaderRenderer={-> sortingHeader} >
      <Column
        label={heading.title}
        headerRenderer={-> customHeader}
        cellRenderer={-> @cellData}
        width={@props.colSetWidth}
        flexGrow={1}
        allowCellsRecycling={true}
        isResizable=false
        dataKey={i} />
    </ColumnGroup>


  renderStudentRow: (student_data) ->
    props = {student:student_data, courseId: @props.courseId, roleId: student_data.role}
    columns = [
      <CCNameCell key='name' {...props} />
    ]

    for task in student_data.data
      props.task = task
      columns.push switch task?.type or 'null'
        when 'null'          then <AbsentCell       key='absent' {...props} />
        when 'concept_coach' then <ConceptCoachCell key='cc'     {...props} />
    columns


  render: ->
    rowGetter = (rowIndex) =>
      @renderStudentRow(@props.data.rows[rowIndex])

    <Table
      rowHeight={46}
      rowGetter={rowGetter}
      rowsCount={@props.data.rows.length}
      width={@props.width}
      height={@props.height}
      headerHeight={47}
      groupHeaderHeight={50}>

      {@renderNameHeader()}
      {_.map(@props.data.headings, @renderHeadingCell)}

    </Table>
