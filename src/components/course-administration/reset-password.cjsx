React = require 'react'
BS = require 'react-bootstrap'
{RosterActions} = require '../../flux/roster'

PasswordResetField = React.createClass
  mixins: [React.addons.LinkedStateMixin]

  getInitialState: ->
    password: ''

  getValue: -> @state.password

  componentDidMount: ->
    React.findDOMNode(@refs.input).focus()

  render: ->
    <input autofocus ref='input' valueLink={@linkState('password')}
      type='password' className='form-control'/>

module.exports = React.createClass
  displayName: 'ResetPasswordLink'
  propTypes:
    student: React.PropTypes.object.isRequired

  performUpdate: ->
    RosterActions.save(@props.student.id, password: @refs.password.getValue())

  resetPassword: ->
    <BS.Popover title={'Update password:'} {...@props}>
      <PasswordResetField ref='password' />

      <BS.Button block onClick={@performUpdate}>
        Update <i className='fa fa-angle-double-right'/>
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='left'
      overlay={@resetPassword()}>
        <a><i className='fa fa-key' /> Reset Password</a>
    </BS.OverlayTrigger>
