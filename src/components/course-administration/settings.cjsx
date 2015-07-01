React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore, CourseActions} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
PeriodRoster = require './period-roster'
LoadableItem = require '../loadable-item'

module.exports = React.createClass
  displayName: 'CourseAdministration'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  renderPeriodRosters: (course) ->
    tabs = _.map course.periods, (period, index) ->
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <PeriodRoster period={period} courseId={course.id} />
      </BS.TabPane>

    <BS.TabbedArea defaultActiveKey=0>
      {tabs}
    </BS.TabbedArea>

  render: ->
    course = CourseStore.get(@props.courseId)
    <div className='course-administration form-horizontal'>
      <h2>Course: {course.name}</h2>
      <h2>Roster</h2>
      <LoadableItem
          id={course.id}
          store={RosterStore}
          actions={RosterActions}
          renderItem={=> @renderPeriodRosters(course)}
      />

    </div>
