React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
BindStoreMixin = require '../bind-store-mixin'
Icon = require '../icon'

{StudentDashboardStore} = require '../../flux/student-dashboard'
{TeacherRosterStore, TeacherRosterActions} = require '../../flux/teacher-roster'
RemoveTeacherLink = require './remove-teacher'

module.exports = React.createClass
  displayName: 'TeacherRoster'
  mixins: [BindStoreMixin]
  bindStore: TeacherRosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired
    courseRoles: React.PropTypes.array.isRequired

  renderTeacherRow: (teacher) ->
    <tr key={teacher.id}>
      <td>{teacher.first_name}</td>
      <td>{teacher.last_name}</td>
      <td className="actions">
        <RemoveTeacherLink
        courseId={@props.courseId}
        courseRoles={@props.courseRoles}
        teacher={teacher} />
      </td>
    </tr>

  render: ->
    {courseId} = @props
    teachers = StudentDashboardStore.get(courseId).course.teachers or []
    <div className="teachers-table">
      <div><span className='course-settings-subtitle'>Instructors</span></div>
      <BS.Table striped bordered condensed hover className="roster">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {for teacher in _.sortBy(teachers, 'last_name')
            @renderTeacherRow(teacher)}
        </tbody>
      </BS.Table>
    </div>
