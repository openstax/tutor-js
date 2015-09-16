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
Table = FixedDataTable.Table
Column = FixedDataTable.Column
ColumnGroup = FixedDataTable.ColumnGroup

Router = require 'react-router'


{ScoresStore, ScoresActions} = require '../../flux/scores'
{ScoresExportStore, ScoresExportActions} = require '../../flux/scores-export'
LoadableItem = require '../loadable-item'
ScoresExport = require './export'
{QuickStatsShell} = require './quick-external-stats'
{CoursePeriodsNavShell} = require '../course-periods-nav'
ResizeListenerMixin = require '../resize-listener-mixin'

# Index of first column that contains data
FIRST_DATA_COLUMN = 1
INITIAL_SORT = { key: 'name', asc: false }

Scores = React.createClass
  displayName: 'Scores'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [ResizeListenerMixin]

  getInitialState: ->
    period_id: null
    periodIndex: 1
    sortOrder: 'is-ascending'
    sortIndex: 0
    tableWidth: 0
    tableHeight: 0
    colDefaultWidth: 225
    colSetWidth: 225
    colResizeWidth: 225
    colResizeKey: 0
    sort: INITIAL_SORT

  componentDidMount: ->
    @sizeTable()

  _resizeListener: ->
    @sizeTable()

  sizeTable: ->
    @setState({tableWidth: @tableWidth(), tableHeight: @tableHeight()})

  tableWidth: ->
    table = React.findDOMNode(@refs.tableContainer)
    table.clientWidth

  tableHeight: ->
    windowEl = @_getWindowSize()
    table = React.findDOMNode(@refs.tableContainer)
    bottomMargin = 40
    windowEl.height - table.offsetTop - bottomMargin

  renderHeadingCell: (heading, i) ->
    i += FIRST_DATA_COLUMN # for the first/last name colums
    if heading.type is 'external'
      summary = <QuickStatsShell
        className='summary'
        id={"#{heading.plan_id}"}
        periodId={@state.period_id}/>
    else if heading.average
      summary = <span className='summary'>
        {heading.average.toFixed(1)}
      </span>

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

    sortingHeader = <SortingHeader type={heading.type} sortKey={i}
      sortState={@state.sort} onSort={@changeSortingOrder}
    >{heading.title}</SortingHeader>

    customHeader = <div
      data-assignment-type="#{heading.type}"
      className='assignment-header-cell'>
      <div>
        <Time date={heading.due_at} format='shortest'/>
      </div>
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
      <NameCell key='name' {...props} />
    ]
    for task in student_data.data
      props.task = task
      columns.push switch task?.type or 'null'
        when 'null'     then <AbsentCell   key='absent'   {...props} />
        when 'reading'  then <ReadingCell  key='reading'  {...props} />
        when 'homework' then <HomeworkCell key='homework' {...props} />
        when 'external' then <ExternalCell key='extern'   {...props} />
    columns

  renderNameHeader: ->
    emptyCell = <div className='blank' />
    header =
      <SortingHeader sortKey='name' sortState={@state.sort} onSort={@changeSortingOrder}>
        Class
      </SortingHeader>
    dueDateHeading = <div>Due Date</div>
    customHeader = <div className='assignment-header-cell'>
      {dueDateHeading}
      {header}
    </div>
    <ColumnGroup fixed={true} groupHeaderRenderer={-> emptyCell}>
      <Column
        width={@state.colSetWidth}
        flexGrow={1}
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
        switch d.data[index].type
          when 'homework' then d.data[index].correct_exercise_count
          when 'reading' then d.data[index].status
      else
        d.last_name.toLowerCase()
    )
    { headings: scores.data_headings, rows: if sort.asc then sortData else sortData.reverse() }

  render: ->
    {courseId} = @props
    {period_id, tableWidth, tableHeight} = @state

    data = @getStudentRowData()

    rowGetter = (rowIndex) =>
      @renderStudentRow(data.rows[rowIndex])

    <div className='course-scores-wrap'>
      <span className='course-scores-title'>Student Scores</span>
      <ScoresExport courseId={courseId} className='pull-right'/>
      <CoursePeriodsNavShell
        handleSelect={@selectPeriod}
        handleKeyUpdate={@setPeriodIndex}
        intialActive={period_id}
        courseId={courseId} />
      <div className='course-scores-container' ref='tableContainer'>
        <Table
          onColumnResizeEndCallback={(colWidth, columnKey) => @setState({colResizeWidth: colWidth, colResizeKey: columnKey})}
          rowHeight={46}
          rowGetter={rowGetter}

          rowsCount={data.rows.length}
          width={tableWidth}
          height={tableHeight}
          headerHeight={92}
          groupHeaderHeight={50}>

          {@renderNameHeader()}
          {_.map(data.headings, @renderHeadingCell)}

        </Table>

      </div>
    </div>


ScoresShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <BS.Panel className='scores-report'>
      <LoadableItem
        id={courseId}
        store={ScoresStore}
        actions={ScoresActions}
        renderItem={-> <Scores courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {ScoresShell, Scores}
