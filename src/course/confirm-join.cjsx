React = require 'react'
BS = require 'react-bootstrap'
ENTER = 'Enter'
RequestStudentId = require './request-student-id'

Course = require './model'
ErrorList = require './error-list'
{AsyncButton} = require 'openstax-react-components'

ConfirmJoin = React.createClass

  propTypes:
    title: React.PropTypes.string.isRequired
    course: React.PropTypes.instanceOf(Course).isRequired
    optionalStudentId: React.PropTypes.bool

  onCancel: ->
    @props.course.resetToBlankState()

  startConfirmation: (studentId) ->
    @props.course.confirm(studentId)

  render: ->
    label = if @props.optionalStudentId
      <span>
        Update school issued ID<br/>
        (<i>leave blank to leave unchanged</i>):
        </span>
    else
      "Enter your school issued ID:"

    <BS.Row>
      <RequestStudentId
        onCancel={@onCancel}
        onSubmit={@startConfirmation}
        saveButtonLabel="Confirm"
        label={label}
        onConfirmationCancel={@onCancel}
        {...@props}
      />
    </BS.Row>

module.exports = ConfirmJoin
