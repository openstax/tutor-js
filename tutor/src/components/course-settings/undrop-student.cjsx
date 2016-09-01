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
      RosterActions.undrop(studentId: @props.student.id)

  isUnDropping: ->
    RosterStore.isUnDropping(@props.student.id)

  errorMessage: (error) ->
    if error.code is 'student_identifier_has_already_been_taken'
      title: "Student ID is in use",
      body:
        <span>
          Unable to re-activate <Name {...@props.student} /> while
          another student is using the same student ID.
          Please update either this student's ID or change the other's
          so there is no longer a conflict
        </span>
    else
      title: "Error occured",
      body: "An error #{error.code} #{error.message} has occured"

  inProgressMessage: ->
    title: "Restoring student",
    body:  <span><Icon type='spinner' spin /> In progress</span>


  popOverMessage: ->
    title: <span>Add <Name {...@props.student} />?</span>
    body:
      <BS.Button className='-undrop-student' onClick={@performDeletion} bsStyle="success">
        <Icon type='plus' /> Add
      </BS.Button>

  confirmPopOver: ->
    error = RosterStore.getError(@props.student.id)
    {title, body} = if error
      @errorMessage(error)
    else if @isUnDropping()
      @inProgressMessage()
    else
      @popOverMessage()

    <BS.Popover title={title} {...@props} className='undrop-student'>
      {body}
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@confirmPopOver()}>
        <a><Icon type='plus' /> Add Back to Active Roster</a>
    </BS.OverlayTrigger>
