React = require 'react'
BS = require 'react-bootstrap'
{RosterActions} = require '../../flux/roster'

module.exports = React.createClass
  displayName: 'DeleteStudentLink'
  propTypes:
    student: React.PropTypes.object.isRequired

  performDeletion: ->
    RosterActions.delete(@props.student.id)

  confirmPopOver: ->
    <BS.Popover title={"Delete #{@props.student.full_name}?"} {...@props}>
      <BS.Button onClick={@performDeletion} bsStyle="danger">
        <i className='fa fa-trash' /> Delete
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><i className='fa fa-trash' /> Delete</a>
    </BS.OverlayTrigger>
