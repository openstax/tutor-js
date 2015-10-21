React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{RosterActions, RosterStore} = require '../../flux/roster'
{TutorInput} = require '../tutor-input'
BindStoreMixin = require '../bind-store-mixin'
PeriodNameMixin = require '../period-name-mixin'


BLANK_PERIOD = period: {name: ''}

Field = React.createClass

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
  bindStore: RosterStore
  bindEvent: 'created'

  getInitialState: ->
    _.clone(BLANK_PERIOD)

  performUpdate: ->
    name = @validatePeriodName(@state.period_name, @props.periods)
    if name.valid
      console.log(@state.period_name)
      #@refs.overlay.hide()
      #RosterActions.create(@props.courseId, @state)
      #@setState(_.clone(BLANK_PERIOD))
    else
      @displayValidationWarning(name.error)

  displayValidationWarning: (error) ->
    @state.warning = error
    @forceUpdate()

  renderForm: ->
    <BS.Modal
      {...@props}
      title={'Add Period'}
      className="teacher-add-period-form">

      <div className='modal-body'>
        <Field label='Period Name' name='period_name' default={@state.period_name}
          onChange={(val) => @setState(period_name: val)} autofocus />

        <div className='warning'>
          {@state.warning}
        </div>

        <BS.Button onClick={@performUpdate}>
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
        <a><i className='fa fa-plus' /> Add Period</a>
    </BS.OverlayTrigger>
