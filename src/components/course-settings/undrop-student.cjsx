React = require 'react'
BS = require 'react-bootstrap'

{RosterActions, RosterStore} = require '../../flux/roster'
Icon = require '../icon'
Name = require '../name'

module.exports = React.createClass
  displayName: 'UnDropStudentLink'
  propTypes:
    student: React.PropTypes.object.isRequired
    id: React.PropTypes.string.isRequired

  performDeletion: ->
    if not @isUnDropping()
      RosterActions.undrop(@props.student.id)

  isUnDropping: ->
    RosterStore.isUnDropping(@props.student.id)

  confirmPopOver: ->
    title =
      if @isUnDropping()
        <span>
          <i className='fa fa-spinner fa-spin'/> Adding...
        </span>
      else
        <span>Add <Name {...@props.student} />?</span>
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
