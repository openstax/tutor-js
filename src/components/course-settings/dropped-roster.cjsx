React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
Icon = require '../icon'

{RosterStore, RosterActions} = require '../../flux/roster'
UnDropStudentLink = require './undrop-student'

module.exports = React.createClass
  displayName: 'DroppedRoster'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired

  renderStudentRow: (student) ->
    <tr key={student.id}>
      <td>{student.first_name}</td>
      <td>{student.last_name}</td>
      <td className="actions">
        <UnDropStudentLink
        id="drop-student-popover-#{student.id}"
        student={student} />
      </td>
    </tr>

  hasDroppedStudents: ->
    id = @props.activeTab.id
    students = RosterStore.getDroppedStudents(@props.courseId, id)
    students.length > 0

  render: ->
    students = RosterStore.getDroppedStudents(@props.courseId, @props.period.id)
    studentsTable =
      <div>
        <div>
          <span className='course-settings-subtitle tabbed'>Dropped Students</span>
        </div>
        <BS.Table striped bordered condensed hover className="roster">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {for student in _.sortBy(students, 'last_name')
              @renderStudentRow(student)}
          </tbody>
        </BS.Table>
      </div>
    empty = <div />

    <div className="period">
      {if @hasDroppedStudents() then studentsTable else empty}
    </div>
