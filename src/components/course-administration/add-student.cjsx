React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{RosterActions, RosterStore} = require '../../flux/roster'
{TutorInput} = require '../tutor-input'

Field = React.createClass
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
  displayName: 'ResetPasswordLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired

  getInitialState: ->
    first_name: '', last_name: '', email: '', password: ''

  performUpdate: ->
    student = _.extend( _.clone(@state),
      period_id: @props.period.id
    )
    RosterActions.create(@props.courseId, student)

  renderForm: ->
    <BS.Popover className="teacher-add-student-form"
      title={'Student Information:'} {...@props}>

      <Field label="First Name" name="first_name" value={@state.first_name}
        onChange={(val) => @setState(first_name: val)} autofocus />

      <Field label="Last Name" name="last_name" value={@state.last_name}
        onChange={(val) => @setState(last_name: val)} />

      <Field label="Email" name="email" value={@state.email}
        onChange={(val) => @setState(email: val)} />

      <Field label="Password" name="password" value={@state.password}
        onChange={(val) => @setState(password: val)} />

      <BS.Button block onClick={@performUpdate}>
        Create <i className='fa fa-angle-double-right'/>
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='right'
      overlay={@renderForm()}>
        <BS.Button block>
          <i className='fa fa-plus' /> Add Student
        </BS.Button>
    </BS.OverlayTrigger>
