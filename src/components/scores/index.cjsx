React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

HSTable = require './table-hs'
CCTable = require './table-cc'

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
    period_id: null
    periodIndex: 1
    sortIndex: 0
    tableWidth: 0
    tableHeight: 0
    colDefaultWidth: 180
    colSetWidth: 180
    colResizeWidth: 180
    colResizeKey: 0
    sort: { key: 'name', asc: true }
    # index of first column that contains data
    firstDataColumn: 1

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
    bottomMargin = 40
    windowEl.height - table.offsetTop - bottomMargin


  changeSortingOrder: (key) ->
    asc = if @state.sort.key is key then not @state.sort.asc else false
    @setState(sort: {key, asc})

  isSortingByData: ->
    _.isNumber(@state.sort.key)

  selectPeriod: (period) ->
    newState = {period_id: period.id}
    newState.sort = @state.sort if @isSortingByData()
    @setState(newState)

  setPeriodIndex: (key) ->
    @setState({periodIndex: key + 1})


  getStudentRowData: ->
    # The period may not have been selected. If not, just use the 1st period
    {sort, period_id, firstDataColumn} = @state
    data = ScoresStore.get(@props.courseId)
    scores = if period_id
      _.findWhere(data, {period_id})
    else
      data[0]

    sortData = _.sortBy(scores.students, (d) ->
      if _.isNumber(sort.key)
        index = sort.key - firstDataColumn
        record = d.data[index]
        return 0 unless record
        switch record.type
          when 'reading' then record.status
          when 'homework', 'concept_coach' then record.correct_exercise_count or 0
      else
        (d.last_name or d.name).toLowerCase()
    )
    { headings: scores.data_headings, rows: if sort.asc then sortData else sortData.reverse() }


  render: ->
    {courseId, isConceptCoach} = @props
    {period_id, tableWidth, tableHeight} = @state

    data = @getStudentRowData()

    scoresExport = <ScoresExport courseId={courseId} className='pull-right'/>

    if isConceptCoach
      scoresTable =
        <CCTable
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
          />
      afterTabsItem = ->
        <span className='course-scores-note tab'>
          Click on a student's score to review their work.
        </span>
      tableMarginNote =
        <div className='course-scores-note right'>
          Date indicates most recently submitted response.
        </div>
    else
      scoresTable =
        <HSTable
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
          />
      afterTabsItem = -> null
      tableMarginNote = null


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
        {tableMarginNote}
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
    tableClass = if course.is_concept_coach then 'cc' else 'hs'
    <BS.Panel className="scores-report #{tableClass}">
      <LoadableItem
        id={courseId}
        store={ScoresStore}
        actions={ScoresActions}
        renderItem={-> <Scores courseId={courseId} isConceptCoach={course.is_concept_coach} />}
      />
    </BS.Panel>

module.exports = {ScoresShell, Scores}
