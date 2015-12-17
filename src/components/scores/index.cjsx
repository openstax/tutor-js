React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Time   = require '../time'
ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
NameCell     = require './name-cell'
AbsentCell   = require './absent-cell'
ExternalCell = require './external-cell'
SortingHeader = require './sorting-header'
FixedDataTable = require 'fixed-data-table'
ConceptCoachCell = require './concept-coach-cell'

Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'

{CourseStore} = require '../../flux/course'
{ScoresStore, ScoresActions} = require '../../flux/scores'
{ScoresExportStore, ScoresExportActions} = require '../../flux/scores-export'
LoadableItem = require '../loadable-item'
ScoresExport = require './export'
{QuickStatsShell} = require './quick-external-stats'
{CoursePeriodsNavShell} = require '../course-periods-nav'
ResizeListenerMixin = require '../resize-listener-mixin'

# concept coach does not show due_at row or links on student names

# Index of first column that contains data
FIRST_DATA_COLUMN = 1
INITIAL_SORT = { key: 'name', asc: true }

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
    sortOrder: 'is-ascending'
    sortIndex: 0
    tableWidth: 0
    tableHeight: 0
    colDefaultWidth: 180
    colSetWidth: 180
    colResizeWidth: 180
    colResizeKey: 0
    sort: INITIAL_SORT
    resizeSpacerNeeded: true

  componentDidMount: ->
    @sizeTable()

  _resizeListener: ->
    @sizeTable()

  sizeTable: ->
    _.delay( =>
      @setState({tableWidth: @tableWidth(), tableHeight: @tableHeight(), resizeSpacerNeeded: false}) if @isMounted()
    , 100)


  tableWidth: (debug) ->
    table = React.findDOMNode(@refs.tableContainer)
    Math.max(400, table.clientWidth)

  tableHeight: ->
    windowEl = @_getWindowSize()
    table = React.findDOMNode(@refs.tableContainer)
    bottomMargin = 40
    Math.max(500, windowEl.height - table.offsetTop - bottomMargin)

  renderHeadingCell: (heading, i) ->
    i += FIRST_DATA_COLUMN # for the first/last name colums
    if heading.type is 'external'
      summary = <QuickStatsShell
        className='summary'
        id={"#{heading.plan_id}"}
        periodId={@state.period_id}/>

    else if heading.plan_id?
      linkParams =
        id: heading.plan_id
        periodIndex: @state.periodIndex
        courseId: @props.courseId

      review =
        <Router.Link
          to='reviewTaskPeriod'
          params={linkParams}
          className='review-plan btn btn-default'>
          Review
        </Router.Link>

    if heading.average
      summary = <span className='summary'>
        {(heading.average * 100).toFixed(1)}% avg
      </span>

    sortingHeader = <SortingHeader type={heading.type} sortKey={i}
      sortState={@state.sort} onSort={@changeSortingOrder} isConceptCoach={@props.isConceptCoach}
    >{heading.title}</SortingHeader>

    dueDates = <div><Time date={heading.due_at} format='shortest'/></div>
    customHeader = <div
      data-assignment-type="#{heading.type}"
      className='assignment-header-cell'>
      {dueDates unless @props.isConceptCoach}
      <div>
        {summary}
        {review}
      </div>
    </div>

    <ColumnGroup key={i} groupHeaderRenderer={-> sortingHeader} >

      <Column
        label={heading.title}
        headerRenderer={-> customHeader}
        cellRenderer={-> @cellData}
        width={@state.colSetWidth}
        flexGrow={1}
        allowCellsRecycling={true}
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
      <NameCell isConceptCoach={@props.isConceptCoach} key='name' {...props} />
    ]

    for task in student_data.data
      props.task = task
      columns.push switch task?.type or 'null'
        when 'null'     then <AbsentCell   key='absent'   {...props} />
        when 'reading'  then <ReadingCell  key='reading'  {...props} />
        when 'homework' then <HomeworkCell key='homework' {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
        when 'concept_coach' then <ConceptCoachCell  key='cc'  {...props} />
    columns

  renderNameHeader: ->
    emptyCell = <div className='blank' />
    studentIdHeader = <span className='student-id'>Student ID</span>
    header =
      <SortingHeader sortKey='name' sortState={@state.sort} onSort={@changeSortingOrder}>
        <span>Student Name</span>{studentIdHeader if @props.isConceptCoach}
      </SortingHeader>
    dueDateHeading = <div>Due Date</div>
    customHeader = <div className='assignment-header-cell'>
      {dueDateHeading unless @props.isConceptCoach}
      {header}
    </div>
    # student name column width
    if @props.isConceptCoach then nameColumns = 2 else nameColumns = 1
    <ColumnGroup fixed={true} groupHeaderRenderer={-> emptyCell}>
      <Column
        width={@state.colSetWidth * nameColumns}
        flexGrow={1}
        allowCellsRecycling={true}
        isResizable=false
        dataKey='0'
        fixed={true}
        cellRenderer={-> @cellData}
        headerRenderer={-> customHeader} />
    </ColumnGroup>

  changeSortingOrder: (key) ->
    asc = if @state.sort.key is key then not @state.sort.asc else false
    @setState(sort: { key, asc})

  isSortingByData: ->
    _.isNumber(@state.sort.key)

  selectPeriod: (period) ->
    newState = {period_id: period.id}
    newState.sort = INITIAL_SORT if @isSortingByData()
    @setState(newState)

  setPeriodIndex: (key) ->
    @setState({periodIndex: key + 1})

  getStudentRowData: ->
    # The period may not have been selected. If not, just use the 1st period
    {sort, period_id} = @state
    data = ScoresStore.get(@props.courseId)
    scores = if period_id
      _.findWhere(data, {period_id})
    else
      data[0] or throw new Error('BUG: No periods')

    sortData = _.sortBy(scores.students, (d) ->
      if _.isNumber(sort.key)
        index = sort.key - FIRST_DATA_COLUMN
        record = d.data[index]
        return 0 unless record
        switch record.type
          when 'reading' then record.status
          when 'homework', 'concept_coach' then record.correct_exercise_count or 0
      else
        (d.last_name or d.name).toLowerCase()
    )
    { headings: scores.data_headings, rows: if sort.asc then sortData else sortData.reverse() }

  onColumnResizeEndCallback: (colWidth, columnKey) ->
    @setState({colResizeWidth: colWidth, colResizeKey: columnKey})

  headerType: ->
    # height changes when dueDates row not in concept coach
    if @props.isConceptCoach then 47 else 92

  reviewInfoText: ->
    return null unless @props.isConceptCoach
    <span className='course-scores-note tab'>
      Click on a student's score to review their work.
    </span>

  render: ->
    {courseId, isConceptCoach} = @props
    {period_id, tableWidth, tableHeight} = @state

    data = @getStudentRowData()

    rowGetter = (rowIndex) =>
      @renderStudentRow(data.rows[rowIndex])

    periodNav =
      <CoursePeriodsNavShell
        handleSelect={@selectPeriod}
        handleKeyUpdate={@setPeriodIndex}
        intialActive={period_id}
        courseId={courseId}
        afterTabsItem={@reviewInfoText} />

    scoresExport = <ScoresExport courseId={courseId} className='pull-right'/>

    scoresTable =
      <Table
          onColumnResizeEndCallback={@onColumnResizeEndCallback}
          rowHeight={46}
          rowGetter={rowGetter}
          rowsCount={data.rows.length}
          width={tableWidth}
          height={tableHeight}
          headerHeight={@headerType()}
          groupHeaderHeight={50}>

          {@renderNameHeader()}
         {_.map(data.headings, @renderHeadingCell)}
       </Table>

    noAssignments = <span className='course-scores-notice'>No Assignments Yet</span>

    scoresNote =
      <div className='course-scores-note right'>
        Date indicates most recently submitted response.
      </div>

    if data.rows.length > 0 then students = true

    if @state.resizeSpacerNeeded then resizeSpacer = <span>&nbsp;</span>

    <div className='course-scores-wrap'>
        <span className='course-scores-title'>Student Scores</span>
        {scoresExport if students}
        {if isConceptCoach then scoresNote}
        {periodNav}
        <div className='course-scores-container' ref='tableContainer'>
          {resizeSpacer}
          {if students then scoresTable else noAssignments}
        </div>
    </div>


ScoresShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)
    <BS.Panel className='scores-report'>
      <LoadableItem
        id={courseId}
        store={ScoresStore}
        actions={ScoresActions}
        renderItem={-> <Scores courseId={courseId} isConceptCoach={course.is_concept_coach} />}
      />
    </BS.Panel>

module.exports = {ScoresShell, Scores}
