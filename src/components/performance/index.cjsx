React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Time   = require '../time'
ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
NameCell     = require './name-cell'
ExternalCell = require './external-cell'
SortingHeader = require './sorting-header'

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

# Index of first column that contains data
FIRST_DATA_COLUMN = 2

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
    sort: { key: 'last_name', asc: false }

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

  renderHeadingCell: (heading, i) ->
    i += FIRST_DATA_COLUMN # for the first/last name colums
    if heading.type is 'external'
      customHeader = <QuickStatsShell id={"#{heading.plan_id}"} periodId={@state.period_id}/>

    else if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: @state.periodIndex
        courseId: @props.courseId

    linkToPlanSummary =
      <Router.Link to='reviewTaskPeriod' params={linkParams} className='review-plan'>
        {if heading.average then heading.average.toFixed(2) else 'Review'}
      </Router.Link>

    sortingHeader = <SortingHeader sortKey={i}
      sortState={@state.sort} onSort={@changeSortingOrder}
    >{heading.title}</SortingHeader>

    customHeader = <div className='assignment-header-cell'>
      <Time date={heading.due_at}/>{linkToPlanSummary}
    </div>

    <ColumnGroup key={i} groupHeaderRenderer={-> sortingHeader} >

      <Column
        label={heading.title}
        headerRenderer={-> customHeader}
        cellRenderer={-> @cellData}
        width={@state.colSetWidth}
        flexGrow={1}

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

  getStudentRowData: ->
    # The period may not have been selected. If not, just use the 1st period
    {sort, period_id} = @state
    data = PerformanceStore.get(@props.courseId)
    performance = if period_id
      _.findWhere(data, {period_id})
    else
      data[0] or throw new Error('BUG: No periods')

    sortData = _.sortBy(performance.students, (d) ->
      if _.isNumber(sort.key)
        index = sort.key - FIRST_DATA_COLUMN
        switch d.data[index].type
          when 'homework' then d.data[index].correct_exercise_count
          when 'reading' then d.data[index].status
      else
        d[ sort.key ]
    )
    { headings: performance.data_headings, rows: if sort.asc then sortData.reverse() else sortData }

  render: ->
    {courseId} = @props
    {period_id, tableWidth, tableHeight} = @state

    data = @getStudentRowData()

    rowGetter = (rowIndex) =>
      @renderStudentRow(data.rows[rowIndex])

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
          rowGetter={rowGetter}

          rowsCount={data.rows.length}
          width={tableWidth}
          height={tableHeight}
          headerHeight={46}
          groupHeaderHeight={50}>

          <ColumnGroup fixed={true} label="Students">
            {@renderNameColumn(dataKey: 0, sortKey: 'first_name', label: 'First Name', width: 150)}
            {@renderNameColumn(dataKey: 1, sortKey: 'last_name',  label: 'Last Name', width: 150)}
          </ColumnGroup>
          {_.map(data.headings, @renderHeadingCell)}
        </Table>

      </div>
    </div>

  renderNameColumn: ({width, dataKey, sortKey, label}) ->
    headerProps = {sortKey, sortState: @state.sort, onSort: @changeSortingOrder}
    columnProps = {width, dataKey, label, fixed: true}
    header = <SortingHeader {...headerProps}>{label}</SortingHeader>
    <Column
      key={dataKey} {...columnProps} cellRenderer={-> @cellData} headerRenderer={ -> header} />

  changeSortingOrder: (key) ->
    asc = if @state.sort.key is key then not @state.sort.asc else false
    @setState(sort: { key, asc})

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
