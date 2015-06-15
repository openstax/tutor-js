React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{PerformanceStore, PerformanceActions} = require '../flux/performance'
LoadableItem = require './loadable-item'

Performance = React.createClass
  displayName: 'Performance'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    sortOrder: 'is-ascending'
    sortIndex: 0
    isNameSort: true

  sortClick: (event) ->
    isActiveSort =
      _.contains(event.target.classList, 'is-ascending') or
      _.contains(event.target.classList, 'is-descending')
    # this is a special case for the name header data which is one level above nested data
    if not _.contains(event.target.classList, 'student-name')
      @setState({isNameSort: false})
    else
      @setState({isNameSort: true})
    headers = event.target.parentNode.querySelectorAll('th')
    for header in headers
      header.classList.remove('is-ascending', 'is-descending')
    if not isActiveSort
      @state.sortOrder = 'is-ascending'
    event.target.classList.add(@state.sortOrder)
    @sortData(event.target.cellIndex)

  sortData: (index) ->
    @setState({sortIndex: index - 1})

  renderHeadingCell: (heading) ->
    <th className='sortable' title={heading.title} onClick={@sortClick}>{heading.title}</th>

  renderAverageCell: (heading) ->
    if heading.class_average
      classAverage = Math.round(heading.class_average)
    <th>{classAverage}</th>

  renderStudentRow: (student_data) ->
    cells = _.map(student_data.data, @renderStudentCell)
    <tr>
      <td className='student-name'>{student_data.name}</td>
      {cells}
    </tr>

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

    <td>{status}</td>

  renderHomeworkCell: (cell) ->
    <td>
      {cell.correct_exercise_count}/{cell.exercise_count}
    </td>

  render: ->
    performance = PerformanceStore.get(@props.courseId)

    headings = _.map(performance.data_headings, @renderHeadingCell)
    averages = _.map(performance.data_headings, @renderAverageCell)

    if @state.isNameSort
      sortData = _.sortBy(performance.students, 'name')
    else
      sortData = _.sortBy(performance.students, (d) =>
        switch d.data[@state.sortIndex].type
          when 'homework' then d.data[@state.sortIndex].correct_exercise_count
          when 'reading' then d.data[@state.sortIndex].status
        )

    if @state.sortOrder is 'is-descending'
      sortData.reverse()
      @state.sortOrder = 'is-ascending'
    else
      @state.sortOrder = 'is-descending'

    student_rows = _.map(sortData, @renderStudentRow)


    <div className='course-performance-wrap'>
      <span className='course-performance-header'>Performance Report</span>
      <BS.Panel className='course-performance-container'>
        <div className='-course-performance-group'>
          <div className='-course-performance-heading'>
            
          </div>
          <BS.Table className='-course-performance-table'>
            <thead>
              <tr>
                <th className='sortable student-name is-ascending' onClick={@sortClick}>Student</th>
                {headings}
              </tr>
              <tr>
                <th>Class Average</th>
                {averages}
              </tr>
            </thead>
            <tbody>
              {student_rows}
            </tbody>
          </BS.Table>
        </div>
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
