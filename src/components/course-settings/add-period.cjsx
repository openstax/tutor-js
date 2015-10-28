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
      onChange={@onChange} />

module.exports = React.createClass
  displayName: 'AddPeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    periods: React.PropTypes.array.isRequired


  getInitialState: ->
    warning: ''

  performUpdate: ->
    name = PeriodStore.validatePeriodName(@state.period_name, @props.periods)
    if name.error
      @setState(warning: name.error)
    else
      @refs.overlay.hide()
      PeriodActions.create(@props.courseId, period: {name: @state.period_name})

  renderForm: ->
    <BS.Modal
      {...@props}
      title={'Add Period'}
      className="teacher-edit-period-form">

      <div className='modal-body'>
        <AddPeriodField label='Period Name' name='period_name' default={@state.period_name}
          onChange={(val) => @setState(period_name: val)} autofocus />

        <div className='warning'>
          {@state.warning}
        </div>

        <BS.Button className='-edit-period-confirm' onClick={@performUpdate}>
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
