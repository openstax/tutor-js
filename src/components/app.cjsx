React = require 'react'
BS = require 'react-bootstrap'
{RouteHandler, Link} = require 'react-router'

{CurrentUserActions} = require '../flux/current-user'

module.exports = React.createClass
  displayName: 'App'

  logout: -> CurrentUserActions.logout()

  render: ->
    <div>
      <div className='navbar navbar-default navbar-fixed-top' role='navigation'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#ui-navbar-collapse'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>

            <Link to='dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Link>

          </div>

          <div className='collapse navbar-collapse' id='ui-navbar-collapse'>
            <ul className='nav navbar-nav'>
              <li>
                <Link to='tasks'>Tasks</Link>
              </li>
            </ul>
            <ul className='nav navbar-nav navbar-right'>
              <li>
                <BS.Button bsStyle='link' onClick={@logout}>Sign out!</BS.Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <RouteHandler/>
    </div>
