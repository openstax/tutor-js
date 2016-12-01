React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{CourseStore, CourseActions} = require '../../flux/course'
{AsyncButton} = require 'shared'
{TutorInput} = require '../tutor-input'
classnames = require 'classnames'


RenameCourse = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired

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
      CourseActions.save(@props.courseId, name: @state.course_name)
      CourseStore.once 'saved', =>
        @close()

  renderForm: ->
    formClasses = classnames 'modal-body', 'teacher-edit-course-form', 'is-invalid-form': @state?.invalid
    if @state?.invalid
      disabled = true

    <BS.Modal
      show={@state.showModal}
      onHide={@close}
      className='teacher-edit-course-modal'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>Rename Course</BS.Modal.Title>
      </BS.Modal.Header>

      <div className={formClasses} >
        <TutorInput
          label='Course Name'
          name='course-name'
          default={@props.course.name}
          onChange={(val) => @setState(course_name: val)}
          validate={@validate}
          autoFocus
        />
      </div>

      <div className='modal-footer'>
        <AsyncButton
          className='-edit-course-confirm'
          onClick={@performUpdate}
          isWaiting={CourseStore.isSaving(@props.courseId)}
          waitingText="Saving..."
          disabled={disabled}>
        Rename
        </AsyncButton>
      </div>
    </BS.Modal>

  render: ->
    <BS.Button onClick={@open} bsStyle='link' className='control edit-course'>
      <i className='fa fa-pencil' /> Rename Course
      {@renderForm()}
    </BS.Button>


module.exports = RenameCourse
