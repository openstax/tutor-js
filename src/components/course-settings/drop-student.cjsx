React = require 'react'
BS = require 'react-bootstrap'

{RosterActions} = require '../../flux/roster'
Icon = require '../icon'
Name = require '../name'

module.exports = React.createClass
  displayName: 'DropStudentLink'
  propTypes:
    student: React.PropTypes.object.isRequired

  performDeletion: ->
    RosterActions.delete(@props.student.id)

  confirmPopOver: ->
    title = <span>Drop <Name {...@props.student} />?</span>
    <BS.Modal bsSize='small' title={title} {...@props}>
      <div className='modal-body'>
        <BS.Button onClick={@performDeletion} bsStyle="danger">
          <Icon type='ban' /> Drop
        </BS.Button>
      </div>
    </BS.Modal>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='ban' /> Drop</a>
    </BS.OverlayTrigger>
