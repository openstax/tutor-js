React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Time   = require '../time'
Icon = require '../icon'
ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
NameCell     = require './name-cell'
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
    dataType: React.PropTypes.string
    isConceptCoach: React.PropTypes.bool.isRequired

  renderNameHeader: ->
    emptyCell = <div className='blank' />
    averageLabel =
      <div>
        Class Average &nbsp
      </div>
    studentHeader =
      <div className='cc-cell'>
        <SortingHeader
        sortKey='name'
        sortState={@props.sort}
        onSort={@props.onSort}>
          <div className='student-name'>Student Name</div>
        </SortingHeader>
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

  renderOverallHeader: ->
    overallTitle = <div className='overall-header-cell'>Overall</div>
    customHeader = 
      <div className='overall-average-cell'>
        <div className='average'><span>test</span></div>
        <div className='average empty'></div>
      </div>
    <ColumnGroup fixed={true} groupHeaderRenderer={-> overallTitle}>
      <Column
        width={@props.colSetWidth / 2}
        flexGrow={0}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='1'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>


  renderHeadingCell: (heading, i) ->
    i += @props.firstDataColumn # for the first/last name columns

    getAverageCellWidth =
      if @props.isConceptCoach
        'wide'
      else
        switch heading.type
          when 'reading' then 'wide'
          when 'external' then 'wide'
          else ''

    if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: @props.periodIndex
        courseId: @props.courseId

      review =
        <span className="review-link #{getAverageCellWidth}">
          <Router.Link
            to='reviewTaskPeriod'
            params={linkParams}>
            Review
          </Router.Link>
        </span>


    classAverage = heading.total_average

    if classAverage
      average =
        <span className="average #{getAverageCellWidth}">
          {(classAverage * 100).toFixed(0)}%
        </span>

    if heading.type is 'reading' or heading.type is 'external'
      label =
        <div className='cc-cell'>
          <SortingHeader
          type={heading.type}
          className='wide'
          sortKey={i}
          sortState={@props.sort}
          onSort={@props.onSort}>
            <div ref='completed' className='completed'>Progress</div>
          </SortingHeader>
        </div>
    else
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
            <div ref='completed' className='completed'>Progress</div>
          </SortingHeader>
        </div>

    HSHeadingTitleDueDate = <div>{heading.due_at}</div>

    titleHeaderTooltip =
      <BS.Tooltip id="header-cell-title-#{i}">
        <div>{heading.title}</div>
      </BS.Tooltip>
    titleHeader =
      <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={titleHeaderTooltip}>
        <div
        data-assignment-type="#{heading.type}" 
        className='header-cell title'>
          {heading.title}
        </div>
      </BS.OverlayTrigger>

    customHeader = <div
      className='assignment-header-cell'>
      <div className='average-cell'>
        {average}
        {review unless @props.isConceptCoach or heading.type is 'external'}
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


  renderStudentRow: (student_data, rowIndex) ->
    props =
      {
        student: student_data,
        courseId: @props.courseId,
        roleId: student_data.role,
        displayAs: @props.displayAs,
        isConceptCoach: @props.isConceptCoach,
        rowIndex: rowIndex,
        period_id: @props.period_id
      }
    isBottom = if @props.data.rows.length is rowIndex + 1 then 'bottom' else ''
    columns = [
      <NameCell key='name' {...props} />,
      <div className="overall-cell #{isBottom}">test</div>
    ]

    for task, columnIndex in student_data.data
      props.task = task
      props.columnIndex = columnIndex
      columns.push switch task?.type or 'null'
        when 'null'     then <AbsentCell   key='absent'   {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
        when 'reading'  then <ReadingCell  key='reading'  {...props} />
        else <ConceptCoachCell key='cc'  {...props} />
        # when 'reading'  then <ReadingCell  key='reading'  {...props} />
        # when 'homework' then <HomeworkCell key='homework' {...props} />
    columns


  render: ->
    rowGetter = (rowIndex) =>
      @renderStudentRow(@props.data.rows[rowIndex], rowIndex)

    <Table
      rowHeight={46}
      rowGetter={rowGetter}
      rowsCount={@props.data.rows.length}
      width={@props.width}
      height={@props.height}
      headerHeight={94}
      groupHeaderHeight={50}>

      {@renderNameHeader()}
      {@renderOverallHeader()}
      {_.map(@props.data.headings, @renderHeadingCell)}

    </Table>
