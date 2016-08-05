React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput} = require '../tutor-input'
{AsyncButton} = require 'shared'

BindStoreMixin = require '../bind-store-mixin'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'

RenamePeriodField = React.createClass

  displayName: 'RenamePeriodField'
  propTypes:
    courseId: React.PropTypes.string
    label: React.PropTypes.object.isRequired
    name:  React.PropTypes.string.isRequired
    default: React.PropTypes.string.isRequired
    onChange:  React.PropTypes.func.isRequired
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
  displayName: 'RenamePeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired
    periods:  React.PropTypes.array.isRequired

  mixins: [BindStoreMixin]

  bindStore: PeriodStore

  bindUpdate: ->
    {courseId} = @props
    isSaving = PeriodStore.isSaving(courseId)
    @setState({isSaving}) if @state.isSaving isnt isSaving

  getInitialState: ->
    period_name: @props.period.name
    showModal: false
    isSaving: false

  close: ->
    @setState({showModal: false})

  open: ->
    @setState({showModal: true})

  validate: (name) ->
    error = PeriodStore.validatePeriodName(name, @props.periods, @props.period.name)
    @setState({invalid: error?})
    error

  performUpdate: ->
    if not @state.invalid
      id = @props.period.id
      PeriodActions.save(@props.courseId, id, name: @state.period_name)
      PeriodStore.once 'saved', =>
        @close()

  renderForm: ->
    formClasses = ['modal-body', 'teacher-edit-period-form']
    if @state?.invalid
      formClasses.push('is-invalid-form')
      disabled = true
    title =
      <h4>Rename <CourseGroupingLabel courseId={@props.courseId}/></h4>
    label =
      <span><CourseGroupingLabel courseId={@props.courseId}/> Name</span>

    <BS.Modal
      {...@props}
      show={@state.showModal}
      onHide={@close}
      className='teacher-edit-period-modal'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{title}</BS.Modal.Title>
      </BS.Modal.Header>

      <div className={formClasses.join(' ')}>
        <RenamePeriodField
        label={label}
        name='period-name'
        default={@props.period.name}
        onChange={(val) => @setState(period_name: val)}
        validate={@validate}
        autofocus />
      </div>

      <div className='modal-footer'>
        <AsyncButton
          className='-edit-period-confirm'
          onClick={@performUpdate}
          isWaiting={@state.isSaving}
          waitingText="Saving..."
          disabled={disabled}>
        Rename
        </AsyncButton>
      </div>

    </BS.Modal>

  render: ->
    <span className='control rename-period'>
      <BS.Button onClick={@open} bsStyle='link'>
        <Icon type='pencil' />
        Rename
      </BS.Button>
      {@renderForm()}
    </span>
