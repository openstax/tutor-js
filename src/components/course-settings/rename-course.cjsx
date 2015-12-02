React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{CourseStore, CourseActions} = require '../../flux/course'
AsyncButton = require '../buttons/async-button'
{TutorInput} = require '../tutor-input'
classnames = require 'classnames'

RenameCourseField = React.createClass

  displayName: 'RenameCourseField'
  propTypes:
    courseId: React.PropTypes.string
    label: React.PropTypes.string.isRequired
    name: React.PropTypes.string.isRequired
    default: React.PropTypes.string.isRequired
    onChange: React.PropTypes.func.isRequired
    autofocus: React.PropTypes.bool
    validate: React.PropTypes.func.isRequired

  componentDidMount: ->
    @refs.input.focus() if @props.autofocus
    @refs.input.cursorToEnd() if @props.autofocus

  onChange: (value) ->
    @props.onChange(value)

  render: ->
    <TutorInput
      ref='input'
      label={@props.label}
      default={@props.default}
      required={true}
      onChange={@onChange}
      validate={@props.validate}
      />

RenameCourse = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    course_name: @props.course.name

  validate: (name) ->
    error = CourseStore.validateCourseName(name, @props.course.name)
    @setState({invalid: error?})
    error

  performUpdate: ->
    unless @state.invalid
      CourseActions.save(@props.courseId, course: {name: @state.course_name})
      CourseStore.once 'saved', ->
        @refs.overlay.hide()

  renderForm: ->
    formClasses = classnames 'modal-body', 'teacher-edit-course-form', 'is-invalid-form': @state?.invalid
    if @state?.invalid
      disabled = true

    <BS.Modal
      {...@props}
      title={'Rename Course'}
      className='teacher-edit-course-modal'>

      <div className={formClasses} >
        <RenameCourseField
        label='Course Name'
        name='course-name'
        default={@props.course.name}
        onChange={(val) => @setState(course_name: val)}
        validate={@validate}
        autofocus />
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
    <BS.OverlayTrigger
    rootClose={true}
    trigger='click'
    ref='overlay'
    overlay={@renderForm()}>
        <BS.Button bsStyle='link' className='edit-course'>
          <i className='fa fa-pencil' /> Rename Course
        </BS.Button>
    </BS.OverlayTrigger>

module.exports = RenameCourse
