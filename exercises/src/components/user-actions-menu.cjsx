React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'


UserActionsMenu = React.createClass
  propTypes:
    user:  React.PropTypes.object

  componentWillMount: ->
    @crsfToken =
      document.querySelector('meta[name=csrf-token]')?.getAttribute('content')

  onLogoutClick: ->
    @refs.logoutForm.submit()

  render: ->
    name = @props.user?.full_name or
      [@props.user?.first_name, @props.user?.last_name].join(' ')
    <BS.Nav pullRight navbar>

      <BS.NavDropdown
        eventKey={1}
        id='navbar-dropdown'
        title={name}
        ref='navDropDown'>
        <BS.MenuItem className='logout'>
          <form
            ref='logoutForm'
            acceptCharset='UTF-8'
            action={'/accounts/logout'}
            className='-logout-form'
            method='post'
          >
            <input type='hidden' name='_method' value='delete'/>
            <input type='hidden' name='authenticity_token' value={@crsfToken}/>
            <input type='submit' aria-label="Log Out" value='Log Out' onClick={@onLogoutClick} />
          </form>
        </BS.MenuItem>

      </BS.NavDropdown>
    </BS.Nav>


module.exports = UserActionsMenu
