React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
BindStoreMixin = require '../bind-store-mixin'
PeriodRoster = require './period-roster'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = CourseStore.get(@props.courseId)
    tabs = _.map course.periods, (period, index) =>
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <PeriodRoster period={period} courseId={@props.courseId} />
      </BS.TabPane>

    <BS.TabbedArea defaultActiveKey=0>
      {tabs}
    </BS.TabbedArea>
