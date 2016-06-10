React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

LoadableItem = require '../loadable-item'
{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'

Roster = require './roster'
TeacherRoster = require './teacher-roster'

RenameCourse = require './rename-course'
SetTimezone = require './set-timezone'

module.exports = React.createClass
  displayName: 'CourseSettings'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = CourseStore.get(@props.courseId)

    <BS.Panel className='course-settings'>

      <div className='course-settings-title'>{course.name}
        <RenameCourse courseId={@props.courseId}  course={course}/>
      </div>
      <div className='course-settings-timezone'>{CourseStore.getTimezone(@props.courseId)}
        <SetTimezone courseId={@props.courseId}/>
      </div>

      <div className="settings-section teachers">
        <LoadableItem
          id={@props.courseId}
          store={RosterStore}
          actions={RosterActions}
          renderItem={=> <TeacherRoster
            store={RosterStore}
            courseRoles={course.roles}
            courseId={@props.courseId}/>}
        />
      </div>

      <LoadableItem
        id={@props.courseId}
        store={RosterStore}
        actions={RosterActions}
        renderItem={=> <Roster courseId={@props.courseId}/>}
      />

    </BS.Panel>
