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
    <th>{heading.title}</th>

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
    student_rows = _.map(performance.students, @renderStudentRow)

    <div className='performance-book'>
      <BS.Panel className='-course-performance-container'>
        <div className='-course-performance-group'>
          <div className='-course-performance-heading'>
            <h2>Performance Report</h2>
          </div>
          <BS.Table className='-course-performance-table'>
            <thead>
              <tr>
                <th>Student</th>
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
    <BS.Panel className='course-performance-container'>
      <LoadableItem
        id={courseId}
        store={PerformanceStore}
        actions={PerformanceActions}
        renderItem={-> <Performance courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {PerformanceShell, Performance}
