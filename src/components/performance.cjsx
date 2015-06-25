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
    sortIndex: -1
    isNameSort: true

  sortClick: (event) ->
    isActiveSort = event.target.classList.contains('is-ascending', 'is-descending')
    # this is a special case for the name header data which is one level above nested data
    if not _.contains(event.target.classList, 'student-name')
      @setState({isNameSort: false})
    else
      @setState({isNameSort: true})
    if not isActiveSort
      @state.sortOrder = 'is-ascending'
    @sortData(event.target.cellIndex)

  sortData: (index) ->
    @setState({sortIndex: index - 1})

  renderHeadingCell: (heading, i) ->
    if i is @state.sortIndex
      classes = @state.sortOrder
    else
      classes = ''
    if heading.title is 'Student'
      fixed = true
    else
      fixed = false
    #<th className={classes} title={heading.title} onClick={@sortClick}>{heading.title}</th>
    customHeader = <div onClick={@testClick} className={classes}>{heading.title}</div>
    <Column label={heading.title}
    headerRenderer={-> customHeader}
    width={300}
    fixed={fixed}
    dataKey={i} />

  renderAverageCell: (heading) ->
    if heading.class_average
      classAverage = Math.round(heading.class_average)
    <th>{classAverage}</th>

  renderStudentRow: (student_data, i) ->
    cells = _.map(student_data.data, @renderStudentCell)
    cells.unshift(student_data.name)
    cells

  renderStudentCell: (cell) ->
    switch cell.type
      when 'reading' then @renderReadingCell(cell)
      when 'homework' then @renderHomeworkCell(cell)
      else throw new Error('Unknown cell type')

  renderReadingCell: (cell) ->
    status = switch cell.status
      when 'complete' then 'Complete'
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



  rowSort: (rowIndex) ->
    performance = PerformanceStore.get(@props.courseId)

    if @state.isNameSort
      sortData = _.sortBy(performance.students, 'name')
    else
      sortData = _.sortBy(performance.students, (d) =>
        switch d.data[@state.sortIndex].type
          when 'homework' then d.data[@state.sortIndex].correct_exercise_count
          when 'reading' then d.data[@state.sortIndex].status
        )

    if @state.isNameSort
      nameClass = @state.sortOrder

    if @state.sortOrder is 'is-descending'
      sortData.reverse()
      @state.sortOrder = 'is-ascending'
    else
      @state.sortOrder = 'is-descending'


    #removed sortData temporarily from below
    student_rows = _.map(performance.students, @renderStudentRow)
    student_rows[rowIndex]




  testClick: ->
    console.log('custom header test click')

  render: ->

    ##{performance} = @state
    performance = PerformanceStore.get(@props.courseId)


    headers = performance.data_headings
    headers.unshift({"title":"Student"})

    headings = _.map(headers, @renderHeadingCell)
    averages = _.map(performance.data_headings, @renderAverageCell)

    if @state.isNameSort
      sortData = _.sortBy(performance.students, 'name')
    else
      sortData = _.sortBy(performance.students, (d) =>
        switch d.data[@state.sortIndex].type
          when 'homework' then d.data[@state.sortIndex].correct_exercise_count
          when 'reading' then d.data[@state.sortIndex].status
        )

    if @state.isNameSort
      nameClass = @state.sortOrder

    if @state.sortOrder is 'is-descending'
      sortData.reverse()
      @state.sortOrder = 'is-ascending'
    else
      @state.sortOrder = 'is-descending'

    student_rows = _.map(sortData, @renderStudentRow)
    console.log(performance)

      


    <div className='course-performance-wrap'>
      <span className='course-performance-title'>Performance Report</span>
      <CoursePeriodsNavShell
        handleSelect={@handlePeriodSelect}
        intialActive={@state.period}
        courseId={@props.courseId} />
      <BS.Panel className='course-performance-container'>
        <Table
          rowHeight={50}
          rowGetter={@rowSort}
          rowsCount={sortData.length}
          width={window.innerWidth - 500}
          height={window.innerHeight - 500}
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
