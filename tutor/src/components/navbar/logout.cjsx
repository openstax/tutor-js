React = require 'react'
{CurrentUserStore} = require '../../flux/current-user'
classnames = require 'classnames'
LOGOUT_URL = '/accounts/logout'
LOGOUT_URL_CC = '/accounts/logout?cc=true'

CSRF_Token = CurrentUserStore.getCSRFToken()

LogoutLink = React.createClass

  propTypes:
    label: React.PropTypes.string

  getDefaultProps: ->
    label: 'Log out'

  onLinkClick: (ev) ->
    ev.currentTarget.querySelector('form').submit()

  render: ->
    {className, children, isConceptCoach} = @props
    classes = classnames(className)

    <li className='logout'>
      <a href='#' onClick={@onLinkClick} >
        <form
          acceptCharset='UTF-8'
          action={if isConceptCoach then LOGOUT_URL_CC else LOGOUT_URL}
          className='-logout-form'
          method='post'>
          <input type='hidden' name='_method' value='delete'/>
          <input type='hidden' name='authenticity_token' value={CSRF_Token}/>
          <input type='submit' aria-label={@props.label} value={@props.label} />
        </form>
      </a>
    </li>

module.exports = LogoutLink
