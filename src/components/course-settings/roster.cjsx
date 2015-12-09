React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
BindStoreMixin = require '../bind-store-mixin'
NoPeriods = require '../no-periods'

{CourseStore, CourseActions} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'

PeriodRoster = require './period-roster'
PeriodEnrollmentCode = require './period-enrollment-code'

AddPeriodLink = require './add-period'
RenamePeriodLink = require './rename-period'
DeletePeriodLink = require './delete-period'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    key: 0

  handleSelect: (key) ->
    @setState({key})

  getActivePeriod: (active, periods) ->
    for period, i in periods
      if i is active
        name = period.name
        id = period.id
    {name, id}

  selectPreviousTab: ->
    if @state.key > 0
      previous = @state.key - 1
    else
      previous = 0
    @handleSelect(previous)

  render: ->
    course = CourseStore.get(@props.courseId)
    {is_concept_coach} = course
    periods = course.periods.length > 0
    tabs = _.map course.periods, (period, index) =>
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <PeriodRoster
        period={period}
        courseId={@props.courseId}
        activeTab={@getActivePeriod(@state.key, course.periods)}
        isConceptCoach={is_concept_coach} />
      </BS.TabPane>
    enrollmentButton =
      <PeriodEnrollmentCode
      activeTab={@getActivePeriod(@state.key, course.periods)}
      periods={course.periods} />
    renameButton =
      <RenamePeriodLink
      courseId={@props.courseId}
      periods={course.periods}
      activeTab={@getActivePeriod(@state.key, course.periods)} />
    deleteButton =
      <DeletePeriodLink
      courseId={@props.courseId}
      periods={course.periods}
      activeTab={@getActivePeriod(@state.key, course.periods)}
      selectPreviousTab={@selectPreviousTab} />
    noPeriodMessage =
      <NoPeriods noPanel={true} />

    <BS.TabbedArea activeKey={@state.key} onSelect={@handleSelect}>
      <div className='period-edit-ui'>
        <AddPeriodLink courseId={@props.courseId} periods={course.periods} />
        {renameButton if periods}
        {deleteButton if periods}
      </div>
      {enrollmentButton if periods and is_concept_coach}
      <div><span className='course-settings-subtitle tabbed'>Roster</span></div>
      {noPeriodMessage unless periods}
      {tabs}
    </BS.TabbedArea>
