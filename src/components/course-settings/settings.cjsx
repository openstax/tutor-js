React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

LoadableItem = require '../loadable-item'
{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
{StudentDashboardStore, StudentDashboardActions} = require '../../flux/student-dashboard'

Roster = require './roster'
TeacherRoster = require './teacher-roster'

module.exports = React.createClass
  displayName: 'CourseSettings'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = CourseStore.get(@props.courseId)

    <BS.Panel className='course-settings'>

      <span className='course-settings-title'>{course.name}</span>

      <div className="settings-section teachers">
        <LoadableItem
          id={@props.courseId}
          store={StudentDashboardStore}
          actions={StudentDashboardActions}
          renderItem={=> <TeacherRoster courseRoles={course.roles} courseId={@props.courseId}/>}
        />
      </div>

      <div className="settings-section periods">
        <LoadableItem
          id={@props.courseId}
          store={RosterStore}
          actions={RosterActions}
          renderItem={=> <Roster courseId={@props.courseId}/>}
        />
      </div>

    </BS.Panel>
