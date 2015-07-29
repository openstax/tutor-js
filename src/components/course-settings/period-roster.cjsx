React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{RosterStore, RosterActions} = require '../../flux/roster'
ChangePeriodLink  = require './change-period'



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
      </td>
    </tr>

  render: ->
    students = _.sortBy(RosterStore.getStudentsForPeriod(@props.courseId, @props.period.id), 'last_name')
    students = _.where(students, is_active: true)
    random_id_tooltip = <BS.Tooltip>Useful for talking securely about students over email.</BS.Tooltip>
    <div className="period">
      <BS.Table striped bordered condensed hover className="roster">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>
              Random ID
              <BS.OverlayTrigger placement='bottom' overlay={random_id_tooltip}>
                <i className="fa fa-question-circle" />
              </BS.OverlayTrigger>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {for student in students
            @renderStudentRow(student)}
        </tbody>
      </BS.Table>
    </div>
