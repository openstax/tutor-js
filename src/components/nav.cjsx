React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CurrentUserStore, CurrentUserActions} = require '../flux/current-user'

UserName = React.createClass

  getInitialState: ->
    name: CurrentUserStore.getName()

  _update: ->
    this.setState(name: CurrentUserStore.getName())

  componentWillMount: ->
    unless @state.name
      @_addListener()
      CurrentUserActions.loadName()

  render: ->
    <p className="navbar-text user-name">{@state.name}</p>

  ## These methods are all copied from Loadable.  Extract into mixin?
  _addListener: ->    CurrentUserStore.addChangeListener(@_update)
  _removeListener: -> CurrentUserStore.removeChangeListener(@_update)
  componentWillUnmount: -> @_removeListener()
  componentWillUpdate:  -> @_removeListener()
  componentDidUpdate:   -> @_addListener()


module.exports = React.createClass
  displayName: 'Navigation'

  contextTypes:
    router: React.PropTypes.func

  logout: -> CurrentUserActions.logout()

  render: ->

    <div className='navbar navbar-default navbar-fixed-top' role='navigation'>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <button
              type='button'
              className='navbar-toggle collapsed'
              data-toggle='collapse'
              data-target='#ui-navbar-collapse'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>

          <Router.Link to='dashboard' className='navbar-brand'>
            <i className='ui-brand-logo'></i>
          </Router.Link>

        </div>

        <div className='collapse navbar-collapse' id='ui-navbar-collapse'>
          <ul className='nav navbar-nav'>
            <li>
              <Router.Link to='dashboard'>Dashboard</Router.Link>
            </li>
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li>
              <UserName/>
            </li>
            <li>
              <BS.Button bsStyle='link' onClick={@logout}>Sign out!</BS.Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
