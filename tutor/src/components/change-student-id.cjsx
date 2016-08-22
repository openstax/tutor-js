_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'

LoadableItem = require './loadable-item'
{ ChangeStudentIdForm } = require 'shared'
{ TransitionActions, TransitionStore } = require '../flux/transition'
{ CourseStore, CourseActions } = require '../flux/course'
{ StudentIdStore, StudentIdActions } = require '../flux/student-id'

ERROR_MAP = {
  student_identifier_has_already_been_taken:
    'The provided student ID has already been used in this course. ' +
    'Please try again or contact your instructor.'
  blank_student_identifer:
    'The student ID field cannot be left blank. Please enter your student ID.'
}

module.exports = React.createClass
  contextTypes:
    router: React.PropTypes.func

  onCancel: -> @goBack()

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    CourseStore.on('course.loaded', @update)
    CourseActions.load(courseId)

  componentWillUnmount: ->
    StudentIdStore.off('student-id-saved', @saved)
    StudentIdStore.off('student-id-error', @update)

  update: ->
    @setState({})

  goBack: ->
    historyInfo = TransitionStore.getPrevious(@context.router)
    url = historyInfo.path or 'dashboard'
    @context.router.transitionTo(url)

  onSubmit: (newStudentId) ->
    {courseId} = @context.router.getCurrentParams()

    if not newStudentId
      StudentIdActions.addError(courseId, code:'blank_student_identifer')
      @setState({})
      return

    StudentIdStore.on('student-id-saved', @saved)
    StudentIdStore.on('student-id-error', @update)
    StudentIdActions.save(courseId, {
      student_identifier: newStudentId,
      id: courseId,
    })

  saved: ->
    @setState({success: true})
    _.delay(@goBack, 1500)

  renderErrors: ->
    {courseId} = @context.router.getCurrentParams()
    errors = StudentIdStore.getErrors(courseId)
    if errors?.length is 0 then return null

    errorLi = _.map errors, (error) ->
      <li key={error.code}>{ERROR_MAP[error.code]}</li>

    <div className="alert alert-danger">
      <ul className="errors">
        { errorLi }
      </ul>
    </div>

  renderSuccess: ->
    <BS.Panel bsStyle='primary' className="change-id-panel">
      <h3>You have successfully updated your student identifier.</h3>
      <a className="btn btn-default">
        <i className="fa fa-angle-left" /> Go Back
      </a>
    </BS.Panel>

  render: ->
    {courseId} = @context.router.getCurrentParams()
    if (@state?.success) then return @renderSuccess()

    studentId = CourseStore.getStudentId(courseId)

    <BS.Panel bsStyle='primary' className="change-id-panel">
      <BS.Row>
        <ChangeStudentIdForm
          label="Enter your school issued ID:"
          title="Change your student ID"
          onCancel={@onCancel}
          onSubmit={@onSubmit}
          saveButtonLabel="Save"

          isBusy={StudentIdStore.isSaving()}
          studentId={studentId}
        >
          {@renderErrors()}
        </ChangeStudentIdForm>
      </BS.Row>
    </BS.Panel>
