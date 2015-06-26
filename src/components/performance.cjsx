React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

FixedDataTable = require 'fixed-data-table'
Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

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
    periodIndex = 0
    performance = @getPerfByPeriod(periodIndex)
    sortOrder: 'is-ascending'
    sortIndex: 0

  sortClick: (columnIndex, classes) ->
    if not classes
      @state.sortOrder = 'is-ascending'
    @sortData(columnIndex)

  sortData: (index) ->
    @setState({sortIndex: index})
    console.log(@state)

  renderHeadingCell: (heading, i) ->
    if i is @state.sortIndex
      classes = @state.sortOrder
    else
      classes = ''
    if heading.title is 'Student'
      fixed = true
    else
      fixed = false
    customHeader =
      <div 
        dataKey={i} 
        onClick={@sortClick.bind(@, i, classes)} 
        className={'header-cell ' + classes}>
          {heading.title}
      </div>
    <Column 
    label={heading.title}
    headerRenderer={-> customHeader}
    width={300}
    fixed={fixed}
    isResizable=true
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
    status

  renderHomeworkCell: (cell) ->
    cell.correct_exercise_count + ' / ' + cell.exercise_count
    

  getPerfByPeriod: (periodIndex) ->
    console.log(periodIndex)
    #perf = PerformanceStore.get(@props.courseId)
    #periodPerf = perf[periodIndex]

  handlePeriodSelect: (period) ->
    console.log(period)
    ##{handlePeriodSelect} = @props
    #perf = PerformanceStore.get(@props.courseId)
    #periodPerf = _.findWhere(perf, {period_id: period.id})
    #handlePeriodSelect?(period)


  render: ->

    ##{performance} = @state
    performance = PerformanceStore.get(@props.courseId)

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
      @state.sortOrder = 'is-ascending'
    else
      @state.sortOrder = 'is-descending'

    student_rows = _.map(sortData, @renderStudentRow)


    <div className='course-performance-wrap'>
      <span className='course-performance-title'>Performance Report</span>
      <CoursePeriodsNavShell
        handleSelect={@handlePeriodSelect}
        intialActive={@state.period}
        courseId={@props.courseId} />
      <BS.Panel className='course-performance-container'>
        <Table
          onColumnResizeEndCallback={-> console.log('onColumnResizeEndCallback')}
          rowHeight={50}
          rowGetter={(rowIndex) -> student_rows[rowIndex]}
          rowsCount={sortData.length}
          width={1600}
          height={500}
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
