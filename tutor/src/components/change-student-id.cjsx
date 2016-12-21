_ = require 'lodash'
React = require 'react'
BS = require 'react-bootstrap'

Router = require '../helpers/router'
LoadableItem = require './loadable-item'
{ ChangeStudentIdForm } = require 'shared'
{ TransitionActions, TransitionStore } = require '../flux/transition'
{ CourseStore, CourseActions } = require '../flux/course'
{ StudentIdStore, StudentIdActions, ERROR_MAP } = require '../flux/student-id'
Icon = require './icon'

ChangeStudentId = React.createClass

  onCancel: -> @goBack()

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    {courseId} = Router.currentParams()
    CourseStore.once('course.loaded', @update)

  componentWillUnmount: ->
    CourseStore.off('course.loaded', @update)
    StudentIdStore.off('student-id-saved', @saved)
    StudentIdStore.off('student-id-error', @update)

  update: ->
    @setState({})

  goBack: ->
    {courseId} = Router.currentParams()
    historyInfo = TransitionStore.getPrevious()
    @context.router.transitionTo( historyInfo?.path or
      Router.makePathname( 'dashboard', Router.currentParams() )
    )

  onSubmit: (newStudentId) ->
    {courseId} = Router.currentParams()

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
    {courseId} = Router.currentParams()
    CourseActions.load(courseId)

    @setState({success: true})
    _.delay(@goBack, 1500)

  renderErrors: ->
    {courseId} = Router.currentParams()
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

    {courseId} = Router.currentParams()
    studentId = @state?.curId or CourseStore.getStudentId(courseId)

    <BS.Panel bsStyle='primary' className="change-id-panel">
      <BS.Row>
        <ChangeStudentIdForm
          label="Enter your school-issued ID that is used for granding:"
          title="Update your student ID"
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

module.exports = ChangeStudentId
