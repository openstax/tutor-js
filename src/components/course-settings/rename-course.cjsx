React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{CourseStore, CourseActions} = require '../../flux/course'
{TutorInput} = require '../tutor-input'

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
      ref="input"
      label={@props.label}
      default={@props.default}
      required={true}
      onChange={@onChange}
      validate={@props.validate} />

module.exports = React.createClass
  displayName: 'RenameCourseName'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    course_name = "wa"

  updateCourseName:(courseId) ->
    newCourseName = @refs.updatePeriod.getDOMNode().value
    CourseActions.save(course_id: courseId)
    console.log({newCourseName})

  renderForm: ->
    formClasses = ['modal-body', 'teacher-edit-course-form']
    if @state?.invalid
      formClasses.push('is-invalid-form')
      disabled = true

    <BS.Modal
      {...@props}
      title={'Rename Course'}
      className='teacher-edit-course-modal'>

      <div className={formClasses.join(' ')}>
        <RenameCourseField
        label="Rename Course"
        name="course-name"
        default="@props.course.name"
        onChange={(val) => @setState(course_name: val)}
        validate={@validate}
        autofocus />
      </div>
    </BS.Modal>

  render: ->
    <BS.OverlayTrigger rootClose={true}
    trigger='click'
    placement='right' overlay={@renderForm()}>
      <a><i className='fa' />Change Course Name</a>
    </BS.OverlayTrigger>