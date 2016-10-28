React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{CourseStore, CourseActions} = require '../../flux/course'
{CourseListingStore, CourseListingActions} = require '../../flux/course-listing'
{AsyncButton} = require 'shared'
{TutorInput} = require '../tutor-input'
Icon = require '../icon'
classnames = require 'classnames'


CloneCourse = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    course_name: @props.course.name
    showModal: false

  close: ->
    @setState({showModal: false})

  open: ->
    @setState({showModal: true})

  validate: (name) ->
    error = CourseStore.validateCourseName(name, @props.course.name)
    @setState({invalid: error?})
    error

  performUpdate: ->
    unless @state.invalid
      CourseListingActions.clone({courseId: @props.courseId, name: @state.course_name})
      CourseListingStore.once 'cloned', (newCourse) =>
        @close()
        @context.router.transitionTo("/courses/#{newCourse.id}/t/settings")


  renderForm: ->
    formClasses = classnames 'modal-body', 'teacher-edit-course-form', 'is-invalid-form': @state?.invalid
    if @state?.invalid
      disabled = true

    <BS.Modal
      {...@props}
      show={@state.showModal}
      onHide={@close}
      className='teacher-edit-course-modal'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>Clone Course</BS.Modal.Title>
      </BS.Modal.Header>

      <div className={formClasses} >
        <TutorInput
          label='Name of new course'
          name='course-name'
          default={@props.course.name}
          onChange={(val) => @setState(course_name: val)}
          validate={@validate}
          autofocus
        />
      </div>

      <div className='modal-footer'>
        <AsyncButton
          className='-edit-course-confirm'
          onClick={@performUpdate}
          isWaiting={CourseStore.isSaving(@props.courseId)}
          waitingText="Copying..."
          disabled={disabled}>
        Clone
        </AsyncButton>
      </div>
    </BS.Modal>

  render: ->
    <span className='-clone-course-link'>
      <BS.Button onClick={@open} bsStyle='link' className='edit-course'>
        <Icon type="clone" /> Clone Course
      </BS.Button>
      {@renderForm()}
    </span>

module.exports = CloneCourse
