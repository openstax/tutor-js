React = require 'react'
BS = require 'react-bootstrap'

{RosterStore, RosterActions} = require '../../flux/roster'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  propTypes:
    period: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  renderStudentRow: (student) ->
    <tr key={student.id}>
      <td>{student.full_name}</td>
      <td>{student.id}</td>
      <td>???</td>
      <td>???</td>
    </tr>

  render: ->
    <div className="period">
      <h3>Period: {@props.period.name}</h3>
      <BS.Row>
        <BS.Col sm=2>
          <BS.Button block>
            <i className='fa fa-plus'></i>
            Add Student</BS.Button>
        </BS.Col>
        <BS.Col smOffset=8 sm=2>
          <BS.Button block bsStyle='danger' className='btn-flat'>
            <i className='fa fa-trash' />
            Delete Period
            </BS.Button>
        </BS.Col>
      </BS.Row>
      <BS.Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Tutor ID</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {for student in RosterStore.getStudentsForPeriod(@props.courseId, @props.period.id)
            @renderStudentRow(student)}
        </tbody>
      </BS.Table>
    </div>
