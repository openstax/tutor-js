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

  renderHeadingCell: (heading) ->
    <th className='sortable' title={heading.title} onClick={@sortClick}>{heading.title}</th>

  renderAverageCell: (heading) ->
    if heading.class_average
      classAverage = Math.round(heading.class_average)
    <th>{classAverage}</th>

  renderStudentRow: (student_data) ->
    cells = _.map(student_data.data, @renderStudentCell)
    <tr>
      <td>{student_data.name}</td>
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
    <td>{cell.correct_exercise_count}/{cell.exercise_count}</td>

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
          Coming Soon
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
