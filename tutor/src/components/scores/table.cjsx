React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ResizeListenerMixin} = require 'shared'

{Table, Column, ColumnGroup, Cell} = require 'fixed-data-table-2'

Time   = require '../time'
Icon = require '../icon'

SortingHeader    = require './sorting-header'
AverageInfo      = require './average-info'
AssignmentCell   = require './assignment-cell'
AssignmentHeader = require './assignment-header'
NameCell     = require './name-cell'

Router = require 'react-router'

FIRST_DATA_COLUMN = 2
COLUMN_WIDTH = 160

module.exports = React.createClass
  displayName: 'ScoresTable'

  mixins: [ResizeListenerMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired
    rows: React.PropTypes.array.isRequired
    headings: React.PropTypes.array.isRequired
    overall_average_score: React.PropTypes.number.isRequired
    sort: React.PropTypes.object.isRequired
    onSort: React.PropTypes.func.isRequired
    period_id: React.PropTypes.string
    periodIndex: React.PropTypes.number.isRequired
    displayAs: React.PropTypes.string.isRequired
    dataType: React.PropTypes.string
    isConceptCoach: React.PropTypes.bool.isRequired


  getInitialState: ->
    tableWidth: 0
    tableHeight: 0

  componentDidMount: -> @sizeTable()
  _resizeListener:   -> @sizeTable()
  sizeTable: ->
    @setState({tableWidth: @tableWidth(), tableHeight: @tableHeight()})

  tableWidth: ->
    windowEl = @_getWindowSize()
    tableContainer = ReactDOM.findDOMNode(@refs.tableContainer) or { currentStyle: {} }
    style = tableContainer.currentStyle or window.getComputedStyle(tableContainer)
    padding = parseInt(style.paddingLeft or 0) + parseInt(style.paddingRight or 0)
    tableContainerWidth = (tableContainer?.clientWidth or 0) - padding
    tableHorzSpacing = (document.body.clientWidth or 0) - tableContainerWidth
    # since table.clientWidth returns 0 on initial load in IE, include windowEl as a fallback
    Math.max(windowEl.width - tableHorzSpacing, tableContainerWidth)

  tableHeight: ->
    windowEl = @_getWindowSize()
    table = ReactDOM.findDOMNode(@refs.tableContainer) or {}
    bottomMargin = 140
    windowEl.height - (table.offsetTop or 0) - bottomMargin

  renderNoAssignments: ->
    <div className='course-scores-container' ref='tableContainer'>
      <span className='course-scores-notice'>No Assignments Yet</span>
    </div>


  OverallHeader: ->
    <div className='header-cell-wrapper overall-average'>
      <div className='overall-header-cell'>Overall</div>
      <div className='header-row'>
        <span>
          {"#{(@props.overall_average_score * 100).toFixed(0)}%"}
        </span>
      </div>
      <div className='header-row short'></div>
    </div>

  OverallCell: (props) ->
    avg = props.data[props.rowIndex].average_score or 0
    <Cell className="overall-cell">{(avg * 100).toFixed(0)}%</Cell>


  NameCell: (props) ->
    student = props.data[props.rowIndex]
    <div className="name-cell-wrapper">
      <NameCell key='name' {...@props} student={student} />
      <div className="overall-cell">
        {"#{(student.average_score * 100).toFixed(0)}%" if student.average_score?}
      </div>
    </div>


  NameHeader: (props) ->
    {sort, onSort, isConceptCoach} = @props
    <div className='header-cell-wrapper student-names'>
      <div className='overall-header-cell' />
      <div className='header-row'>
        Class Performance
        <AverageInfo isConceptCoach={isConceptCoach} />
      </div>
      <div className='header-row short'>
        <div className='scores-cell'>
          <SortingHeader
            sortKey='name'
            sortState={sort}
            onSort={onSort}
            dataType={'name'}
          >
              <div className='student-name'>Name and Student ID</div>
          </SortingHeader>
        </div>
      </div>

    </div>

  render: ->
    {rows, headings, isConceptCoach} = @props

    return @renderNoAssignments() if _.isEmpty(@props.rows)

    numAssignments = rows[0].data.length

    groupHeaderHeight = if isConceptCoach then 50 else 85
    <div className='course-scores-container' ref='tableContainer'>

      <Table
        rowHeight={50}
        height={@state.tableHeight}
        width={@state.tableWidth}
        headerHeight={150}
        rowsCount={rows.length}
      >
        <ColumnGroup fixed={true}>
          <Column
            fixed={true}
            width={COLUMN_WIDTH}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable=false
            cell={<@NameCell data={@props.rows} />}
            header={<@NameHeader />}
          />
          <Column
            fixed={true}
            width={COLUMN_WIDTH / 2}
            flexGrow={0}
            allowCellsRecycling={true}
            isResizable=false
            cell={<@OverallCell data={@props.rows} />}
            header={<@OverallHeader />}
          />
        </ColumnGroup>

        <ColumnGroup>
          {for columnIndex in [0...numAssignments]
            <Column
              key={columnIndex}
              width={COLUMN_WIDTH}
              flexGrow={0}
              allowCellsRecycling={true}
              cell={
                <AssignmentCell {...@props}
                  width={COLUMN_WIDTH}
                  data={@props.rows}
                  columnIndex={columnIndex} />
              }
              header={
                <AssignmentHeader {...@props}
                  data={@props.rows}
                  width={COLUMN_WIDTH}
                  columnIndex={columnIndex} />
              }
            />}
        </ColumnGroup>

      </Table>
    </div>
