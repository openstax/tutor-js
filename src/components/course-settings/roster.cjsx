React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
BindStoreMixin = require '../bind-store-mixin'

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
    tabs = _.map course.periods, (period, index) =>
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <PeriodRoster 
        period={period} 
        courseId={@props.courseId}
        activeTab={@getActivePeriod(@state.key, course.periods)} />
      </BS.TabPane>
    <BS.TabbedArea activeKey={@state.key} onSelect={@handleSelect}>
      <div className='period-edit-ui'>
        <AddPeriodLink courseId={@props.courseId} periods={course.periods} />
        <RenamePeriodLink
        courseId={@props.courseId}
        periods={course.periods}
        activeTab={@getActivePeriod(@state.key, course.periods)} />
        <DeletePeriodLink
        courseId={@props.courseId}
        periods={course.periods}
        activeTab={@getActivePeriod(@state.key, course.periods)}
        selectPreviousTab={@selectPreviousTab} />
      </div>
      <PeriodEnrollmentCode
      activeTab={@getActivePeriod(@state.key, course.periods)}
      periods={course.periods} />
      <div><span className='course-settings-subtitle tabbed'>Roster</span></div>
      {tabs}
    </BS.TabbedArea>
