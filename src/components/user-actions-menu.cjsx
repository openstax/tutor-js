React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'


UserActionsMenu = React.createClass
  propTypes:
    user:  React.PropTypes.object.isRequired

  componentWillMount: ->
    @crsfToken =
      document.querySelector('meta[name=csrf-token]')?.getAttribute('content')

  render: ->
    name = @props.user?.full_name or
      [@props.user?.first_name, @props.user?.last_name].join(' ')
    <BS.Nav right navbar>

      <BS.NavDropdown
        eventKey={1}
        id='navbar-dropdown'
        title={name}
        ref='navDropDown'>
        <li className='logout'>
          <a href='#' onClick={@onLinkClick} >
            <form
              acceptCharset='UTF-8'
              action={'/accounts/logout'}
              className='-logout-form'
              method='post'
            >
              <input type='hidden' name='_method' value='delete'/>
              <input type='hidden' name='authenticity_token' value={@crsfToken}/>
              <input type='submit' aria-label="Log Out" value='Log Out' />
            </form>
          </a>
        </li>

      </BS.NavDropdown>
    </BS.Nav>


module.exports = UserActionsMenu
