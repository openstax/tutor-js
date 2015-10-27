React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput} = require '../tutor-input'
BindStoreMixin = require '../bind-store-mixin'


RenamePeriodField = React.createClass

  displayName: 'RenamePeriodField'
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
  displayName: 'RenamePeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    periods: React.PropTypes.array.isRequired
    activeTab: React.PropTypes.number.isRequired

  mixins: [BindStoreMixin]
  bindStore: PeriodStore
  bindEvent: 'save'

  getInitialState: ->
    warning: ''
    period_name: @getActivePeriodName(@props.activeTab, @props.periods)

  getActivePeriodName: (active, periods) ->
    for period, i in periods
      if i is active then tab = period.name
    tab

  performUpdate: ->
    name = PeriodStore.validatePeriodName(@state.period_name, @props.periods)
    if not name.error
      @refs.overlay.hide()
      PeriodActions.save(@props.courseId, period: {name: @state.period_name})
    else
      @setState(warning: name.error)

  renderForm: ->
    <BS.Modal
      {...@props}
      title={'Rename Period'}
      className="teacher-edit-period-form">

      <div className='modal-body'>
        <RenamePeriodField
        label='Period Name'
        name='period_name'
        default={@getActivePeriodName(@props.activeTab, @props.periods)}
        onChange={(val) => @setState(period_name: val)} 
        autofocus />

        <div className='warning'>
          {@state.warning}
        </div>

        <BS.Button className='-edit-period-confirm' onClick={@performUpdate}>
          Rename
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
          <i className='fa fa-plus' /> Rename Period
        </BS.Button>
    </BS.OverlayTrigger>
