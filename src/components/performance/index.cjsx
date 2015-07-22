React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
NameCell     = require './name-cell'
ExternalCell = require './external-cell'

FixedDataTable = require 'fixed-data-table'
Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'


{PerformanceStore, PerformanceActions} = require '../../flux/performance'
{PerformanceExportStore, PerformanceExportActions} = require '../../flux/performance-export'
LoadableItem = require '../loadable-item'
PerformanceExport = require './export'
{QuickStatsShell} = require './quick-external-stats'
{CoursePeriodsNavShell} = require '../course-periods-nav'


Performance = React.createClass
  displayName: 'Performance'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired


  getInitialState: ->
    period_id: null
    periodIndex: 1
    sortOrder: 'is-ascending'
    sortIndex: 0
    tableWidth: 0
    tableHeight: 0
    debounce: _.debounce(@sizeTable, 100)
    colDefaultWidth: 225
    colSetWidth: 225
    colResizeWidth: 225
    colResizeKey: 0


  componentDidMount: ->
    window.addEventListener("resize", @state.debounce)
    @sizeTable()

  componentWillUnmount: ->
    window.removeEventListener("resize", @state.debounce)

  sizeTable: ->
    @setState({tableWidth: @tableWidth(), tableHeight: @tableHeight()})

  tableWidth: ->
    table = React.findDOMNode(@refs.tableContainer)
    table.clientWidth

  tableHeight: ->
    table = React.findDOMNode(@refs.tableContainer)
    window.innerHeight - table.offsetTop - 120

  sortClick: (columnIndex, classes) ->
    if not classes or @state.sortOrder is 'is-descending'
      @state.sortOrder = 'is-ascending'
    else
      @state.sortOrder = 'is-descending'
    @sortData(columnIndex)

  sortData: (index) ->
    @setState({sortIndex: index})

  renderHeadingCell: (heading, i) ->
    if i is @state.sortIndex
      classes = @state.sortOrder
    else
      classes = ''
    if i is @state.colResizeKey
      @state.colSetWidth = @state.colResizeWidth
    else
      @state.colSetWidth = @state.colDefaultWidth
    if heading.type is 'external'
      customHeader = <small>
        <QuickStatsShell id={"#{heading.plan_id}"} periodId={@state.period_id}/>
      </small>
    else if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: @state.periodIndex
        courseId: @props.courseId
      linkText = 'Review'
      linkText = heading.average.toFixed(2) if heading.average?

      linkToPlanSummary =
        <Router.Link
          to='reviewTaskPeriod'
          params={linkParams}
          className='review-plan'>
            {linkText}
        </Router.Link>

      customHeader = linkToPlanSummary
    else
      customHeader = 'Class Average'

    customHeader = <div className='average-header-cell'>
      {customHeader}
    </div>

    customGroupHeader =
      <div
        dataKey={i}
        onClick={@sortClick.bind(@, i, classes)}
        className={'header-cell ' + classes}>
          {heading.title}
      </div>
    isFixed = i < 2
    <ColumnGroup
      key={i}
      groupHeaderRenderer={-> customGroupHeader}
      fixed={isFixed}>
      <Column
        label={heading.title}
        headerRenderer={-> customHeader}
        cellRenderer={-> @cellData}
        width={@state.colSetWidth}
        flexGrow={1}
        fixed={isFixed}
        isResizable=false
        dataKey={i} />
    </ColumnGroup>

  renderAverageCell: (heading) ->
    if heading.class_average
      classAverage = Math.round(heading.class_average)
    classAverage

  renderStudentRow: (student_data) ->
    props = {student:student_data, courseId: @props.courseId, roleId: student_data.role}
    columns = [
      <NameCell key='fn' display={student_data.first_name} {...props} />
      <NameCell key='ln' display={student_data.last_name}  {...props} />
    ]
    for task in student_data.data
      props.task = task
      columns.push switch task.type
        when 'reading' then  <ReadingCell  key='reading'  {...props} />
        when 'homework' then <HomeworkCell key='homework' {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
    columns

  selectPeriod: (period) ->
    @setState({period_id: period.id})

  setPeriodIndex: (key) ->
    @setState({periodIndex: key + 1})

  render: ->
    {courseId} = @props
    {sortIndex, period_id, tableWidth, tableHeight, sortOrder} = @state

    performance = PerformanceStore.get(courseId)

    {period_id} = @state
    # The period may not have been selected. If not, just use the 1st period
    if period_id
      performance = _.findWhere(performance, {period_id})
    else
      performance = performance[0] or throw new Error('BUG: No periods')

    headers = performance.data_headings
    headers.unshift({"title":"First Name"})
    headers.unshift({"title":"Last Name"})

    headings = _.map(headers, @renderHeadingCell)

    sortData = _.sortBy(performance.students, (d) ->
      if sortIndex is 0
        d.first_name
      else if sortIndex is 1
        d.first_name
      else
        switch d.data[sortIndex].type
          when 'homework' then d.data[sortIndex].correct_exercise_count
          when 'reading' then d.data[sortIndex].status
          when 'name' then d.data[sortIndex].title
      )

    if sortOrder is 'is-descending'
      sortData.reverse()

    student_rows = _.map(sortData, @renderStudentRow)

    <div className='course-performance-wrap'>
      <span className='course-performance-title'>Performance Report</span>
      <PerformanceExport courseId={courseId} className='pull-right'/>
      <CoursePeriodsNavShell
        handleSelect={@selectPeriod}
        handleKeyUpdate={@setPeriodIndex}
        intialActive={period_id}
        courseId={courseId} />
      <div className='course-performance-container' ref='tableContainer'>
        <Table
          onColumnResizeEndCallback={(colWidth, columnKey) => @setState({colResizeWidth: colWidth, colResizeKey: columnKey})}
          rowHeight={46}
          rowGetter={(rowIndex) -> student_rows[rowIndex]}
          rowsCount={sortData.length}
          width={tableWidth}
          height={tableHeight}
          headerHeight={46}
          groupHeaderHeight={50}>

          {headings}
        </Table>

      </div>
    </div>

PerformanceShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <BS.Panel className='performance-report'>
      <LoadableItem
        id={courseId}
        store={PerformanceStore}
        actions={PerformanceActions}
        renderItem={-> <Performance courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {PerformanceShell, Performance}
