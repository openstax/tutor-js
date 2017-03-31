React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

Router = require '../../helpers/router'
ScoresTable = require './table'
TableFilters = require './table-filters'
NoPeriods = require '../no-periods'
merge = require 'lodash/merge'
{CourseStore} = require '../../flux/course'
{ScoresStore, ScoresActions} = require '../../flux/scores'
{ScoresExportStore, ScoresExportActions} = require '../../flux/scores-export'
LoadableItem = require '../loadable-item'
ScoresExport = require './export'
{CoursePeriodsNavShell} = require '../course-periods-nav'
{default: TourRegion} = require '../tours/region';
BindStoreMixin = require '../bind-store-mixin'

StudentDataSorter = require './student-data-sorter'

Scores = React.createClass
  displayName: 'Scores'

  mixins: [BindStoreMixin]
  bindStore: ScoresStore
  bindUpdate: -> @updateStudentData()

  propTypes:
    courseId: React.PropTypes.string.isRequired
    isConceptCoach: React.PropTypes.bool.isRequired

  getInitialState: ->
    sortedPeriods = CourseStore.getPeriods(@props.courseId)
    period_id: _.first(sortedPeriods).id unless _.isEmpty(sortedPeriods)
    periodIndex: 0
    sortIndex: 0
    sort: { key: 'name', asc: true, dataType: 'score' }
    displayAs: 'percentage'

  componentWillMount:  -> @updateStudentData()
  changeSortingOrder: (key, dataType) ->
    asc = if @state.sort.key is key then (not @state.sort.asc) else false
    @updateStudentData({sort: {key, asc, dataType}})

  selectPeriod: (period, key) ->
    @updateStudentData({period_id: period.id, periodIndex: key})

  changeDisplayAs: (mode) -> @updateStudentData({displayAs: mode})

  updateStudentData: (nextState) ->
    state = merge({}, @state, nextState)

    scores = ScoresStore.getEnrolledScoresForPeriod(@props.courseId, state.period_id)
    rows = if scores then _.sortBy( scores.students, StudentDataSorter(state) ) else null
    if scores?
      @setState(_.extend(state, {
        overall_average_score: scores.overall_average_score or 0,
        headings: scores.data_headings,
        rows: if state.sort.asc then rows else rows.reverse()
      }))
    else
      @setState(_.extend(state, {overall_average_score: 0, headings: [], rows: [] }))

  renderAfterTabsItem: ->
    if @props.isConceptCoach
      <span className='course-scores-note tab'>
        Click on a student’s score to review their work.
        &nbsp
        Click the icon to see their progress completing the assignment.
      </span>
    else
      <span className='course-scores-note tab'>
        Scores reflect work submitted on time.
        &nbsp
        To accept late work, click the orange triangle.
      </span>

  render: ->
    {courseId} = @props
    {period_id} = @state

    if _.isEmpty(CourseStore.getPeriods(courseId))
      return <NoPeriods courseId={courseId} />


    <div className='course-scores-wrap' ref='scoresWrap'>
        <span className='course-scores-title'>Student Scores</span>
        {<ScoresExport courseId={courseId}/> unless _.isEmpty(@state.rows)}
        <div className='course-nav-container'>
          <CoursePeriodsNavShell
            handleSelect={@selectPeriod}
            intialActive={period_id}
            courseId={courseId}
            afterTabsItem={@renderAfterTabsItem()}
          />
          <TableFilters
            displayAs={@state.displayAs}
            changeDisplayAs={@changeDisplayAs}
          />
        </div>
        <TourRegion id="scores" courseId={courseId}>
          <ScoresTable
            courseId={courseId}
            overall_average_score={@state.overall_average_score}
            rows={@state.rows}
            headings={@state.headings}
            sort={@state.sort}
            onSort={@changeSortingOrder}
            colSetWidth={@state.colSetWidth}
            period_id={@state.period_id}
            periodIndex={@state.periodIndex}
            displayAs={@state.displayAs}
            dataType={@state.sort.dataType}
            isConceptCoach={@props.isConceptCoach}
          />
        </TourRegion>
    </div>



ScoresShell = React.createClass

  render: ->
    {courseId} = Router.currentParams()
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
