React = require 'react'
BS = require 'react-bootstrap'

{RosterActions} = require '../../flux/roster'
Icon = require '../icon'
Name = require '../name'

module.exports = React.createClass
  displayName: 'UnDropStudentLink'
  propTypes:
    student: React.PropTypes.object.isRequired
    id: React.PropTypes.string.isRequired

  performDeletion: ->
    RosterActions.delete(@props.student.id)

  confirmPopOver: ->
    title = <span>Add <Name {...@props.student} />?</span>
    <BS.Popover title={title} {...@props}>
      <BS.Button onClick={@performDeletion} bsStyle="success">
        <Icon type='plus' /> Add
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='plus' /> Add Back to Active Roster</a>
    </BS.OverlayTrigger>
