React = require 'react'
BS = require 'react-bootstrap'
{RosterActions} = require '../../flux/roster'

PasswordResetField = React.createClass
  displayName: 'ResetStudentPasswordField'


  getInitialState: ->
    password: ''

  getValue: -> @state.password

  componentDidMount: ->
    ReactDOM.findDOMNode(@refs.input).focus()
  set: (ev) ->
    @setState(val: ev.target.value)
  render: ->
    <input autofocus ref='input' value={@state.val}
      type='password' className='form-control' onChange={@set} />

module.exports = React.createClass
  displayName: 'ResetPasswordLink'
  propTypes:
    student:  React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired

  performUpdate: ->
    RosterActions.save(@props.student.id, password: @refs.password.getValue())
    @refs.overlay.hide()

  resetPassword: ->
    <BS.Popover title={'Update password:'}>
      <PasswordResetField ref='password' />

      <BS.Button block onClick={@performUpdate}>
        Update <i className='fa fa-angle-double-right'/>
      </BS.Button>
    </BS.Popover>

  render: ->
    <BS.OverlayTrigger ref='overlay' rootClose={true} trigger='click' placement='left'
      overlay={@resetPassword()}>
        <a><i className='fa fa-key' /> Reset Password</a>
    </BS.OverlayTrigger>
