React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment-timezone'

_ = require 'underscore'
{CourseStore, CourseActions} = require '../../flux/course'
{AsyncButton} = require 'shared'
{TutorRadio} = require '../tutor-input'
classnames = require 'classnames'

{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'
S = require '../../helpers/string'

PropTypes =
  Timezone: React.PropTypes.oneOf(_.values(TimeHelper.getTimezones()))


TimezonePreview = React.createClass
  displayName: 'TimezonePreview'
  timezone: PropTypes.Timezone.isRequired
  getDefaultProps: ->
    time: moment()
    interval: 60000

  getInitialState: ->
    {time} = @props

    timeout: null
    time: time

  componentWillMount: ->
    @update()

  componentWillUnmount: ->
    {timeout} = @state
    clearTimeout(timeout)

  update: ->
    {interval} = @props

    timeout = setTimeout( =>
      @updateTime()
      @update()
    , interval)

    @setState({timeout})

  updateTime: ->
    {interval} = @props
    {time} = @state

    updatedTime = time.clone().add(interval, 'ms')
    @setState(time: updatedTime)

  render: ->
    {timezone} = @props
    {time} = @state
    timePreview = time.tz(timezone).format('h:mm a')

    <span className='timezone-preview'>{timePreview}</span>


SetTimezoneField = React.createClass
  displayName: 'SetTimezoneField'
  propTypes:
    courseId: React.PropTypes.string
    name: React.PropTypes.string.isRequired
    defaultValue: PropTypes.Timezone.isRequired
    onChange: React.PropTypes.func.isRequired
    autofocus: React.PropTypes.bool
    validate: React.PropTypes.func.isRequired

  getInitialState: ->
    {defaultValue} = @props
    courseTimezone: defaultValue

  onChange: (changeEvent, changeData) ->
    {value} = changeData
    @setState {courseTimezone: value}
    @props.onChange?(value)

  render: ->
    timezones = TimeHelper.getTimezones()
    {name} = @props
    {courseTimezone} = @state

    timezonesToPick = _.map timezones, (timezone) =>
      identifier = S.dasherize(timezone)

      <TutorRadio
        id={identifier}
        key="timezone-choice-#{identifier}"
        value={timezone}
        name={name}
        checked={timezone is courseTimezone}
        onChange={@onChange}/>

    <div>
      {timezonesToPick}
      <p className='course-timezone-preview'>
        <span className='course-timezone-preview-description'>Your course time will be:</span>
        <strong className='course-timezone-preview-value'>
          <TimezonePreview timezone={courseTimezone}/>
        </strong>
      </p>
    </div>


SetTimezone = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    course_timezone: CourseStore.getTimezone(@props.courseId)
    showModal: false

  close: ->
    @setState({showModal: false})

  open: ->
    @setState({showModal: true})

  validate: (timezone) ->
    error = ['review'] unless TimeHelper.isTimezoneValid(timezone)
    @setState({invalid: error?})
    error

  performUpdate: ->
    unless @state.invalid
      CourseActions.save(@props.courseId, time_zone: @state.course_timezone)
      CourseStore.once 'saved', =>
        @close()

  renderForm: ->
    formClasses = classnames 'modal-body', 'teacher-edit-course-form', 'is-invalid-form': @state?.invalid
    if @state?.invalid
      disabled = true

    <BS.Modal
      {...@props}
      show={@state.showModal}
      onHide={@close}
      className='teacher-edit-course-modal course-settings'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>Change Course Timezone</BS.Modal.Title>
      </BS.Modal.Header>

      <div className={formClasses} >
        <SetTimezoneField
        name='course-timezone'
        defaultValue={CourseStore.getTimezone(@props.courseId)}
        onChange={(val) => @setState(course_timezone: val)}
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
        Save
        </AsyncButton>
      </div>
    </BS.Modal>

  render: ->
    <span className='-set-timezone-course-link'>
      <BS.Button onClick={@open} bsStyle='link' className='edit-course'>
        <i className='fa fa-pencil' /> Change Course Timezone
      </BS.Button>
      {@renderForm()}
    </span>

module.exports = SetTimezone
