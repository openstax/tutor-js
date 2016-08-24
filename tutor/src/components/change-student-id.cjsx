_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'

LoadableItem = require './loadable-item'
{ ChangeStudentIdForm } = require 'shared'
{ TransitionActions, TransitionStore } = require '../flux/transition'
{ CourseStore, CourseActions } = require '../flux/course'
{ StudentIdStore, StudentIdActions, ERROR_MAP } = require '../flux/student-id'
Icon = require './icon'

module.exports = React.createClass
  contextTypes:
    router: React.PropTypes.func

  onCancel: -> @goBack()

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    CourseStore.once('course.loaded', @update)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @update)
    StudentIdStore.off('student-id-saved', @saved)
    StudentIdStore.off('student-id-error', @update)

  update: ->
    @setState({})

  goBack: ->
    {courseId} = @context.router.getCurrentParams()

    historyInfo = TransitionStore.getPrevious(@context.router)
    url = historyInfo.path or 'dashboard'
    @context.router.transitionTo(url)

  onSubmit: (newStudentId) ->
    {courseId} = @context.router.getCurrentParams()

    StudentIdActions.validate(courseId, newStudentId)

    if StudentIdStore.getErrors(courseId).length
      @update()
      return

    @setState({curId: newStudentId})
    StudentIdStore.once('student-id-saved', @saved)
    StudentIdStore.once('student-id-error', @update)
    StudentIdActions.save(courseId, {
      student_identifier: newStudentId,
      id: courseId,
    })


  saved: ->
    {courseId} = @context.router.getCurrentParams()
    CourseActions.load(courseId)

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
        <Icon type="angle-left" /> Go Back
      </a>
    </BS.Panel>

  render: ->
    if (@state?.success) then return @renderSuccess()

    {courseId} = @context.router.getCurrentParams()
    studentId = @state?.curId or CourseStore.getStudentId(courseId)

    <BS.Panel bsStyle='primary' className="change-id-panel">
      <BS.Row>
        <ChangeStudentIdForm
          label="Enter your school issued ID:"
          title="Change your student ID"
          onCancel={@onCancel}
          onSubmit={@onSubmit}
          saveButtonLabel="Save"

          isBusy={StudentIdStore.isSaving(courseId)}
          studentId={studentId}
        >
          {@renderErrors()}
        </ChangeStudentIdForm>
      </BS.Row>
    </BS.Panel>
