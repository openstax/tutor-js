React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput} = require '../tutor-input'


AddPeriodField = React.createClass

  displayName: 'AddPeriodField'
  propTypes:
    courseId: React.PropTypes.string
    label: React.PropTypes.string.isRequired
    name:  React.PropTypes.string.isRequired
    default: React.PropTypes.string
    onChange:  React.PropTypes.func.isRequired
    autofocus: React.PropTypes.bool
    validate: React.PropTypes.func.isRequired

  componentDidMount: ->
    @refs.input.focus() if @props.autofocus

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
  displayName: 'AddPeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    periods: React.PropTypes.array.isRequired

  getInitialState: ->
    period_name: ''

  validate: (name) ->
    error = PeriodStore.validatePeriodName(name, @props.periods)
    @setState({invalid: error?})
    error

  performUpdate: ->
    if not @state.invalid
      PeriodActions.create(@props.courseId, period: {name: @state.period_name})
      @refs.overlay.hide()

  renderForm: ->
    formClasses = ['modal-body', 'teacher-edit-period-form']
    if @state?.invalid
      formClasses.push('is-invalid-form')
      disabled = true
    <BS.Modal
      {...@props}
      title={'Add Period'}
      className='teacher-edit-period-modal'>

      <div className={formClasses.join(' ')}>
        <AddPeriodField
        label='Period Name'
        name='period-name'
        default={@state.period_name}
        onChange={(val) => @setState(period_name: val)}
        validate={@validate}
        autofocus />
      </div>

      <div className='modal-footer'>
        <BS.Button
        className='-edit-period-confirm'
        onClick={@performUpdate}
        disabled={disabled}>
          Add
        </BS.Button>
      </div>

    </BS.Modal>

  render: ->
    <BS.OverlayTrigger
      ref='overlay'
      rootClose={true}
      trigger='click'
      overlay={@renderForm()}>
        <BS.Button bsStyle='link' className='edit-period'>
          <i className='fa fa-plus' /> Add Period
        </BS.Button>
    </BS.OverlayTrigger>
