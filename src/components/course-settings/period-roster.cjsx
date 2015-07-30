React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
Icon = require '../icon'

{RosterStore, RosterActions} = require '../../flux/roster'
ChangePeriodLink  = require './change-period'
DeleteStudentLink = require './delete-student'
AddStudentButton  = require './add-student'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired

  renderStudentRow: (student) ->
    <tr key={student.id}>
      <td>{student.first_name}</td>
      <td>{student.last_name}</td>
      <td>{student.deidentifier}</td>
      <td className="actions">
        <ChangePeriodLink courseId={@props.courseId} student={student} />
        <DeleteStudentLink student={student} />
      </td>
    </tr>

  render: ->
    students = RosterStore.getActiveStudentsForPeriod(@props.courseId, @props.period.id)
    <div className="period">
      <BS.Row>
        <BS.Col sm=2>
          <AddStudentButton {...@props} />
        </BS.Col>
       </BS.Row>
      <BS.Table striped bordered condensed hover className="roster">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>
              Random ID <Icon type='question-circle'
                tooltip='Useful for talking securely about students over email.' />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {for student in _.sortBy(students, 'last_name')
            @renderStudentRow(student)}
        </tbody>
      </BS.Table>
    </div>
