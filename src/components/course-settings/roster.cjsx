React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
BindStoreMixin = require '../bind-store-mixin'
PeriodRoster = require './period-roster'

AddPeriodLink = require './add-period'
RenamePeriodLink = require './rename-period'
#DeletePeriodLink = require './delete-period'

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

  render: ->
    course = CourseStore.get(@props.courseId)
    tabs = _.map course.periods, (period, index) =>
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <PeriodRoster period={period} courseId={@props.courseId} />
      </BS.TabPane> 
    <BS.TabbedArea activeKey={@state.key} onSelect={@handleSelect}>
      <div className='period-edit-ui'>
        <AddPeriodLink courseId={@props.courseId} periods={course.periods} />
        <RenamePeriodLink courseId={@props.courseId} periods={course.periods} activeTab={@state.key} />
      </div>
      <div><span className='course-settings-subtitle'>Roster</span></div>
      {tabs}
    </BS.TabbedArea>
