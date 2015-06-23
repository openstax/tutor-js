React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Router = require 'react-router'

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
    <th className={classes} title={heading.title} onClick={@sortClick}>{heading.title}</th>

  renderAverageCell: (heading) ->
    if heading.class_average
      classAverage = Math.round(heading.class_average)
    <th>{classAverage}</th>

  renderStudentRow: (student_data, i) ->
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

    {courseId} = @props
    linkParams = {courseId, id: cell.id}

    <td><Router.Link to='viewTask' params={linkParams}>{status}</Router.Link></td>

  renderHomeworkCell: (cell) ->
    {courseId} = @props
    linkParams = {courseId, id: cell.id}

    <td>
      <Router.Link to='viewTask' params={linkParams}>
        {cell.correct_exercise_count}/{cell.exercise_count}
      </Router.Link>
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

    if @state.isNameSort
      nameClass = @state.sortOrder

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
                <th className="#{nameClass} student-name" onClick={@sortClick}>Student</th>
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
