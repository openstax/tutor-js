React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ResizeListenerMixin} = require 'shared'

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

FIRST_DATA_COLUMN = 2
COLUMN_WIDTH = 160

module.exports = React.createClass
  displayName: 'ScoresTable'

  contextTypes:
    router: React.PropTypes.func

  mixins: [ResizeListenerMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    rows: React.PropTypes.array.isRequired
    headings: React.PropTypes.array.isRequired
    overall_average_score: React.PropTypes.number.isRequired
    sort: React.PropTypes.object.isRequired
    onSort: React.PropTypes.func.isRequired
    period_id: React.PropTypes.string
    periodIndex: React.PropTypes.number.isRequired
    displayAs: React.PropTypes.string.isRequired
    dataType: React.PropTypes.string
    isConceptCoach: React.PropTypes.bool.isRequired


  getInitialState: ->
    tableWidth: 0
    tableHeight: 0

  componentDidMount: -> @sizeTable()
  _resizeListener:   -> @sizeTable()
  sizeTable: ->
    @setState({tableWidth: @tableWidth(), tableHeight: @tableHeight()})

  tableWidth: ->
    windowEl = @_getWindowSize()
    tableContainer = React.findDOMNode(@refs.tableContainer) #.course-scores-container
    style = tableContainer.currentStyle or window.getComputedStyle(tableContainer)
    padding = parseInt(style.paddingLeft) + parseInt(style.paddingRight)
    tableContainerWidth = tableContainer.clientWidth - padding
    tableHorzSpacing = document.body.clientWidth - tableContainerWidth
    # since table.clientWidth returns 0 on initial load in IE, include windowEl as a fallback
    Math.max(windowEl.width - tableHorzSpacing, tableContainerWidth)

  tableHeight: ->
    windowEl = @_getWindowSize()
    table = React.findDOMNode(@refs.tableContainer)
    bottomMargin = 140
    windowEl.height - table.offsetTop - bottomMargin

  renderNameHeader: ->
    {sort, onSort, isConceptCoach} = @props

    emptyCell = <div className='blank' />
    averageLabel =
      <div>
        Class Performance &nbsp
        <sup>
          <AverageInfo isConceptCoach={isConceptCoach} />
        </sup>
      </div>
    studentHeader =
      <div className='scores-cell'>
        <SortingHeader
        sortKey='name'
        sortState={sort}
        onSort={onSort}>
          <div className='student-name'>Name and Student ID</div>
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
        width={COLUMN_WIDTH * nameColumns}
        flexGrow={0}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='0'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>

  renderOverallHeader: ->
    {data} = @props

    overallTitle = <div className='overall-header-cell'>Overall</div>
    customHeader =
      <div className='overall-average-cell'>
        <div className='average'>
          <span>
            {"#{(@props.overall_average_score * 100).toFixed(0)}%"}
          </span>
        </div>
        <div className='average empty'></div>
      </div>
    <ColumnGroup fixed={true} groupHeaderRenderer={-> overallTitle}>
      <Column
        width={COLUMN_WIDTH / 2}
        flexGrow={0}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='1'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>


  renderHeadingCell: (heading, i) ->
    {isConceptCoach, periodIndex, period_id, courseId, sort, onSort, dataType} = @props

    i += FIRST_DATA_COLUMN # for the first/last name columns

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
        courseId: courseId

      review =
        <span className="review-link #{getAverageCellWidth}">
          <Router.Link
            to='reviewTask'
            query={tab: @props.periodIndex}
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
      else if heading.type is 'external'
        p = heading.completion_rate
        percent = switch
          when (p < 1 and p > 0.99) then 99 # Don't round to 100% when it's not 100%!
          when (p > 0 and p < 0.01) then 1  # Don't round to 0% when it's not 0%!
          when (p > 1) then 100             # Don't let it go over 100%!
          else Math.round(p * 100)
        average =
          <span className="click-rate">
            {percent}% have clicked link
          </span>

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
        width={COLUMN_WIDTH}
        flexGrow={1}
        allowCellsRecycling={true}
        isResizable=false
        dataKey={i} />
    </ColumnGroup>


  renderStudentRow: (rowIndex) ->
    student_data = @props.rows[rowIndex]

    {courseId, displayAs, isConceptCoach, period_id, rows, headings} = @props

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
    isBottom = if rows.length is rowIndex + 1 then 'bottom' else ''
    studentAverage = "#{(rows[rowIndex].average_score * 100).toFixed(0)}%"

    columns = [
      <NameCell key='name' {...props} />,
      <div className="overall-cell #{isBottom}">
        {if rows[rowIndex].average_score? then studentAverage}
      </div>
    ]

    for task, columnIndex in student_data.data
      props.task = task
      props.columnIndex = columnIndex
      columns.push switch task?.type or 'null'
        when 'null'     then <AbsentCell   key='absent' headings={headings} {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
        when 'reading'  then <ReadingCell  key='reading'  {...props} />
        when 'homework' then <HomeworkCell key='homework'  {...props} />
        else <ConceptCoachCell key='concept_coach'  {...props} />
    columns

  renderNoAssignments: ->
    <div className='course-scores-container' ref='tableContainer'>
      <span className='course-scores-notice'>No Assignments Yet</span>
    </div>

  render: ->
    {rows, headings, isConceptCoach} = @props

    return @renderNoAssignments() if _.isEmpty(@props.rows)

    groupHeaderHeight = if isConceptCoach then 50 else 85
    <div className='course-scores-container' ref='tableContainer'>

      <Table
        rowHeight={50}
        rowGetter={@renderStudentRow}
        rowsCount={rows.length}
        width={@state.tableWidth}
        height={@state.tableHeight}
        headerHeight={55}
        groupHeaderHeight={groupHeaderHeight}>

        {@renderNameHeader()}
        {@renderOverallHeader()}
        {_.map(headings, @renderHeadingCell)}

      </Table>
    </div>
