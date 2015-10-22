React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput} = require '../tutor-input'
BindStoreMixin = require '../bind-store-mixin'
PeriodNameMixin = require '../period-name-mixin'


AddPeriodField = React.createClass

  displayName: 'AddPeriodField'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    label: React.PropTypes.string.isRequired
    name:  React.PropTypes.string.isRequired
    default: React.PropTypes.string.isRequired
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

  mixins: [BindStoreMixin, PeriodNameMixin]
  bindStore: PeriodStore
  bindEvent: 'create'

  getInitialState: ->
    warning: ''

  performUpdate: ->
    name = @validatePeriodName(@state.period_name, @props.periods)
    if not name.error
      @refs.overlay.hide()
      PeriodActions.create(@props.courseId, period: {name: @state.period_name})
    else
      @setState(warning: name.error)

  renderForm: ->
    <BS.Modal
      {...@props}
      title={'Add Period'}
      className="teacher-add-period-form">

      <div className='modal-body'>
        <AddPeriodField label='Period Name' name='period_name' default={@state.period_name}
          onChange={(val) => @setState(period_name: val)} autofocus />

        <div className='warning'>
          {@state.warning}
        </div>

        <BS.Button className='-add-period-confirm' onClick={@performUpdate}>
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
        <BS.Button bsStyle='link' className='add-period'>
          <i className='fa fa-plus' /> Add Period
        </BS.Button>
    </BS.OverlayTrigger>
