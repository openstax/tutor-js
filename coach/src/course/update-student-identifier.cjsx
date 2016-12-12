_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
{ ChangeStudentIdForm, MessageList } = require 'shared'
ENTER = 'Enter'

Course = require './model'
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

  onSubmit: (studentId) ->
    @props.course.updateStudentIdentifier(studentId)

  onCancel: ->
    Navigation.channel.emit('show.task', view: 'task')

  renderComplete: ->
    <h3 className="text-center">
      You have successfully updated your student identifier.
    </h3>

  render: ->
    return @renderComplete() if @state.requestSuccess

    <BS.Row>
      <ChangeStudentIdForm
        label="Enter your school issued ID:"
        title="Change your student ID"
        onCancel={@onCancel}
        onSubmit={@onSubmit}
        saveButtonLabel="Save"

        isBusy={@props.course.isBusy}
        studentId={@props.course.getStudentIdentifier()}
      >
        <MessageList messages={@props.course.errorMessages()} />
      </ChangeStudentIdForm>
    </BS.Row>

module.exports = UpdateStudentIdentifer
