_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
{AsyncButton} = require 'openstax-react-components'
ENTER = 'Enter'

Course = require './model'
ErrorList = require './error-list'
RequestStudentId = require './request-student-id'
Navigation = require '../navigation/model'

UpdateStudentIdentifer = React.createClass
  componentWillMount: ->
    course = @props.course or
      User.getCourse(@props.collectionUUID) or
      new Course({ecosystem_book_uuid: @props.collectionUUID})
    course.channel.on('change', @onCourseChange)
    @setState({course})

  componentWillUnmount: ->
    @state.course.channel.off('change', @onCourseChange)

  onCourseChange: ->
    if @props.course.student_identifier
      @setState(requestSuccess: true)
      delete @props.course.student_identifier
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@onCancel, 1500)
    @forceUpdate()

  propTypes:
    course: React.PropTypes.instanceOf(Course).isRequired

  startConfirmation: ->
    @props.course.confirm(@refs.input.getValue())

  onKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER

  onConfirmKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER

  cancelConfirmation: ->
    @props.course.resetToBlankState()

  onSubmit: (studentId) ->
    @props.course.updateStudent(student_identifier: studentId)

  onCancel: ->
    Navigation.channel.emit('show.task', view: 'task')

  renderComplete: ->
    <h3 className="text-center">
      You have successfully updated your student identifier.
    </h3>

  render: ->
    return @renderComplete() if @state.requestSuccess

    <BS.Row>
      <RequestStudentId
        label="Enter your school issued ID:"
        title="Change your student ID"
        onCancel={@onCancel}
        onSubmit={@onSubmit}
        saveButtonLabel="Save"
        canCancel={true}
        {...@props}
      />
    </BS.Row>

module.exports = UpdateStudentIdentifer
