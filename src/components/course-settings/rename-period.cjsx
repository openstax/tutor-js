React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput} = require '../tutor-input'


RenamePeriodField = React.createClass

  displayName: 'RenamePeriodField'
  propTypes:
    courseId: React.PropTypes.string
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
    activeTab: React.PropTypes.object.isRequired

  getInitialState: ->
    warning: ''
    period_name: @props.activeTab.name

  performUpdate: ->
    name = PeriodStore.validatePeriodName(@state.period_name, @props.periods)
    if name.error
      @setState(warning: name.error)
    else
      @refs.overlay.hide()
      id = @props.activeTab.id
      PeriodActions.save(@props.courseId, id, period: {name: @state.period_name})

  renderForm: ->
    <BS.Modal
      {...@props}
      title={'Rename Period'}
      className="teacher-edit-period-form">

      <div className='modal-body'>
        <RenamePeriodField
        label='Period Name'
        name='period_name'
        default={@props.activeTab.name}
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
          <i className='fa fa-pencil' /> Rename Period
        </BS.Button>
    </BS.OverlayTrigger>
