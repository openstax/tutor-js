React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{RosterActions, RosterStore} = require '../../flux/roster'
{TutorInput} = require '../tutor-input'
BindStoreMixin = require '../bind-store-mixin'

BLANK_STUDENT = first_name: '', last_name: '', email: '', password: ''

Field = React.createClass
  displayName: 'AddStudentField'
  propTypes:
    label: React.PropTypes.string.isRequired
    name:  React.PropTypes.string.isRequired
    value: React.PropTypes.string.isRequired
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
      value={@props.value}
      required={true}
      onChange={@onChange} />

module.exports = React.createClass
  displayName: 'AddStudentLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired

  mixins: [BindStoreMixin]
  bindStore: RosterStore
  bindEvent: 'created'

  getInitialState: ->
    _.clone(BLANK_STUDENT)

  performUpdate: ->
    this.refs.overlay.hide()
    student = _.extend( _.clone(@state),
      period_id: @props.period.id
    )
    RosterActions.create(@props.courseId, student)
    @setState(_.clone(BLANK_STUDENT))

  renderForm: ->
    <BS.Popover className='teacher-add-student-form'
      title={'Student Information:'} {...@props}>

      <Field label='First Name' name='first_name' value={@state.first_name}
        onChange={(val) => @setState(first_name: val)} autofocus />

      <Field label='Last Name' name='last_name' value={@state.last_name}
        onChange={(val) => @setState(last_name: val)} />

      <Field label='Email' name='email' value={@state.email}
        onChange={(val) => @setState(email: val)} />

      <Field label='Password' name='password' value={@state.password}
        onChange={(val) => @setState(password: val)} />

      <BS.Button block onClick={@performUpdate}>
        Create <i className='fa fa-angle-double-right'/>
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger ref='overlay' rootClose={true}  trigger='click' placement='right'
      overlay={@renderForm()}>
        <BS.Button block>
          <i className='fa fa-plus' /> Add Student
        </BS.Button>
    </BS.OverlayTrigger>
