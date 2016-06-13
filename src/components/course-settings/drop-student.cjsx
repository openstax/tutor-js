React = require 'react'
BS = require 'react-bootstrap'

{RosterActions, RosterStore} = require '../../flux/roster'
Icon = require '../icon'
Name = require '../name'

module.exports = React.createClass
  displayName: 'DropStudentLink'
  propTypes:
    student: React.PropTypes.object.isRequired

  performDeletion: ->
    if not @isDeleting()
      RosterActions.delete(@props.student.id)

  isDeleting: ->
    RosterStore.isDeleting(@props.student.id)

  confirmPopOver: ->
    title =
      if @isDeleting()
        <span>
          <i className='fa fa-spinner fa-spin'/> Dropping...
        </span>
      else
        <span>Drop <Name {...@props.student} />?</span>
    <BS.Popover title={title} {...@props}>
      <BS.Button className='-drop-student' onClick={@performDeletion} bsStyle="danger">
        <Icon type='ban' /> Drop
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='ban' /> Drop</a>
    </BS.OverlayTrigger>
