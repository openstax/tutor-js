React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'


FixedDataTable = require 'fixed-data-table'
Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'


{PerformanceStore, PerformanceActions} = require '../flux/performance'
LoadableItem = require './loadable-item'
{CoursePeriodsNavShell} = require './course-periods-nav'


Performance = React.createClass
  displayName: 'Performance'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired


  getInitialState: ->
    period_id: "1"
    periodIndex: 1
    sortOrder: 'is-ascending'
    sortIndex: 0
    tableWidth: 0
    tableHeight: 0
    debounce: _.debounce(@sizeTable, 100)
    colDefaultWidth: 300
    colSetWidth: 300
    colResizeWidth: 300
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
    # 40 is an offset container padding
    table.clientWidth - 40

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
    if heading.title is 'Student'
      fixed = true
    else
      fixed = false
    if i is @state.colResizeKey
      @state.colSetWidth = @state.colResizeWidth
    else
      @state.colSetWidth = @state.colDefaultWidth

    if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: @state.periodIndex
        courseId: @props.courseId

      linkToPlanSummary =
        <Router.Link
          to='reviewTaskPeriod'
          params={linkParams}
          className='review-plan'>
            <i className='fa fa-eye'></i>
        </Router.Link>

    customHeader =
      <div
        dataKey={i}
        onClick={@sortClick.bind(@, i, classes)}
        className={'header-cell ' + classes}>
          {heading.title}
          {linkToPlanSummary}
      </div>

    <Column
    label={heading.title}
    headerRenderer={-> customHeader}
    cellRenderer={-> @cellData}
    width={@state.colSetWidth}
    fixed={fixed}
    isResizable=false
    dataKey={i} />

  renderAverageCell: (heading) ->
    if heading.class_average
      classAverage = Math.round(heading.class_average)
    classAverage

  renderStudentRow: (student_data) ->
    cells = _.map(student_data.data, @renderStudentCell)
    cells

  renderStudentCell: (cell) ->
    switch cell.type
      when 'reading' then @renderReadingCell(cell)
      when 'homework' then @renderHomeworkCell(cell)
      when 'name' then cell.title
      else throw new Error('Unknown cell type')

  renderReadingCell: (cell) ->
    status = switch cell.status
      when 'completed' then 'Complete'
      when 'in_progress' then 'In progress'
      when 'not_started' then 'Not started'

    {courseId} = @props
    linkParams = {courseId, id: cell.id}

    <Router.Link to='viewTask' params={linkParams}>{status}</Router.Link>

  renderHomeworkCell: (cell) ->
    {courseId} = @props
    linkParams = {courseId, id: cell.id}

    <Router.Link to='viewTask' params={linkParams}>
      {cell.correct_exercise_count}/{cell.exercise_count}
    </Router.Link>


  selectPeriod: (period) ->
    @setState({period_id: period.id})

  setPeriodIndex: (key) ->
    @setState({periodIndex: key + 1})

  render: ->

    performance = PerformanceStore.get(@props.courseId)

    {period_id} = @state
    performance = _.findWhere(performance, {period_id})

    headers = performance.data_headings
    headers.unshift({"title":"Student"})

    headings = _.map(headers, @renderHeadingCell)
    #averages = _.map(performance.data_headings, @renderAverageCell)

    students = performance.students
    for student in students
      student.data.unshift({"title":student.name, "type":"name"})

    sortData = _.sortBy(performance.students, (d) =>
      switch d.data[@state.sortIndex].type
        when 'homework' then d.data[@state.sortIndex].correct_exercise_count
        when 'reading' then d.data[@state.sortIndex].status
        when 'name' then d.data[@state.sortIndex].title
      )

    if @state.sortOrder is 'is-descending'
      sortData.reverse()

    student_rows = _.map(sortData, @renderStudentRow)


    <div className='course-performance-wrap'>
      <span className='course-performance-title'>Performance Report</span>
      <CoursePeriodsNavShell
        handleSelect={@selectPeriod}
        handleKeyUpdate={@setPeriodIndex}
        intialActive={@state.period_id}
        courseId={@props.courseId} />
      <BS.Panel className='course-performance-container' ref='tableContainer'>
        <Table
          onColumnResizeEndCallback={(colWidth, columnKey) => @setState({colResizeWidth: colWidth, colResizeKey: columnKey})}
          rowHeight={50}
          rowGetter={(rowIndex) -> student_rows[rowIndex]}
          rowsCount={sortData.length}
          width={@state.tableWidth}
          height={@state.tableHeight}
          headerHeight={50}>

          {headings}
        </Table>

      </BS.Panel>
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
