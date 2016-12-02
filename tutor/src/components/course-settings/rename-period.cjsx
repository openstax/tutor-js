React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

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
    invalid = @state?.invalid

    <BS.Modal
      show={@state.showModal}
      onHide={@close}
      className='settings-edit-period-modal'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>
          Rename <CourseGroupingLabel courseId={@props.courseId}/>
        </BS.Modal.Title>
      </BS.Modal.Header>

      <BS.Modal.Body className={classnames('is-invalid-form': invalid)}>
        <RenamePeriodField
          label={
            <span><CourseGroupingLabel courseId={@props.courseId}/> Name</span>
          }
          name='period-name'
          default={@props.period.name}
          onChange={(val) => @setState(period_name: val)}
          validate={@validate}
          autofocus />
      </BS.Modal.Body>

      <BS.Modal.Footer>
        <AsyncButton
          className='-edit-period-confirm'
          onClick={@performUpdate}
          isWaiting={@state.isSaving}
          waitingText="Saving..."
          disabled={invalid}>
        Rename
        </AsyncButton>
      </BS.Modal.Footer>

    </BS.Modal>

  render: ->
    <BS.Button onClick={@open} bsStyle='link' className='control rename-period'>
      <Icon type='pencil' />
      Rename
      {@renderForm()}
    </BS.Button>
