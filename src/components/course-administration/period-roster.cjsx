React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  propTypes:
    period: React.PropTypes.object.isRequired

  render: ->
    <div className="period">
      <h3>{@props.period.name}</h3>
      <BS.Row>
        <BS.Col sm=2>
          <BS.Button block>
            <i className='fa fa-plus'></i>
            Add Student</BS.Button>
        </BS.Col>
        <BS.Col smOffset=8 sm=2>
          <BS.Button block bsStyle='danger'>
            <i className='fa fa-trash'></i>
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
        </tbody>
      </BS.Table>
    </div>
