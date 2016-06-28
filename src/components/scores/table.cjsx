React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

FixedDataTable = require 'fixed-data-table'
Time   = require '../time'
Icon = require '../icon'

SortingHeader = require './sorting-header'
AverageInfo = require './average-info'

ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
NameCell     = require './name-cell'
AbsentCell   = require './absent-cell'
ExternalCell = require './external-cell'
ConceptCoachCell = require './concept-coach-cell'

Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'

module.exports = React.createClass
  displayName: 'ScoresTable'

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
    {sort, onSort, colSetWidth, isConceptCoach} = @props

    emptyCell = <div className='blank' />
    averageLabel =
      <div>
        Class Average &nbsp
        <AverageInfo isConceptCoach={isConceptCoach} />
      </div>
    studentHeader =
      <div className='scores-cell'>
        <SortingHeader
        sortKey='name'
        sortState={sort}
        onSort={onSort}>
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
        width={colSetWidth * nameColumns}
        flexGrow={0}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='0'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>

  renderOverallHeader: ->
    {colSetWidth, data} = @props

    overallTitle = <div className='overall-header-cell'>Overall</div>
    customHeader =
      <div className='overall-average-cell'>
        <div className='average'>
          <span>
            {"#{(data.overall_average_score * 100).toFixed(0)}%"}
          </span>
        </div>
        <div className='average empty'></div>
      </div>
    <ColumnGroup fixed={true} groupHeaderRenderer={-> overallTitle}>
      <Column
        width={colSetWidth / 2}
        flexGrow={0}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='1'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>


  renderHeadingCell: (heading, i) ->
    {firstDataColumn, isConceptCoach, periodIndex, courseId, sort, onSort, dataType, colSetWidth} = @props

    i += firstDataColumn # for the first/last name columns

    getAverageCellWidth =
      if isConceptCoach
        'wide'
      else
        switch heading.type
          when 'reading' then 'wide'
          when 'external' then 'wide'
          else ''

    if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: periodIndex
        courseId: courseId

      review =
        <span className="review-link #{getAverageCellWidth}">
          <Router.Link
            to='reviewTaskPeriod'
            params={linkParams}>
            Review
          </Router.Link>
        </span>


    classAverage = heading.average_score

    if classAverage
      average =
        <span className="average #{getAverageCellWidth}">
          {(classAverage * 100).toFixed(0)}%
        </span>
    else
      if heading.type is 'homework'
        average =
          <span className="average">---</span>

    if heading.type is 'reading' or heading.type is 'external'
      label =
        <div className='scores-cell'>
          <SortingHeader
          type={heading.type}
          className='wide'
          sortKey={i}
          sortState={sort}
          onSort={onSort}>
            <div ref='completed' className='completed'>Progress</div>
          </SortingHeader>
        </div>
    else
      label =
        <div className='scores-cell'>
          <SortingHeader
          type={heading.type}
          sortKey={i}
          dataType={dataType}
          sortState={sort}
          onSort={onSort}>
            <div ref='score'>Score</div>
          </SortingHeader>
          <SortingHeader
          type={heading.type}
          sortKey={i}
          dataType={dataType}
          sortState={sort}
          onSort={onSort}>
            <div ref='completed'>Progress</div>
          </SortingHeader>
        </div>

    groupHeaderClass = if not isConceptCoach then 'hs' else ''

    groupHeaderDueDate =
      <div className='due'>due <Time date={heading.due_at}
      format='shortest'/></div>

    groupHeaderTooltip =
      <BS.Tooltip id="header-cell-title-#{i}">
        <div>{heading.title}</div>
      </BS.Tooltip>
    groupHeader =
      <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={groupHeaderTooltip}>
        <span className="group-header">
          <div
          data-assignment-type="#{heading.type}"
          className="header-cell group title #{groupHeaderClass}">
            {heading.title}
          </div>
          {groupHeaderDueDate}
        </span>
      </BS.OverlayTrigger>

    customHeader = <div
      className='assignment-header-cell'>
      <div className='average-cell'>
        {average}
        {review unless isConceptCoach or heading.type is 'external'}
      </div>
      <div className='label-cell'>
        {label}
      </div>
    </div>

    <ColumnGroup key={i} groupHeaderRenderer={-> groupHeader} >
      <Column
        label={heading.title}
        headerRenderer={-> customHeader}
        cellRenderer={-> @cellData}
        width={colSetWidth}
        flexGrow={1}
        allowCellsRecycling={true}
        isResizable=false
        dataKey={i} />
    </ColumnGroup>


  renderStudentRow: (student_data, rowIndex) ->
    {courseId, displayAs, isConceptCoach, period_id, data} = @props

    props =
      {
        student: student_data,
        courseId: courseId,
        roleId: student_data.role,
        displayAs: displayAs,
        isConceptCoach: isConceptCoach,
        rowIndex: rowIndex,
        period_id: period_id
      }
    isBottom = if data.rows.length is rowIndex + 1 then 'bottom' else ''
    studentAverage = "#{(data.rows[rowIndex].average_score * 100).toFixed(0)}%"

    columns = [
      <NameCell key='name' {...props} />,
      <div className="overall-cell #{isBottom}">
        {if data.rows[rowIndex].average_score? then studentAverage}
      </div>
    ]

    for task, columnIndex in student_data.data
      props.task = task
      props.columnIndex = columnIndex
      columns.push switch task?.type or 'null'
        when 'null'     then <AbsentCell   key='absent' headings={data.headings} {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
        when 'reading'  then <ReadingCell  key='reading'  {...props} />
        when 'homework' then <HomeworkCell key='homework'  {...props} />
        else <ConceptCoachCell key='concept_coach'  {...props} />
    columns


  render: ->
    {data, width, height, isConceptCoach} = @props

    rowGetter = (rowIndex) =>
      @renderStudentRow(data.rows[rowIndex], rowIndex)

    groupHeaderHeight = if isConceptCoach then 50 else 100

    <Table
      rowHeight={60}
      rowGetter={rowGetter}
      rowsCount={data.rows.length}
      width={width}
      height={height}
      headerHeight={120}
      groupHeaderHeight={groupHeaderHeight}>

      {@renderNameHeader()}
      {@renderOverallHeader()}
      {_.map(data.headings, @renderHeadingCell)}

    </Table>
