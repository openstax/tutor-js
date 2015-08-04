React = require 'react'
BS = require 'react-bootstrap'

{RosterActions} = require '../../flux/roster'
Icon = require '../icon'

module.exports = React.createClass
  displayName: 'DropStudentLink'
  propTypes:
    student: React.PropTypes.object.isRequired

  performDeletion: ->
    RosterActions.delete(@props.student.id)

  confirmPopOver: ->
    <BS.Popover title={"Drop #{@props.student.full_name}?"} {...@props}>
      <BS.Button onClick={@performDeletion} bsStyle="danger">
        <Icon type='ban' /> Drop
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='ban' /> Drop</a>
    </BS.OverlayTrigger>
