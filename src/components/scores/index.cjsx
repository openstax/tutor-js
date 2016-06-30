React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

ScoresTable = require './table'
TableFilters = require './table-filters'

Router = require 'react-router'

{CourseStore} = require '../../flux/course'
{ScoresStore, ScoresActions} = require '../../flux/scores'
{ScoresExportStore, ScoresExportActions} = require '../../flux/scores-export'
LoadableItem = require '../loadable-item'
ScoresExport = require './export'
{CoursePeriodsNavShell} = require '../course-periods-nav'
{ResizeListenerMixin} = require 'openstax-react-components'

Scores = React.createClass
  displayName: 'Scores'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    isConceptCoach: React.PropTypes.bool.isRequired

  mixins: [ResizeListenerMixin]

  getInitialState: ->
    sortedPeriods = CourseStore.getPeriods(@props.courseId)

    period_id: _.first(sortedPeriods).id
    periodIndex: 1
    sortIndex: 0
    tableWidth: 0
    tableHeight: 0
    colDefaultWidth: 160
    colSetWidth: 160
    colResizeWidth: 160
    colResizeKey: 0
    sort: { key: 'name', asc: true, dataType: 'score' }
    # index of first column that contains data
    firstDataColumn: 2
    displayAs: 'percentage'

  componentDidMount: ->
    @sizeTable()

  _resizeListener: ->
    @sizeTable()

  sizeTable: ->
    @setState({tableWidth: @tableWidth(), tableHeight: @tableHeight()})

  tableWidth: ->
    windowEl = @_getWindowSize()
    table = React.findDOMNode(@refs.tableContainer)
    # tableHorzSpacing is body width - table container width
    wrap = React.findDOMNode(@refs.scoresWrap)
    tableHorzSpacing = document.body.clientWidth - wrap.clientWidth
    # since table.clientWidth returns 0 on initial load in IE, include windowEl as a fallback
    Math.max(windowEl.width - tableHorzSpacing, table.clientWidth)

  tableHeight: ->
    windowEl = @_getWindowSize()
    table = React.findDOMNode(@refs.tableContainer)
    bottomMargin = 140
    windowEl.height - table.offsetTop - bottomMargin


  changeSortingOrder: (key, dataType) ->
    asc = if @state.sort.key is key then not @state.sort.asc else false
    @setState(sort: {key, asc, dataType})

  isSortingByData: ->
    _.isNumber(@state.sort.key)

  selectPeriod: (period) ->
    newState = {period_id: period.id}
    newState.sort = @state.sort if @isSortingByData()
    @setState(newState)

  setPeriodIndex: (key) ->
    @setState({periodIndex: key + 1})


  changeDisplayAs: (mode) ->
    @setState(displayAs: mode)

  percent: (num, total) ->
    Math.round((num / total) * 100)

  getStudentRowData: ->
    # The period may not have been selected. If not, just use the 1st period
    {sort, period_id, firstDataColumn, displayAs} = @state

    data = ScoresStore.get(@props.courseId)
    scores = if period_id
      _.findWhere(data, {period_id})
    else
      _.first(data)

    return {
      overall_average_score: 0
      headings: []
      rows: []
    } unless scores?

    sortData = _.sortBy(scores.students, (d) =>
      if _.isNumber(sort.key)
        index = sort.key - firstDataColumn
        record = d.data[index]
        return -1 unless record
        switch record.type
          when 'reading'
            progress =
              if record.is_late_work_accepted
                record.completed_step_count
              else
                record.completed_on_time_step_count
            @percent(progress, record.step_count) or 0
          when 'homework'
            switch sort.dataType
              when 'score'
                score =
                  if record.is_late_work_accepted
                    record.correct_exercise_count
                  else
                    record.correct_on_time_exercise_count
                if displayAs is 'number'
                  score or 0
                else
                  @percent(score, record.exercise_count) or 0
              when 'completed'
                progress =
                  if record.is_late_work_accepted
                    record.completed_exercise_count
                  else
                    record.completed_on_time_exercise_count
                @percent(progress, record.exercise_count) or 0
          when 'concept_coach'
            switch sort.dataType
              when 'score'
                score = record.correct_exercise_count
                if displayAs is 'number'
                  score or 0
                else
                  @percent(score, record.exercise_count) or 0
              when 'completed'
                progress = record.completed_exercise_count
                @percent(progress, record.exercise_count) or 0
      else
        (d.last_name or d.name).toLowerCase()
    )
    {
      overall_average_score: scores.overall_average_score or 0,
      headings: scores.data_headings,
      rows: if sort.asc then sortData else sortData.reverse()
    }


  render: ->
    {courseId, isConceptCoach} = @props
    {period_id, tableWidth, tableHeight} = @state

    data = @getStudentRowData()

    scoresExport = <ScoresExport courseId={courseId}/>

    scoresTable =
      <ScoresTable
      courseId={@props.courseId}
      data={data}
      width={tableWidth}
      height={tableHeight}
      sort={@state.sort}
      onSort={@changeSortingOrder}
      colSetWidth={@state.colSetWidth}
      period_id={@state.period_id}
      periodIndex={@state.periodIndex}
      firstDataColumn={@state.firstDataColumn}
      displayAs={@state.displayAs}
      dataType={@state.sort.dataType}
      isConceptCoach={isConceptCoach}
        />
    afterTabsItem = ->
      if isConceptCoach
        <span className='course-scores-note tab'>
          Click on a student's score to review their work.
          &nbsp
          Click the icon to see their progress completing the assignment.
        </span>
      else
        <span className='course-scores-note tab'>
          Scores reflect work submitted on time.
          &nbsp
          To accept late work, click the orange triangle.
        </span>
    tableFilters =
      <TableFilters
      displayAs={@state.displayAs}
      changeDisplayAs={@changeDisplayAs}
      />

    periodNav =
      <CoursePeriodsNavShell
        handleSelect={@selectPeriod}
        handleKeyUpdate={@setPeriodIndex}
        intialActive={period_id}
        courseId={courseId}
        afterTabsItem={afterTabsItem} />

    noAssignments = <span className='course-scores-notice'>No Assignments Yet</span>

    if data.rows.length > 0 then students = true

    <div className='course-scores-wrap' ref='scoresWrap'>
        <span className='course-scores-title'>Student Scores</span>
        {scoresExport if students}
        {tableFilters}
        {periodNav}
        <div className='course-scores-container' ref='tableContainer'>
          {if students then scoresTable else noAssignments}
        </div>
    </div>



ScoresShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)
    <BS.Panel className="scores-report">
      <LoadableItem
        id={courseId}
        store={ScoresStore}
        actions={ScoresActions}
        renderItem={-> <Scores courseId={courseId} isConceptCoach={course.is_concept_coach} />}
      />
    </BS.Panel>

module.exports = {ScoresShell, Scores}
