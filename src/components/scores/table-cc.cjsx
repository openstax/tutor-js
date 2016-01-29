React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Time   = require '../time'
Icon = require '../icon'
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
    displayAs: React.PropTypes.string.isRequired
    basedOn: React.PropTypes.string.isRequired
    dataType: React.PropTypes.string


  renderNameHeader: ->
    {basedOn} = @props
    emptyCell = <div className='blank' />
    #helpText =
      #"based on total #{basedOn}"
    #temp
    helpText = null
    averageLabel = 
      <div>
        Class Average &nbsp
        <span className='help'>{helpText}</span>
      </div>
    studentHeader =
      <div className='cc-cell'>
        <SortingHeader
        sortKey='name'
        sortState={@props.sort}
        onSort={@props.onSort}>
          <div className='student-name'>Student Name</div>
        </SortingHeader>
        <div className='student-id'>Student ID</div>
      </div>

    customHeader =
      <div className='assignment-header-cell'>
        <div className='average-label'>
          {averageLabel}
        </div>
        <div className='student-header'>
          {studentHeader}
        </div>   
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
      average =
        <span className='average'>
          {(heading.average * 100).toFixed(0)}%
        </span>

    label = 
      <div className='cc-cell'>
        <SortingHeader
        type={heading.type}
        sortKey={i}
        dataType={@props.dataType}
        sortState={@props.sort}
        onSort={@props.onSort}>
          <div ref='score' className='score'>Score</div>
        </SortingHeader>
        <SortingHeader
        type={heading.type}
        sortKey={i}
        dataType={@props.dataType}
        sortState={@props.sort}
        onSort={@props.onSort}>
          <div ref='completed' className='completed'>Completed</div>
        </SortingHeader>  
      </div>

    titleHeaderTooltip =
      <BS.Tooltip>
        <div>{heading.title}</div>
      </BS.Tooltip>
    titleHeader =
      <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={titleHeaderTooltip}>
        <div className='header-cell title'>
          {heading.title}
        </div>
      </BS.OverlayTrigger>

    customHeader = <div
      data-assignment-type="#{heading.type}"
      className='assignment-header-cell'>
      <div className='average-cell'>
        {average}
      </div>
      <div className='label-cell'>
        {label}
      </div>
    </div>

    <ColumnGroup key={i} groupHeaderRenderer={-> titleHeader} >
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
    props =
      {
        student: student_data,
        courseId: @props.courseId,
        roleId: student_data.role,
        displayAs: @props.displayAs
      }
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
      headerHeight={94}
      groupHeaderHeight={50}>

      {@renderNameHeader()}
      {_.map(@props.data.headings, @renderHeadingCell)}

    </Table>
