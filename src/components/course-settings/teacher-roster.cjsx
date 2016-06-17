React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
Icon = require '../icon'
BindStoreMixin = require '../bind-store-mixin'
RemoveTeacherLink = require './remove-teacher'
{RosterStore, RosterActions} = require '../../flux/roster'

module.exports = React.createClass
  displayName: 'TeacherRoster'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired
    courseRoles: React.PropTypes.array.isRequired
    store: React.PropTypes.object.isRequired

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
    {courseId, store} = @props
    teachers = store.get(courseId).teachers or []
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
