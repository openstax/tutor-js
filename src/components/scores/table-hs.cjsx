React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Time   = require '../time'
ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
HSNameCell     = require './name-cell-hs'
AbsentCell   = require './absent-cell'
ExternalCell = require './external-cell'
SortingHeader = require './sorting-header'
FixedDataTable = require 'fixed-data-table'

Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'
{QuickStatsShell} = require './quick-external-stats'

module.exports = React.createClass
  displayName: 'HSTable'

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
    studentIdHeader = <span className='student-id'>Student ID</span>
    header =
      <SortingHeader
      sortKey='name'
      sortState={@props.sort}
      onSort={@props.onSort}>
        <span>Student Name</span>
      </SortingHeader>
    dueDateHeading = <div>Due Date</div>
    customHeader = 
      <div className='assignment-header-cell'>
        {dueDateHeading}
        {header}
      </div>
    # student name column count
    nameColumns = 1
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
    if heading.type is 'external'
      summary = <QuickStatsShell
        className='summary'
        id={"#{heading.plan_id}"}
        periodId={@props.period_id}/>

    else if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: @props.periodIndex
        courseId: @props.courseId

      review =
        <Router.Link
          to='reviewTaskPeriod'
          params={linkParams}
          className='review-plan btn btn-default'>
          Review
        </Router.Link>

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
      isConceptCoach={false}>
        {heading.title}
      </SortingHeader>

    dueDates = <div><Time date={heading.due_at} format='shortest'/></div>

    customHeader = <div
      data-assignment-type="#{heading.type}"
      className='assignment-header-cell'>
      {dueDates}
      <div>
        {summary}
        {review}
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
      <HSNameCell key='name' {...props} />
    ]

    for task in student_data.data
      props.task = task
      columns.push switch task?.type or 'null'
        when 'null'     then <AbsentCell   key='absent'   {...props} />
        when 'reading'  then <ReadingCell  key='reading'  {...props} />
        when 'homework' then <HomeworkCell key='homework' {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
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
      headerHeight={92}
      groupHeaderHeight={50}>

      {@renderNameHeader()}
      {_.map(@props.data.headings, @renderHeadingCell)}

    </Table>
