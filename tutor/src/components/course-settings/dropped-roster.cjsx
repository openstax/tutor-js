React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
Icon = require '../icon'

{RosterStore, RosterActions} = require '../../flux/roster'
UnDropStudentLink = require './undrop-student'
StudentIdField = require './student-id-field'

DroppedRoster = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired

  renderStudentRow: (student) ->
    <tr key={student.id}>
      <td>{student.first_name}</td>
      <td>{student.last_name}</td>
      <td><StudentIdField studentId={student.id} courseId={@props.courseId} /></td>
      <td className="actions">
        <UnDropStudentLink
        id="drop-student-popover-#{student.id}"
        student={student} />
      </td>
    </tr>


  render: ->
    students = RosterStore.getDroppedStudents(@props.courseId, @props.period.id)
    return null if _.isEmpty(students)

    <div className='settings-section dropped-students'>
      <div>
        <span className='course-settings-subtitle tabbed'>Dropped Students</span>
      </div>
      <BS.Table striped bordered condensed hover className="roster">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th className="student-id">Student ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {for student in _.sortBy(students, 'last_name')
            @renderStudentRow(student)}
        </tbody>
      </BS.Table>
    </div>

module.exports = DroppedRoster
